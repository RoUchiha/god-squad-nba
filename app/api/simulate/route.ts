import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { FilledRosterSlot, Sport, DraftMode } from '@/lib/types';
import { computeTeamGSPR } from '@/lib/algorithms/powerRating';
import { simulateSeason } from '@/lib/algorithms/simulator';
import { analyzeTeamComposition } from '@/lib/teamComposition';
import { explainSeasonRecord } from '@/lib/recordJustification';
import { getServerEnv } from '@/lib/serverEnv';
import { checkDailyQuota, checkRateLimit, getClientIp, isTrustedMutationRequest, readJsonBody } from '@/lib/security';
import { getDailyNbaTeamStrengths } from '@/lib/nbaLeague';
import { canonicalizeSimulationRoster, validateSimulationRoster } from '@/lib/simulationRoster';

const RateStat = z.number().finite().min(0).max(1);
const BoxScoreStat = z.number().finite().min(0).max(60);

const PlayerStatsSchema = z.object({
  points: BoxScoreStat.optional(),
  rebounds: BoxScoreStat.optional(),
  assists: BoxScoreStat.optional(),
  steals: BoxScoreStat.optional(),
  blocks: BoxScoreStat.optional(),
  fieldGoalPct: RateStat.optional(),
  threePointPct: RateStat.optional(),
  freeThrowPct: RateStat.optional(),
  turnovers: BoxScoreStat.optional(),
}).strict();

const PlayerSchema = z.object({
  id: z.string().min(1).max(80).regex(/^[a-zA-Z0-9._-]+$/),
  name: z.string().min(1).max(80),
  position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']),
  positionGroup: z.literal('offense'),
  eraId: z.string().max(50).regex(/^[a-zA-Z0-9-]+$/).optional(),
  teamId: z.string().max(20).regex(/^[a-zA-Z0-9]+$/).optional(),
  bestSeasonYear: z.number().int().min(1946).max(2100).optional(),
  yearsWithTeam: z.string().max(20),
  stats: PlayerStatsSchema,
  playerScore: z.number().min(0).max(100),
  isLegend: z.boolean().optional(),
  isAllStar: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
}).strict();

const RosterSlotSchema = z.object({
  id: z.string().min(1).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  position: z.union([z.enum(['PG', 'SG', 'SF', 'PF', 'C']), z.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C'])).max(5)]),
  label: z.string().min(1).max(40),
  group: z.literal('offense'),
  required: z.boolean(),
  player: PlayerSchema.nullable(),
}).strict();

const SimulateBodySchema = z.object({
  sport: z.literal('nba'),
  mode: z.literal('combined'),
  slots: z.array(RosterSlotSchema).max(30),
}).strict();

export async function POST(req: NextRequest) {
  if (!isTrustedMutationRequest(req)) {
    return NextResponse.json({ error: 'Cross-site requests are not allowed' }, {
      status: 403,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, {
      status: 415,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const ip = getClientIp(req);
  const requestLimit = checkRateLimit(`simulate:${ip}`, { limit: 12, windowMs: 60_000 });
  if (!requestLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many simulation requests' },
      { status: 429, headers: { 'Retry-After': String(requestLimit.retryAfter), 'Cache-Control': 'no-store' } }
    );
  }

  const bodyResult = await readJsonBody(req);
  if (!bodyResult.ok) {
    return NextResponse.json(
      { error: bodyResult.reason === 'too-large' ? 'Request body is too large' : 'Invalid JSON body' },
      { status: bodyResult.reason === 'too-large' ? 413 : 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const parsed = SimulateBodySchema.safeParse(bodyResult.value);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data' }, {
      status: 400,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const { sport, mode, slots } = parsed.data;

  // Type-cast validated data back to our domain types
  const submittedSlots = slots as unknown as FilledRosterSlot[];
  const rosterError = validateSimulationRoster(submittedSlots);
  if (rosterError) {
    return NextResponse.json({ error: rosterError }, { status: 400 });
  }
  const canonical = canonicalizeSimulationRoster(submittedSlots);
  if (!canonical.slots) {
    return NextResponse.json({ error: canonical.error }, { status: 400 });
  }
  const typedSlots = canonical.slots;
  const canonicalRosterError = validateSimulationRoster(typedSlots);
  if (canonicalRosterError) {
    return NextResponse.json({ error: canonicalRosterError }, { status: 400 });
  }

  const teamPower = computeTeamGSPR(typedSlots, sport as Sport, mode as DraftMode);
  const compositionAnalysis = analyzeTeamComposition(typedSlots);
  const teamStrengths = await getDailyNbaTeamStrengths();
  const results = simulateSeason(teamPower, sport as Sport, compositionAnalysis, teamStrengths, typedSlots);
  const env = getServerEnv();
  const perIpQuota = env.OPENAI_API_KEY
    ? checkDailyQuota(`openai:ip:${ip}`, Math.min(20, env.OPENAI_DAILY_REQUEST_LIMIT))
    : { allowed: false as const, retryAfter: 0 };
  const globalQuota = env.OPENAI_API_KEY && perIpQuota.allowed
    ? checkDailyQuota('openai:global', env.OPENAI_DAILY_REQUEST_LIMIT)
    : { allowed: false as const, retryAfter: 0 };
  const explanation = await explainSeasonRecord(results, typedSlots, perIpQuota.allowed && globalQuota.allowed);

  return NextResponse.json({ ...results, ...explanation }, {
    headers: {
      'Cache-Control': 'no-store', // Each simulation is unique
    },
  });
}
