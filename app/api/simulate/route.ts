import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { FilledRosterSlot, Sport, DraftMode } from '@/lib/types';
import { computeTeamGSPR } from '@/lib/algorithms/powerRating';
import { simulateSeason } from '@/lib/algorithms/simulator';
import { analyzeTeamComposition } from '@/lib/teamComposition';
import { explainSeasonRecord } from '@/lib/recordJustification';
import { getServerEnv } from '@/lib/serverEnv';
import { checkDailyQuota, checkRateLimit, getClientIp } from '@/lib/security';
import { getDailyNbaTeamStrengths } from '@/lib/nbaLeague';

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
  const ip = getClientIp(req);
  const requestLimit = checkRateLimit(`simulate:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!requestLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many simulation requests' },
      { status: 429, headers: { 'Retry-After': String(requestLimit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = SimulateBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request data', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { sport, mode, slots } = parsed.data;

  // Type-cast validated data back to our domain types
  const typedSlots = slots as unknown as FilledRosterSlot[];

  const teamPower = computeTeamGSPR(typedSlots, sport as Sport, mode as DraftMode);
  const compositionAnalysis = analyzeTeamComposition(typedSlots);
  const teamStrengths = await getDailyNbaTeamStrengths();
  const results = simulateSeason(teamPower, sport as Sport, compositionAnalysis, teamStrengths, typedSlots);
  const env = getServerEnv();
  const quota = env.OPENAI_API_KEY
    ? checkDailyQuota(`openai:${ip}`, env.OPENAI_DAILY_REQUEST_LIMIT)
    : { allowed: true as const };
  const explanation = await explainSeasonRecord(results, typedSlots, quota.allowed);

  return NextResponse.json({ ...results, ...explanation }, {
    headers: {
      'Cache-Control': 'no-store', // Each simulation is unique
    },
  });
}
