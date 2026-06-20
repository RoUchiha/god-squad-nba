'use client';

import { useState } from 'react';
import { RefreshCw, Shuffle, X } from 'lucide-react';
import type { FilledRosterSlot, Sport, Player } from '@/lib/types';
import { effectivePlayerScore } from '@/lib/effectivePlayerScore';
import { slotAcceptsPlayer } from '@/lib/playerIdentity';
import { playerRoleLabel } from '@/lib/playerRoles';

interface Props {
  slots: FilledRosterSlot[];
  sport: Sport;
  onPositionSwap: (slotId: string, position: Player['position'] | Player['position'][]) => void;
  onRosterSwapTarget: (slotId: string) => void;
  positionSwapUsed: boolean;
  activeSwapSlotId: string | null;
  invalidSwapSlotId: string | null;
  justPlacedSlotId: string | null;
  onGamble: (slotId: string) => void;
  gambleAvailable: boolean;
  gamblePending: boolean;
}

export default function TeamRoster({
  slots,
  onPositionSwap,
  onRosterSwapTarget,
  positionSwapUsed,
  activeSwapSlotId,
  invalidSwapSlotId,
  justPlacedSlotId,
  onGamble,
  gambleAvailable,
  gamblePending,
}: Props) {
  const [inspectedSlot, setInspectedSlot] = useState<FilledRosterSlot | null>(null);
  const activeSwapSlot = activeSwapSlotId ? slots.find(slot => slot.id === activeSwapSlotId) ?? null : null;

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-sm font-bold uppercase text-gray-400">Your Roster</h2>
      <div className="max-h-[60vh] space-y-1 overflow-y-auto pr-1 lg:max-h-[calc(100vh-280px)]">
        <div className="mb-1.5 px-1 text-[10px] uppercase text-gray-600">Lineup</div>
        {slots.map(slot => (
          <RosterSlot
            key={slot.id}
            slot={slot}
            onPositionSwap={onPositionSwap}
            onRosterSwapTarget={onRosterSwapTarget}
            positionSwapUsed={positionSwapUsed}
            activeSwapSlot={activeSwapSlot}
            isActiveSwap={slot.id === activeSwapSlotId}
            isInvalidSwapTarget={slot.id === invalidSwapSlotId}
            isJustPlaced={slot.id === justPlacedSlotId}
            onInspect={setInspectedSlot}
            onGamble={onGamble}
            canGamble={gambleAvailable}
            gamblePending={gamblePending}
          />
        ))}
      </div>
      {inspectedSlot?.player && (
        <PlayerDetailCard slot={inspectedSlot} player={inspectedSlot.player} onClose={() => setInspectedSlot(null)} />
      )}
    </div>
  );
}

