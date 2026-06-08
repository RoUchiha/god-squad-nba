'use client';

import type { Player } from '@/lib/types';

interface Props {
  player: Player;
  sport: 'nba';
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (player: Player) => void;
}

const STAT_LABELS: Record<string, string> = {
  points: 'PPG', rebounds: 'RPG', assists: 'APG',
  steals: 'SPG', blocks: 'BPG', turnovers: 'TO',
  fieldGoalPct: 'FG%', threePointPct: '3P%', freeThrowPct: 'FT%',
};

function formatStat(key: string, value: number | undefined): string {
  if (value === undefined) return '—';
  if (['fieldGoalPct', 'threePointPct', 'freeThrowPct'].includes(key)) {
    return value.toFixed(3).replace('0.', '.');
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function scoreColor(score: number): string {
  if (score >= 85) return '#ffd700';
  if (score >= 70) return '#a855f7';
  if (score >= 55) return '#3b82f6';
  return '#6b7280';
}

export default function PlayerCard({ player, isSelected, isHighlighted, onSelect }: Props) {
  const s = player.stats;
  const keyStats: [string, number | undefined][] = [
    ['points', s.points], ['rebounds', s.rebounds], ['assists', s.assists],
    ['steals', s.steals], ['blocks', s.blocks], ['fieldGoalPct', s.fieldGoalPct],
    ['threePointPct', s.threePointPct], ['freeThrowPct', s.freeThrowPct],
  ];

  return (
    <button
      onClick={() => !isSelected && onSelect(player)}
      disabled={isSelected}
      className={`
        w-full text-left p-3 rounded-lg border transition-all duration-150
        ${isSelected
          ? 'opacity-30 cursor-not-allowed border-white/5 bg-white/2'
          : isHighlighted
            ? 'border-yellow-500/60 bg-yellow-950/30 hover:bg-yellow-950/50 cursor-pointer'
            : 'glass glass-hover border-white/5 hover:border-white/20 cursor-pointer active:scale-[0.98]'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
              {player.position}
            </span>
            {player.isLegend && <span className="text-[10px] font-bold text-yellow-500">★ HOF</span>}
            {player.isAllStar && !player.isLegend && <span className="text-[10px] font-bold text-blue-400">⭐</span>}
          </div>
          <div className="font-semibold text-sm text-white mt-1 truncate">{player.name}</div>
          <div className="text-[10px] text-gray-600 mt-0.5">
            {player.yearsWithTeam}
            {player.bestSeasonYear && <span className="ml-1.5 text-blue-500/70">{player.bestSeasonYear}</span>}
          </div>
        </div>
        <div className="text-lg font-black flex-shrink-0 tabular-nums" style={{ color: scoreColor(player.playerScore) }}>
          {Math.round(player.playerScore)}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
        {keyStats.filter(([, v]) => v !== undefined).map(([key, val]) => (
          <div key={key} className="flex items-baseline gap-1">
            <span className="text-[10px] text-gray-600">{STAT_LABELS[key] ?? key}</span>
            <span className="text-xs font-semibold text-gray-300">{formatStat(key, val)}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
