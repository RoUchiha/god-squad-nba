import { describe, expect, it } from 'vitest';
import type { FilledRosterSlot, HistoricalTeam, Player } from '../lib/types';
import { computeTeamGSPR } from '../lib/algorithms/powerRating';
import { simulateSeason } from '../lib/algorithms/simulator';
import { gameReducer, INITIAL_GAME_STATE, type GameState } from '../components/GameContainer';
import { generateTeamEras } from '../lib/constants';
import { effectivePlayerScore } from '../lib/effectivePlayerScore';
import type { EraQueueItem } from '../lib/eraQueue';
import { selectGambleReplacement } from '../lib/gamble';
import { explainSeasonRecord } from '../lib/recordJustification';
import { canSwapRosterSlots, swapRosterSlots } from '../lib/rosterActions';
import { canonicalizeSimulationRoster, validateSimulationRoster } from '../lib/simulationRoster';
import { getCuratedNBAPlayers, NBA_TEAMS } from '../lib/sports/nba';

function player(overrides: Partial<Player>): Player {
  return {
    id: 'p-1',
    name: 'Player One',
    position: 'PG',
    positionGroup: 'offense',
    yearsWithTeam: '2000-2004',
    stats: {
      points: 16,
      rebounds: 4,
      assists: 4,
      steals: 1,
      blocks: 0.3,
      fieldGoalPct: 0.45,
      threePointPct: 0.35,
      freeThrowPct: 0.78,
    },
    playerScore: 80,
    ...overrides,
  };
}

function slot(overrides: Partial<FilledRosterSlot>): FilledRosterSlot {
  return {
    id: 'pg',
    label: 'Point Guard',
    position: 'PG',
    group: 'offense',
    required: true,
    player: null,
    ...overrides,
  };
}

const testTeam: HistoricalTeam = {
  id: '2',
  name: 'Celtics',
  city: 'Boston',
  abbreviation: 'BOS',
  sport: 'nba',
  primaryColor: '#007A33',
  secondaryColor: '#BA9653',
};

function queueItem(startYear = 1985): EraQueueItem {
  const eraId = `nba-2-${startYear}`;
  return {
    key: `2-${eraId}`,
    team: testTeam,
    era: {
      id: eraId,
      name: `${startYear} Celtics`,
      startYear,
      endYear: startYear + 4,
      sport: 'nba',
      teamId: testTeam.id,
      description: 'Test era',
    },
    weight: 1,
    elitePlayerCount: 0,
    legendCount: 0,
  };
}

function gameState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...INITIAL_GAME_STATE,
    rerolls: { ...INITIAL_GAME_STATE.rerolls },
    seenTeamEraKeys: new Set(INITIAL_GAME_STATE.seenTeamEraKeys),
    slots: INITIAL_GAME_STATE.slots.map(item => ({ ...item })),
    ...overrides,
  };
}

function completeRoster(sixthMan: Player): FilledRosterSlot[] {
  return [
    slot({ id: 'pg', position: 'PG', label: 'Point Guard', player: player({ id: 'pg', name: 'Point Guard', position: 'PG' }) }),
    slot({ id: 'sg', position: 'SG', label: 'Shooting Guard', player: player({ id: 'sg', name: 'Shooting Guard', position: 'SG' }) }),
    slot({ id: 'sf', position: 'SF', label: 'Small Forward', player: player({ id: 'sf', name: 'Small Forward', position: 'SF' }) }),
    slot({ id: 'pf', position: 'PF', label: 'Power Forward', player: player({ id: 'pf', name: 'Power Forward', position: 'PF' }) }),
    slot({ id: 'c', position: 'C', label: 'Center', player: player({ id: 'c', name: 'Center', position: 'C' }) }),
    slot({ id: '6man', position: sixthMan.position, label: `${sixthMan.position} 6th Man`, player: sixthMan }),
  ];
}