function RosterSlot({
  slot,
  onPositionSwap,
  onRosterSwapTarget,
  positionSwapUsed,
  activeSwapSlot,
  isActiveSwap,
  isInvalidSwapTarget,
  isJustPlaced,
  onInspect,
  onGamble,
  canGamble,
  gamblePending,
}: {
  slot: FilledRosterSlot;
  isJustPlaced: boolean;
  isActiveSwap: boolean;
  isInvalidSwapTarget: boolean;
  activeSwapSlot: FilledRosterSlot | null;
  onPositionSwap: (id: string, pos: Player['position'] | Player['position'][]) => void;
  onRosterSwapTarget: (id: string) => void;
  positionSwapUsed: boolean;
  onInspect: (slot: FilledRosterSlot) => void;
  onGamble: (slotId: string) => void;
  canGamble: boolean;
  gamblePending: boolean;
}) {
  const posLabel = Array.isArray(slot.position) ? slot.position.join('/') : slot.position;
  if (!slot.player) {
    return (
      <div className="flex items-center gap-2 rounded border border-dashed border-white/15 bg-white/[0.02] px-3 py-2">
        <span className="w-8 flex-shrink-0 text-[10px] font-bold text-gray-600">{posLabel}</span>
        <span className="text-xs italic text-gray-700">Click player to fill</span>
      </div>
    );
  }

  const player = slot.player;
  const displayScore = effectivePlayerScore(slot, player);
  const canCommitSwap = Boolean(
    activeSwapSlot?.player &&
    activeSwapSlot.id !== slot.id &&
    slotAcceptsPlayer(slot, activeSwapSlot.player) &&
    slotAcceptsPlayer(activeSwapSlot, player)
  );
  const isSwapCandidate = Boolean(activeSwapSlot && activeSwapSlot.id !== slot.id);
  const slotToneClass = isActiveSwap
    ? 'border-yellow-600/70 bg-yellow-950/40 ring-1 ring-yellow-500/30'
    : isInvalidSwapTarget
      ? 'animate-invalid-shake border-red-500/70 bg-red-950/40 ring-1 ring-red-500/30'
      : canCommitSwap
        ? 'border-yellow-500/70 bg-yellow-950/20 hover:bg-yellow-950/35'
        : isJustPlaced
          ? 'border-green-700/60 bg-green-950/40'
          : 'border-white/10 bg-white/5 hover:border-orange-400/30 hover:bg-white/[0.08]';

  return (
    <div
      className={`group flex w-full items-center rounded border transition-all duration-300 ${slotToneClass}`}
    >
      <button
        type="button"
        onClick={() => isSwapCandidate ? onRosterSwapTarget(slot.id) : onInspect(slot)}
        className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
      >
        <span className="w-8 flex-shrink-0 text-[10px] font-bold text-gray-500">{posLabel}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">{player.name}</span>
          <span className="block text-[10px] text-gray-600">{player.yearsWithTeam} | {playerRoleLabel(player)}</span>
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(displayScore) }}>
          {Math.round(displayScore)}
        </span>
      </button>
      {canGamble && (
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onGamble(slot.id); }}
          disabled={gamblePending}
          title="Gamble this roster spot"
          className="mr-1 p-1 text-yellow-500 opacity-0 transition-opacity hover:text-yellow-300 focus:opacity-100 disabled:cursor-wait disabled:opacity-40 group-hover:opacity-100"
        >
          <Shuffle size={14} aria-hidden="true" />
        </button>
      )}
      {!positionSwapUsed && (
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onPositionSwap(slot.id, slot.position); }}
          title="Use position swap reroll"
          className="mr-2 p-1 text-yellow-600 opacity-0 transition-opacity hover:text-yellow-400 focus:opacity-100 group-hover:opacity-100"
        >
          <RefreshCw size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function PlayerDetailCard({ slot, player, onClose }: { slot: FilledRosterSlot; player: Player; onClose: () => void }) {
  const displayScore = effectivePlayerScore(slot, player);
  const countingStats = [
    ['PPG', player.stats.points],
    ['RPG', player.stats.rebounds],
    ['APG', player.stats.assists],
    ['SPG', player.stats.steals],
    ['BPG', player.stats.blocks],
  ] as const;
  const percentages = [
    ['FG%', player.stats.fieldGoalPct],
    ['3P%', player.stats.threePointPct],
    ['FT%', player.stats.freeThrowPct],
  ] as const;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${player.name} player details`}
        className="relative w-full max-w-md border border-orange-400/25 bg-[#11100e] p-5 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} title="Close player details" className="absolute right-3 top-3 p-2 text-gray-500 hover:text-white">
          <X size={18} aria-hidden="true" />
        </button>
        <div className="pr-10">
          <div className="text-[10px] font-bold uppercase text-orange-400">{playerRoleLabel(player)} | {player.yearsWithTeam}</div>
          <h3 className="mt-1 text-2xl font-black text-white">{player.name}</h3>
          <div className="mt-1 text-sm text-gray-400">Peak attributed stat line for this era</div>
        </div>
        <div className="mt-5 grid grid-cols-5 border-y border-white/10 py-4">
          {countingStats.map(([label, value]) => (
            <div key={label} className="text-center">
              <div className="text-lg font-black text-white">{(value ?? 0).toFixed(1)}</div>
              <div className="text-[9px] font-bold text-gray-600">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {percentages.map(([label, value]) => (
            <div key={label} className="border border-white/10 bg-white/[0.03] p-3 text-center">
              <div className="text-base font-bold text-white">{((value ?? 0) * 100).toFixed(1)}%</div>
              <div className="text-[9px] font-bold text-gray-600">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs text-gray-500">God Squad player rating</span>
          <span className="text-3xl font-black text-orange-400">{Math.round(displayScore)}</span>
        </div>
      </section>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 90) return '#fbbf24';
  if (score >= 80) return '#fb923c';
  if (score >= 70) return '#60a5fa';
  return '#9ca3af';
}
