'use server';

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { requireCronSecret } from '@/lib/serverEnv';
import { getDailyNbaTeamStrengths } from '@/lib/nbaLeague';
import { checkRateLimit, getClientIp } from '@/lib/security';

function matchesSecret(actual: string | null, expected: string): boolean {
  const actualBuffer = Buffer.from(actual ?? '', 'utf8');
  const expectedBuffer = Buffer.from(`Bearer ${expected}`, 'utf8');
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

/**
 * Protected health check for the pinned 2024-25 opponent baseline.
 */
export async function GET(req: NextRequest) {
  const limit = checkRateLimit(`cron:${getClientIp(req)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfter), 'Cache-Control': 'no-store' },
    });
  }

  const secret = req.headers.get('authorization');
  let expectedSecret: string;

  try {
    expectedSecret = requireCronSecret();
  } catch {
    return NextResponse.json({ error: 'Cron endpoint is not configured' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  if (!matchesSecret(secret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const teamStrengths = await getDailyNbaTeamStrengths();

  return NextResponse.json({
    refreshed: new Date().toISOString(),
    strengthSnapshotDate: teamStrengths[0]?.snapshotDate,
    baselineTeams: teamStrengths.filter(team => team.source === '2024-25-baseline').length,
    fallbackTeams: teamStrengths.filter(team => team.source === 'hardcoded-fallback').length,
    teams: teamStrengths.map(team => ({
      abbreviation: team.abbreviation,
      gspr: team.gspr,
      offense: Math.round(team.offenseScore),
      defense: Math.round(team.defenseScore),
      source: team.source,
    })),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
