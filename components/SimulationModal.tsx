'use client';

import { useEffect, useRef } from 'react';
import type { SeasonResults } from '@/lib/types';
import { SPORT_CONFIG } from '@/lib/constants';

interface Props {
  results: SeasonResults;
  onClose: () => void;
  onNewGame: () => void;
  onResimulate: () => void;
  canResimulate: boolean;
  isResimulating: boolean;
}

export default function SimulationModal({
  results,
  onClose,
  onNewGame,
  onResimulate,
  canResimulate,
  isResimulating,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cfg = SPORT_CONFIG;
  const customStanding = results.leagueStandings.find(team => team.isCustomTeam);
  const visibleStandings = results.leagueStandings.slice(0, 8);
  if (customStanding && !visibleStandings.some(team => team.isCustomTeam)) {
    visibleStandings[visibleStandings.length - 1] = customStanding;
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={`
          relative w-full max-w-3xl max-h-[92vh] rounded-lg overflow-y-auto
          bg-[#111] border
          ${results.isUndefeated ? 'border-red-500 celebrate' : 'border-white/10'}
          animate-bounce-in
        `}
      >
        {/* Sport accent top bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${cfg.primaryColor}, ${cfg.accentColor})` }}
        />

        {/* Content */}
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 text-lg"
          >
            ✕
          </button>

          {/* Achievement headline */}
          <div className="text-center mb-6">
            <div
              className={`text-2xl font-black mb-1 ${results.isUndefeated ? 'text-red-400' : 'text-white'}`}
            >
              {results.achievement}
            </div>
            <div className="text-gray-400 text-sm">{results.achievementSubtext}</div>
          </div>

          {/* Record */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-black text-white tabular-nums">{results.recordLabel}</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">Season Record</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black tabular-nums" style={{
                color: results.teamPower.gspr >= 950 ? '#ff4444'
                  : results.teamPower.gspr >= 850 ? '#ffd700'
                  : results.teamPower.gspr >= 700 ? '#a855f7'
                  : '#6b7280'
              }}>
                {results.teamPower.gspr}
              </div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">GSPR</div>
            </div>
          </div>

          {/* Season bar */}
          <SeasonBar games={results.games} />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <StatBox label="Win %" value={`${(results.wins / results.totalGames * 100).toFixed(1)}%`} />
            <StatBox label="Streak" value={`W${results.longestWinStreak}`} />
            <StatBox label="Games" value={String(results.totalGames)} />
          </div>

          {results.rosterStats.length > 0 && (
            <div className="mt-4 border border-orange-400/15 bg-black/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-bold uppercase text-gray-500">God Squad Season Stats</div>
                <div className="text-[10px] text-gray-700">Simulated per game</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[470px] text-xs">
                  <thead className="text-[9px] uppercase text-gray-700">
                    <tr>
                      <th className="pb-2 text-left font-bold">Player</th>
                      <th className="pb-2 text-right font-bold">GP</th>
                      <th className="pb-2 text-right font-bold">PTS</th>
                      <th className="pb-2 text-right font-bold">REB</th>
                      <th className="pb-2 text-right font-bold">AST</th>
                      <th className="pb-2 text-right font-bold">STL</th>
                      <th className="pb-2 text-right font-bold">BLK</th>
                      <th className="pb-2 text-right font-bold">FG%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.rosterStats.map(line => (
                      <tr key={line.playerId} className="border-t border-white/5">
                        <td className="py-2 pr-3">
                          <div className="font-semibold text-white">{line.name}</div>
                          <div className="text-[9px] text-gray-700">{line.slotLabel} | {line.minutes.toFixed(1)} MPG</div>
                        </td>
                        <td className="py-2 text-right text-gray-500">{line.gamesPlayed}</td>
                        <td className="py-2 text-right font-bold text-orange-300">{line.points.toFixed(1)}</td>
                        <td className="py-2 text-right text-gray-300">{line.rebounds.toFixed(1)}</td>
                        <td className="py-2 text-right text-gray-300">{line.assists.toFixed(1)}</td>
                        <td className="py-2 text-right text-gray-400">{line.steals.toFixed(1)}</td>
                        <td className="py-2 text-right text-gray-400">{line.blocks.toFixed(1)}</td>
                        <td className="py-2 text-right text-gray-400">{(line.fieldGoalPct * 100).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {results.leagueStandings.length > 0 && (
            <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-xs text-gray-600 uppercase tracking-wider">League Power Rankings</div>
                <div className="text-[10px] text-gray-700">2024-25 baseline</div>
              </div>
              <div className="space-y-1">
                {visibleStandings.map(team => (
                  <div
                    key={team.teamId}
                    className={`grid grid-cols-[20px_1fr_auto_auto] items-center gap-2 px-1 py-1 text-xs ${team.isCustomTeam ? 'border border-orange-400/30 bg-orange-400/10' : ''}`}
                  >
                    <span className="text-gray-700 tabular-nums">{team.rank}</span>
                    <span className={`truncate ${team.isCustomTeam ? 'font-bold text-orange-200' : 'text-gray-300'}`}>{team.city} {team.name}</span>
                    <span className="text-gray-500 tabular-nums">{team.wins}-{team.losses}</span>
                    <span className="text-yellow-500/80 tabular-nums">{team.gspr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.recordJustification && (
            <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-xs text-gray-600 uppercase tracking-wider">Why This Record</div>
                <div className="text-[10px] text-gray-700 uppercase tracking-wider">
                  {results.explanationSource === 'llm' ? 'LLM analysis' : 'Local analysis'}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-gray-300">{results.recordJustification}</p>
              {results.recordFactors && results.recordFactors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {results.recordFactors.map((factor, index) => (
                    <div key={`record-factor-${index}`} className="flex gap-2 text-xs leading-snug text-gray-500">
                      <span className="text-yellow-500 font-bold">{index + 1}</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Composition report */}
          <div className="mt-4 p-3 bg-black/30 rounded-lg">
            <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Team Composition</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <CompositionBlock title="Pros" items={results.compositionAnalysis.pros} tone="pro" />
              <CompositionBlock title="Cons" items={results.compositionAnalysis.cons} tone="con" />
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={onNewGame}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              New Game
            </button>
            {canResimulate && (
              <button
                onClick={onResimulate}
                disabled={isResimulating}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResimulating ? 'Simulating...' : 'Re-simulate'}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${cfg.primaryColor}, ${cfg.accentColor})` }}
            >
              Back to Roster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompositionBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'pro' | 'con';
}) {
  const color = tone === 'pro' ? 'text-green-300' : 'text-red-300';
  const marker = tone === 'pro' ? '+' : '-';

  return (
    <div>
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{title}</div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2 text-xs leading-snug text-gray-400">
            <span className={`font-bold ${color}`}>{marker}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeasonBar({ games }: { games: SeasonResults['games'] }) {
  return (
    <div>
      <div className="text-xs text-gray-600 mb-1.5">Season results</div>
      <div className="flex gap-[2px] flex-wrap">
        {games.map(g => (
          <div
            key={g.gameNumber}
            title={`Game ${g.gameNumber}: ${g.win ? 'W' : 'L'} ${g.teamScore}-${g.opponentScore} ${g.isHome ? 'vs' : '@'} ${g.opponentName} (${g.opponentAbbreviation}, ${g.opponentGspr} GSPR)`}
            aria-label={`Game ${g.gameNumber}: ${g.win ? 'win' : 'loss'}, ${g.teamScore} to ${g.opponentScore}, ${g.isHome ? 'home against' : 'at'} ${g.opponentName}`}
            className="group relative rounded-[2px] transition-all"
            style={{
              width: games.length > 100 ? '4px' : '6px',
              height: games.length > 100 ? '10px' : '14px',
              backgroundColor: g.win ? '#22c55e' : '#ef4444',
              opacity: 0.85,
            }}
          >
            <span className="pointer-events-none absolute z-20 hidden group-hover:block bottom-[18px] left-1/2 -translate-x-1/2 w-max max-w-56 rounded bg-black px-2 py-1 text-[10px] leading-tight text-gray-200 border border-white/10 shadow-xl">
              G{g.gameNumber}: {g.win ? 'W' : 'L'} {g.teamScore}-{g.opponentScore} {g.isHome ? 'vs' : '@'} {g.opponentAbbreviation}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 bg-black/30 rounded-lg">
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</div>
    </div>
  );
}
