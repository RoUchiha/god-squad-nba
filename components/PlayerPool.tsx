'use client';

/**
 * PlayerPool — single-click draft.
 *
 * Belt-and-suspenders multi-pick prevention (layered):
 *   1. Reducer guard: phase !== 'ready' → DRAFT_PLAYER is a no-op.
 *   2. key={era.id} on this component forces a full remount between picks.
 *   3. Local state lock: once any player is selected, the pool becomes
 *      pointer-events-none AND the clicked card shows as selected.
 *      This fires before the phase transition hits React, stopping any
 *      rapid-tap from dispatching a second DRAFT_PLAYER.
 */

import { useState, useRef } from 'react';
import type { Player } from '@/lib/types';
import PlayerCard from './PlayerCard';

interface Props {
  players: Player[];
  onDraft: (player: Player) => void;
  onSkip: () => void;
}

export default function PlayerPool({ players, onDraft, onSkip }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // useRef gives a synchronous guard — useState batching can't race through it
  const draftedRef = useRef(false);

  function handleDraft(player: Player) {
    if (draftedRef.current) return; // already picked from this pool
    draftedRef.current = true;
    setSelectedId(player.id);
    onDraft(player);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Player Pool</h2>
        {players.length > 0 && (
          <span className="text-xs text-gray-600">{players.length} players · click to draft</span>
        )}
      </div>

      {players.length === 0 ? (
        <div className="space-y-2 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        /* pointer-events-none after first pick prevents any second tap before
           the component unmounts (key change triggers remount on next era).    */
        <div
          className={`space-y-1.5 overflow-y-auto max-h-[52vh] lg:max-h-[calc(100vh-320px)] pr-1 flex-1 transition-opacity duration-200 ${selectedId ? 'pointer-events-none opacity-60' : ''}`}
        >
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              sport="nba"
              isSelected={selectedId === player.id}
              isHighlighted={false}
              onSelect={handleDraft}
            />
          ))}
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={onSkip}
          disabled={selectedId !== null}
          className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 border border-white/5 hover:border-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Skip this era →
        </button>
      </div>
    </div>
  );
}
