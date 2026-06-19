import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { PlayersResponse } from '@/lib/types';
import { generateTeamEras } from '@/lib/constants';
import { NBA_TEAMS, fetchNBAPlayers } from '@/lib/sports/nba';
import { getServerEnv } from '@/lib/serverEnv';
import { checkRateLimit, getClientIp } from '@/lib/security';

const QuerySchema = z.object({
  teamId: z.string().min(1).max(20).regex(/^[a-zA-Z0-9]+$/),
  eraId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9-]+$/),
});

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = checkRateLimit(`players:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    teamId: searchParams.get('teamId') ?? '',
    eraId: searchParams.get('eraId') ?? '',
  });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing or invalid teamId/eraId' }, { status: 400 });
  }

  const { teamId, eraId } = parsed.data;

  const team = NBA_TEAMS.find(t => t.id === teamId);
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const era = generateTeamEras(team).find(e => e.id === eraId);
  if (!era) {
    return NextResponse.json({ error: 'Era not found for this team' }, { status: 404 });
  }

  try {
    const players = await fetchNBAPlayers(team, era, getServerEnv().BALLDONTLIE_API_KEY);
    const response: PlayersResponse = { players, era, team };
    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('[players/nba] Error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json({ error: 'Failed to fetch player data.' }, { status: 502 });
  }
}
