import type { FilledRosterSlot } from './types';
import { slotAcceptsPlayer } from './playerIdentity';

export function canSwapRosterSlots(
  slots: FilledRosterSlot[],
  sourceSlotId: string,
  targetSlotId: string
): boolean {
  if (sourceSlotId === targetSlotId) return false;
  const source = slots.find(slot => slot.id === sourceSlotId);
  const target = slots.find(slot => slot.id === targetSlotId);
  if (!source?.player || !target?.player) return false;
  return slotAcceptsPlayer(target, source.player) && slotAcceptsPlayer(source, target.player);
}

export function swapRosterSlots(
  slots: FilledRosterSlot[],
  sourceSlotId: string,
  targetSlotId: string
): FilledRosterSlot[] | null {
  if (!canSwapRosterSlots(slots, sourceSlotId, targetSlotId)) return null;
  const source = slots.find(slot => slot.id === sourceSlotId)!;
  const target = slots.find(slot => slot.id === targetSlotId)!;

  return slots.map(slot => {
    if (slot.id === sourceSlotId) return { ...slot, player: target.player };
    if (slot.id === targetSlotId) return { ...slot, player: source.player };
    return slot;
  });
}
