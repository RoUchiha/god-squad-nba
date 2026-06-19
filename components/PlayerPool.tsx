'use client';

/**
 * PlayerPool - click to review, then confirm.
 *
 * The reducer still guards against rapid multi-picks, but a card click no longer
 * dispatches DRAFT_PLAYER. Users get one explicit confirmation step before the
 * pick can lock into the roster.
 */

import { useEffect, useRef, useState } from 'react';
import type { Player } from '@/lib/types';
import { playerRoleLabel } from '@/lib/playerRoles';
import PlayerCard from './PlayerCard';

interface InvalidSelection {
  playerId: string;
  message: string;
  nonce: number;
}

interface Props {
  players: Player[];
  invalidSelection: InvalidSelection | null;
  onDraft: (player: Player) => void;
  onSkip: () => void;
}

export default function PlayerPool({ players, invalidSelection, onDraft, onSkip }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);
  const draftedRef = useRef(false);

  useEffect(() => {
    if (!invalidSelection) return;

    draftedRef.current = false;
    setSelectedId(null);
    setPendingPlayer(null);
    setShakingId(invalidSelection.playerId);
    setInvalidMessage(invalidSelection.message);

    const timer = window.setTimeout(() => {
      setShakingId(null);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [invalidSelection]);

  function handleDraft(player: Player) {
    if (draftedRef.current) return;
    setPendingPlayer(player);
  }

  function confirmDraft() {
    if (!pendingPlayer || draftedRef.current) return;
    draftedRef.current = true;
    setSelectedId(pendingPlayer.id);
    onDraft(pendingPlayer);
    setPendingPlayer(null);
  }

  function cancelDraft() {
    if (draftedRef.current) return;
    setPendingPlayer(null);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Player Pool</h2>
        {players.length > 0 && (
          <span className="text-xs text-gray-600">{players.length} players · click to review</span>
        )}
      </div>

      {invalidMessage && (
        <div className="mb-2 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-300 animate-invalid-shake">
          {invalidMessage}
        </div>
      )}

      {players.length === 0 ? (
        <div className="space-y-2 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className={`space-y-1.5 overflow-y-auto max-h-[52vh] lg:max-h-[calc(100vh-320px)] pr-1 flex-1 transition-opacity duration-200 ${selectedId ? 'pointer-events-none opacity-60' : ''}`}
        >
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              sport="nba"
              isSelected={selectedId === player.id || pendingPlayer?.id === player.id}
              isHighlighted={false}
              isInvalid={shakingId === player.id}
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

      {pendingPlayer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-white/5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Confirm Selection</div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-black text-xl text-white truncate">{pendingPlayer.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {pendingPlayer.yearsWithTeam} · {playerRoleLabel(pendingPlayer)}
                  </div>
                </div>
                <div className="text-2xl font-black text-yellow-300 tabular-nums">
                  {Math.round(pendingPlayer.playerScore)}
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-4 gap-2 text-center">
              <ConfirmStat label="PPG" value={pendingPlayer.stats.points} />
              <ConfirmStat label="RPG" value={pendingPlayer.stats.rebounds} />
              <ConfirmStat label="APG" value={pendingPlayer.stats.assists} />
              <ConfirmStat label="3P%" value={pendingPlayer.stats.threePointPct} isPct />
            </div>

            <div className="px-4 pb-4 flex gap-3">
              <button
                onClick={cancelDraft}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDraft}
                className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #F26522, #FDB927)' }}
              >
                Confirm Pick
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmStat({ label, value, isPct = false }: { label: string; value?: number; isPct?: boolean }) {
  const display = value === undefined
    ? '-'
    : isPct
      ? value.toFixed(3).replace('0.', '.')
      : Number.isInteger(value)
        ? String(value)
        : value.toFixed(1);

  return (
    <div className="rounded-lg bg-black/30 border border-white/5 p-2">
      <div className="text-sm font-bold text-white">{display}</div>
      <div className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</div>
    </div>
  );
}
