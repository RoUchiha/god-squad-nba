import type { FilledRosterSlot, Position } from './types';
import { generateTeamEras } from './constants';
import { normalizePlayerName, slotAcceptsPlayer } from './playerIdentity';
import { getCuratedNBAPlayers, NBA_TEAMS } from './sports/nba';

const REQUIRED_SLOTS: Record<string, { position: Position | null; label: string | null }> = {
  pg: { position: 'PG', label: 'Point Guard' },
  sg: { position: 'SG', label: 'Shooting Guard' },
  sf: { position: 'SF', label: 'Small Forward' },
  pf: { position: 'PF', label: 'Power Forward' },
  c: { position: 'C', label: 'Center' },
  '6man': { position: null, label: null },
};

export function validateSimulationRoster(slots: FilledRosterSlot[]): string | null {
  const requiredSlotIds = Object.keys(REQUIRED_SLOTS);
  if (slots.length !== requiredSlotIds.length) return 'A complete six-player roster is required.';

  const slotIds = new Set(slots.map(slot => slot.id));
  if (slotIds.size !== slots.length || requiredSlotIds.some(slotId => !slotIds.has(slotId))) {
    return 'Roster slots do not match the NBA lineup template.';
  }

  const playerNames = new Set<string>();
  for (const slot of slots) {
    const expected = REQUIRED_SLOTS[slot.id];
    if (!slot.required || Array.isArray(slot.position)) {
      return 'Roster slots do not match the NBA lineup template.';
    }
    if (expected.position && slot.position !== expected.position) {
      return 'Roster slots do not match the NBA lineup template.';
    }
    const expectedLabel = expected.label ?? `${slot.position} 6th Man`;
    if (slot.label !== expectedLabel) {
      return 'Roster slots do not match the NBA lineup template.';
    }
    if (!slot.player) return 'A complete six-player roster is required.';
    if (!slotAcceptsPlayer(slot, slot.player)) {
      return `${slot.player.name} is not eligible for ${slot.label}.`;
    }

    const playerName = normalizePlayerName(slot.player.name);
    if (playerNames.has(playerName)) return 'Duplicate players are not allowed.';
    playerNames.add(playerName);
  }

  return null;
}

export function canonicalizeSimulationRoster(
  slots: FilledRosterSlot[]
): { slots: FilledRosterSlot[]; error: null } | { slots: null; error: string } {
  const canonicalSlots: FilledRosterSlot[] = [];

  for (const slot of slots) {
    const submitted = slot.player;
    if (!submitted?.teamId || !submitted.eraId) {
      return { slots: null, error: 'Every player must come from a validated drafted team-era.' };
    }

    const team = NBA_TEAMS.find(item => item.id === submitted.teamId);
    const era = team
      ? generateTeamEras(team).find(item => item.id === submitted.eraId)
      : undefined;
    const canonicalPlayer = team && era
      ? getCuratedNBAPlayers(team, era)?.find(player => player.id === submitted.id)
      : undefined;

    if (!canonicalPlayer) {
      return { slots: null, error: 'Roster contains an unknown or invalid player.' };
    }

    canonicalSlots.push({ ...slot, player: canonicalPlayer });
  }

  return { slots: canonicalSlots, error: null };
}