describe('gameplay mechanics', () => {
  it('position swap exchanges two roster players and rejects incompatible targets', () => {
    const magic = player({ id: 'magic', name: 'Magic Johnson', position: 'PG', playerScore: 96 });
    const wade = player({ id: 'wade', name: 'Dwyane Wade', position: 'SG', playerScore: 96 });
    const shaq = player({ id: 'shaq', name: "Shaquille O'Neal", position: 'C', playerScore: 99 });
    const slots = [
      slot({ id: 'pg', position: 'PG', label: 'Point Guard', player: magic }),
      slot({ id: 'sg', position: 'SG', label: 'Shooting Guard', player: wade }),
      slot({ id: 'c', position: 'C', label: 'Center', player: shaq }),
    ];

    expect(canSwapRosterSlots(slots, 'pg', 'sg')).toBe(true);
    expect(swapRosterSlots(slots, 'pg', 'sg')?.find(item => item.id === 'sg')?.player?.name).toBe('Magic Johnson');
    expect(canSwapRosterSlots(slots, 'pg', 'c')).toBe(false);
    expect(swapRosterSlots(slots, 'pg', 'c')).toBeNull();
  });

  it('position swap preserves the player pool, era queue, rerolls, and simulation state', () => {
    const magic = player({ id: 'magic', name: 'Magic Johnson', position: 'PG', playerScore: 96 });
    const wade = player({ id: 'wade', name: 'Dwyane Wade', position: 'SG', playerScore: 96 });
    const shaq = player({ id: 'shaq', name: "Shaquille O'Neal", position: 'C', playerScore: 99 });
    const slots = [
      slot({ id: 'pg', position: 'PG', player: magic }),
      slot({ id: 'sg', position: 'SG', player: wade }),
      slot({ id: 'c', position: 'C', player: shaq }),
    ];
    const eraQueue = [queueItem()];
    const players = [player({ id: 'pool', name: 'Pool Player' })];
    const original = gameState({ phase: 'ready', slots, eraQueue, players, simulationCount: 1 });
    const started = gameReducer(original, { type: 'START_ROSTER_SWAP', slotId: 'pg' });
    const invalid = gameReducer(started, { type: 'COMMIT_ROSTER_SWAP', slotId: 'c' });

    expect(invalid.slots).toBe(slots);
    expect(invalid.eraQueue).toBe(eraQueue);
    expect(invalid.players).toBe(players);
    expect(invalid.rerolls).toBe(original.rerolls);
    expect(invalid.positionSwapUsed).toBe(false);
    expect(invalid.swapSlotId).toBe('pg');

    const swapped = gameReducer(invalid, { type: 'COMMIT_ROSTER_SWAP', slotId: 'sg' });
    expect(swapped.slots.find(item => item.id === 'pg')?.player).toBe(wade);
    expect(swapped.slots.find(item => item.id === 'sg')?.player).toBe(magic);
    expect(swapped.eraQueue).toBe(eraQueue);
    expect(swapped.players).toBe(players);
    expect(swapped.simulationCount).toBe(1);
    expect(swapped.positionSwapUsed).toBe(true);
  });

  it('era reroll succeeds independently and an unavailable reroll preserves its token', () => {
    const current = queueItem(1980);
    const candidate = queueItem(1985);
    const base = gameState({
      phase: 'ready',
      team: testTeam,
      era: current.era,
      eraQueue: [candidate],
      rerolls: { teamUsed: false, eraUsed: false },
    });
    const rerolled = gameReducer(base, { type: 'REROLL_ERA' });

    expect(rerolled.team).toBe(testTeam);
    expect(rerolled.era).toBe(candidate.era);
    expect(rerolled.rerolls).toEqual({ teamUsed: false, eraUsed: true });
    expect(rerolled.eraQueue).toEqual([]);

    const unavailableBase = gameState({
      phase: 'ready',
      team: testTeam,
      era: current.era,
      eraQueue: [],
      rerolls: { teamUsed: false, eraUsed: false },
    });
    const unavailable = gameReducer(unavailableBase, { type: 'REROLL_ERA' });

    expect(unavailable.rerolls).toEqual({ teamUsed: false, eraUsed: false });
    expect(unavailable.eraQueue).toBe(unavailableBase.eraQueue);
    expect(unavailable.error).toMatch(/No unused era reroll/);
  });

  it('gamble selects the highest-rated compatible non-duplicate replacement', () => {
    const current = player({ id: 'current', name: 'Current Guard', position: 'SG', playerScore: 83 });
    const duplicate = player({ id: 'dup', name: 'Current Guard', position: 'SG', playerScore: 99 });
    const better = player({ id: 'better', name: 'Better Guard', position: 'SG', playerScore: 91 });
    const wrongPosition = player({ id: 'center', name: 'Great Center', position: 'C', playerScore: 98 });
    const slots = [slot({ id: 'sg', position: 'SG', label: 'Shooting Guard', player: current })];

    expect(selectGambleReplacement(slots, 'sg', [duplicate, wrongPosition, better])).toBe(better);
  });

  it('gamble is completion-only, consumes one unseen era, and updates the derived GSPR', () => {
    const current = player({ id: 'current', name: 'Current Guard', position: 'SG', playerScore: 70 });
    const replacement = player({ id: 'replacement', name: 'Replacement Guard', position: 'SG', playerScore: 95 });
    const slots = [slot({ id: 'sg', position: 'SG', player: current })];
    const item = queueItem();
    const ready = gameState({ phase: 'ready', slots, eraQueue: [item] });

    expect(gameReducer(ready, { type: 'REQUEST_GAMBLE', slotId: 'sg' })).toBe(ready);

    const complete = gameState({ phase: 'complete', slots, eraQueue: [item] });
    const requested = gameReducer(complete, { type: 'REQUEST_GAMBLE', slotId: 'sg' });
    const pending = gameReducer(requested, { type: 'CONFIRM_GAMBLE' });
    const beforeGspr = computeTeamGSPR(pending.slots, 'nba', 'combined').gspr;
    const applied = gameReducer(pending, {
      type: 'APPLY_GAMBLE',
      slotId: 'sg',
      item,
      player: replacement,
      loadId: pending.loadId,
    });

    expect(applied.gambleUsed).toBe(true);
    expect(applied.eraQueue).toEqual([]);
    expect(applied.seenTeamEraKeys.has(item.key)).toBe(true);
    expect(applied.slots[0].player).toBe(replacement);
    expect(computeTeamGSPR(applied.slots, 'nba', 'combined').gspr).toBeGreaterThan(beforeGspr);
    expect(gameReducer(applied, { type: 'REQUEST_GAMBLE', slotId: 'sg' })).toBe(applied);
  });

  it('sixth man specialist floor is slot-aware and feeds GSPR', () => {
    const manu = player({
      id: 'manu',
      name: 'Manu Ginobili',
      position: 'SG',
      playerScore: 84,
      stats: { points: 19.5, rebounds: 4.8, assists: 4.5, steals: 1.5, blocks: 0.4, fieldGoalPct: 0.464, threePointPct: 0.401, freeThrowPct: 0.860 },
    });
    const crawford = player({
      id: 'crawford',
      name: 'Jamal Crawford',
      position: 'SG',
      playerScore: 94,
    });
    const regularSlot = slot({ id: 'sg', position: 'SG', label: 'Shooting Guard', player: manu });
    const sixthSlot = slot({ id: '6man', position: 'SG', label: 'SG 6th Man', player: manu });
    const highNativeSixthSlot = slot({ id: '6man', position: 'SG', label: 'SG 6th Man', player: crawford });

    expect(effectivePlayerScore(regularSlot, manu)).toBe(84);
    expect(effectivePlayerScore(sixthSlot, manu)).toBe(90);
    expect(effectivePlayerScore(highNativeSixthSlot, crawford)).toBe(94);
    expect(computeTeamGSPR([sixthSlot], 'nba', 'combined').gspr).toBeGreaterThan(
      computeTeamGSPR([regularSlot], 'nba', 'combined').gspr
    );
  });

  it('simulation stat lines use the same sixth man effective score', () => {
    const manu = player({
      id: 'manu',
      name: 'Manu Ginobili',
      position: 'SG',
      playerScore: 84,
      stats: { points: 19.5, rebounds: 4.8, assists: 4.5, steals: 1.5, blocks: 0.4, fieldGoalPct: 0.464, threePointPct: 0.401, freeThrowPct: 0.860 },
    });
    const sixthSlot = slot({ id: '6man', position: 'SG', label: 'SG 6th Man', player: manu });
    const teamPower = computeTeamGSPR([sixthSlot], 'nba', 'combined');
    const results = simulateSeason(teamPower, 'nba', { pros: [], cons: [] }, undefined, [sixthSlot]);

    expect(results.rosterStats.find(line => line.playerId === 'manu')?.playerScore).toBe(90);
  });

  it('simulation roster validation accepts a base-rated specialist and rejects invalid lineups', () => {
    const manu = player({ id: 'manu', name: 'Manu Ginobili', position: 'SG', playerScore: 84 });
    const valid = completeRoster(manu);

    expect(validateSimulationRoster(valid)).toBeNull();
    expect(effectivePlayerScore(valid[5], manu)).toBe(90);
    expect(validateSimulationRoster(valid.slice(0, 5))).toMatch(/complete six-player roster/i);

    const duplicate = valid.map((item, index) => index === 5
      ? { ...item, player: valid[1].player }
      : item);
    expect(validateSimulationRoster(duplicate)).toMatch(/Duplicate players/i);

    const wrongPosition = valid.map(item => item.id === 'c'
      ? { ...item, player: player({ id: 'wrong-c', name: 'Wrong Center', position: 'PG' }) }
      : item);
    expect(validateSimulationRoster(wrongPosition)).toMatch(/not eligible/i);
  });

  it('canonicalizes submitted players so forged ratings and stats cannot affect simulation', () => {
    const warriors = NBA_TEAMS.find(team => team.abbreviation === 'GSW')!;
    const era = generateTeamEras(warriors).find(item => item.id === 'nba-10-2020')!;
    const curry = getCuratedNBAPlayers(warriors, era)!.find(item => item.name === 'Stephen Curry')!;
    const forged = {
      ...curry,
      name: 'Definitely Not Curry',
      playerScore: 100,
      isLegend: false,
      stats: { ...curry.stats, points: 60, assists: 20 },
    };
    const submittedSlot = slot({ id: 'pg', position: 'PG', label: 'Point Guard', player: forged });
    const canonical = canonicalizeSimulationRoster([submittedSlot]);

    expect(canonical.error).toBeNull();
    expect(canonical.slots?.[0].player).toEqual(curry);
    expect(canonical.slots?.[0].player?.playerScore).not.toBe(100);
    expect(canonical.slots?.[0].player?.stats.points).not.toBe(60);

    const unknown = canonicalizeSimulationRoster([
      { ...submittedSlot, player: { ...forged, id: 'forged-player-id' } },
    ]);
    expect(unknown.slots).toBeNull();
    expect(unknown.error).toMatch(/unknown or invalid player/i);
  });

  it('locks every gameplay mutation on the first simulation click and ignores stale results', () => {
    const manu = player({ id: 'manu', name: 'Manu Ginobili', position: 'SG', playerScore: 84 });
    const slots = completeRoster(manu);
    const teamPower = computeTeamGSPR(slots, 'nba', 'combined');
    const result = simulateSeason(teamPower, 'nba', { pros: [], cons: [] }, undefined, slots);
    const current = queueItem(1980);
    const candidate = queueItem(1985);
    const complete = gameState({
      phase: 'complete',
      team: testTeam,
      era: current.era,
      slots,
      eraQueue: [candidate],
      loadId: 7,
    });
    const started = gameReducer(complete, { type: 'START_SIMULATION', loadId: 8 });

    expect(started.gameplayLocked).toBe(true);
    expect(started.simulationPending).toBe(true);
    expect(started.loadId).toBe(8);
    expect(gameReducer(started, { type: 'START_SIMULATION', loadId: 9 })).toBe(started);
    expect(gameReducer(started, { type: 'REQUEST_GAMBLE', slotId: 'pg' })).toBe(started);
    expect(gameReducer(started, { type: 'SET_SIMULATION', result, loadId: 7 })).toBe(started);

    const finished = gameReducer(started, { type: 'SET_SIMULATION', result, loadId: 8 });
    expect(finished.gameplayLocked).toBe(true);
    expect(finished.simulationPending).toBe(false);
    expect(finished.simulationCount).toBe(1);

    const forcedReady = { ...finished, phase: 'ready' as const, rerolls: { teamUsed: false, eraUsed: false } };
    expect(gameReducer(forcedReady, { type: 'REROLL_TEAM' })).toBe(forcedReady);
    expect(gameReducer(forcedReady, { type: 'REROLL_ERA' })).toBe(forcedReady);
    expect(gameReducer(forcedReady, { type: 'START_ROSTER_SWAP', slotId: 'pg' })).toBe(forcedReady);
    expect(gameReducer(forcedReady, { type: 'DRAFT_PLAYER', player: slots[0].player! })).toBe(forcedReady);
  });

  it('keeps request IDs monotonic across new games so old async responses cannot collide', () => {
    const nextGame = gameReducer(gameState({ loadId: 11 }), { type: 'NEW_GAME' });

    expect(nextGame.loadId).toBe(12);
    expect(nextGame.gameplayLocked).toBe(false);
  });

  it('record explanations use the same sixth man effective score', async () => {
    const manu = player({ id: 'manu', name: 'Manu Ginobili', position: 'SG', playerScore: 70 });
    const sixthSlot = slot({ id: '6man', position: 'SG', label: 'SG 6th Man', player: manu });
    const teamPower = computeTeamGSPR([sixthSlot], 'nba', 'combined');
    const results = simulateSeason(teamPower, 'nba', { pros: [], cons: [] }, undefined, [sixthSlot]);
    const explanation = await explainSeasonRecord(
      { ...results, wins: 82, losses: 0, recordLabel: '82-0', games: [] },
      [sixthSlot],
      false
    );

    expect(explanation.recordFactors.join(' ')).not.toContain('matchup target at 70');
    expect(results.rosterStats[0].playerScore).toBe(effectivePlayerScore(sixthSlot, manu));
  });
});
