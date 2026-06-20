import { describe, expect, it } from 'vitest';
import type { FilledRosterSlot, Player } from '../lib/types';
import {
  hasFilledPrimarySlot,
  isFlexSlot,
  isSamePlayer,
  normalizePlayerName,
  rosterHasPlayer,
  slotAcceptsPlayer,
} from '../lib/playerIdentity';

function player(overrides: Partial<Player>): Player {
  return {
    id: 'p-1',
    name: 'Player One',
    position: 'PG',
    positionGroup: 'offense',
    yearsWithTeam: '2000-2004',
    stats: {},
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

describe('player identity', () => {
  it('normalizes punctuation, accents, and spacing for duplicate checks', () => {
    expect(normalizePlayerName(" Shaquille   O'Neal ")).toBe('shaquille oneal');
    expect(normalizePlayerName('Nikola Jokic')).toBe('nikola jokic');
    expect(normalizePlayerName('Gary Payton II')).toBe('gary payton');
  });

  it('treats the same real player from different eras as a duplicate', () => {
    const lebronHeat = player({ id: 'nba-hist-16-nba-16-2010-0', name: 'LeBron James', position: 'SF' });
    const lebronCavs = player({ id: 'nba-hist-6-nba-6-2015-0', name: 'LeBron James', position: 'SF' });

    expect(isSamePlayer(lebronHeat, lebronCavs)).toBe(true);
    expect(rosterHasPlayer([slot({ player: lebronHeat })], lebronCavs)).toBe(true);
  });

  it('does not treat old generated-id collisions as duplicates when names differ', () => {
    const magic = player({ id: 'nba-hist-14-0', name: 'Magic Johnson' });
    const shaq = player({ id: 'nba-hist-14-0', name: "Shaquille O'Neal", position: 'C' });

    expect(isSamePlayer(magic, shaq)).toBe(false);
  });

  it('checks slot compatibility for fixed and flex roster slots', () => {
    expect(slotAcceptsPlayer(slot({ position: 'PG' }), player({ position: 'PG' }))).toBe(true);
    expect(slotAcceptsPlayer(slot({ position: 'C' }), player({ position: 'PG' }))).toBe(false);
    expect(slotAcceptsPlayer(slot({ position: ['PG', 'SG'] }), player({ position: 'SG' }))).toBe(true);
  });

  it('allows credible secondary roles to fill open lineup spots', () => {
    const curry = player({
      name: 'Stephen Curry',
      position: 'PG',
      stats: { points: 32, assists: 5.8, threePointPct: 0.421 },
    });
    const jordanPoole = player({
      name: 'Jordan Poole',
      position: 'SG',
      stats: { points: 18.5, assists: 4, threePointPct: 0.37 },
    });

    expect(slotAcceptsPlayer(slot({ position: 'SG' }), curry)).toBe(true);
    expect(slotAcceptsPlayer(slot({ position: 'PG' }), jordanPoole)).toBe(true);
  });

  it('detects when a primary position is already filled before using flex', () => {
    const pointGuard = player({ position: 'PG' });
    const primary = slot({ id: 'pg', position: 'PG', player: player({ position: 'PG' }) });
    const flex = slot({ id: '6man', position: ['PG', 'SG', 'SF', 'PF', 'C'], player: null });

    expect(isFlexSlot(primary)).toBe(false);
    expect(isFlexSlot(flex)).toBe(true);
    expect(hasFilledPrimarySlot([primary, flex], pointGuard)).toBe(true);
  });
});
