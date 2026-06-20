import type { FilledRosterSlot, Player } from './types';
import { normalizePlayerName } from './playerIdentity';

const SIXTH_MAN_SPECIALISTS = new Set([
  'jamal crawford',
  'lou williams',
  'manu ginobili',
  'kevin mchale',
  'detlef schrempf',
  'ricky pierce',
  'jason terry',
  'toni kukoc',
  'bobby jones',
  'lamar odom',
  'michael cooper',
  'bill walton',
  'vinnie johnson',
  'john havlicek',
]);

export function isSixthManSpecialist(player: Player): boolean {
  return SIXTH_MAN_SPECIALISTS.has(normalizePlayerName(player.name));
}

export function effectivePlayerScore(
  slot: Pick<FilledRosterSlot, 'id'> | string,
  player: Player
): number {
  const slotId = typeof slot === 'string' ? slot : slot.id;
  if (slotId === '6man' && isSixthManSpecialist(player)) {
    return Math.max(player.playerScore, 90);
  }
  return player.playerScore;
}

export function playerWithEffectiveScore(slot: FilledRosterSlot, player: Player): Player {
  const score = effectivePlayerScore(slot, player);
  return score === player.playerScore ? player : { ...player, playerScore: score };
}

export function playersWithEffectiveScores(slots: FilledRosterSlot[]): Player[] {
  return slots.flatMap(slot => slot.player ? [playerWithEffectiveScore(slot, slot.player)] : []);
}
