'use client';

/**
 * PlayerPool — single-click draft.
 *
 * No internal state or guards. The reducer is the only gate:
 *   phase !== 'ready' → DRAFT_PLAYER is a no-op in the reducer.
 *   key={era.id} on this component forces a full remount between picks.
 */

import type { Player } from '@/lib/types';
import PlayerCard from './PlayerCard';

interface Props {
  players: Player[];
  onDraft: (player: Player) => void;
  onSkip: () => void;
}

export default function PlayerPool({ players, onDraft, onSkip }: Props) {
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
        <div className="space-y-1.5 overflow-y-auto max-h-[52vh] lg:max-h-[calc(100vh-320px)] pr-1 flex-1">
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              sport="nba"
              isSelected={false}
              isHighlighted={false}
              onSelect={onDraft}
            />
          ))}
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={onSkip}
          className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 border border-white/5 hover:border-white/10 transition-colors"
        >
          Skip this era →
        </button>
      </div>
    </div>
  );
}
