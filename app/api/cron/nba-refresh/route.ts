'use server';

import { NextRequest, NextResponse } from 'next/server';
import { requireCronSecret } from '@/lib/serverEnv';
import { getDailyNbaTeamStrengths } from '@/lib/nbaLeague';

/**
 * Protected health check for the pinned 2024-25 opponent baseline.
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization');
  let expectedSecret: string;

  try {
    expectedSecret = requireCronSecret();
  } catch {
    return NextResponse.json({ error: 'Cron endpoint is not configured' }, { status: 500 });
  }

  if (secret !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  });
}
