'use client';

import { useMemo } from 'react';
import type { FilledRosterSlot, Sport, DraftMode } from '@/lib/types';
import { computeTeamGSPR } from '@/lib/algorithms/powerRating';
import { getGsprTier } from '@/lib/constants';
import { estimateUndefeatedChance } from '@/lib/algorithms/simulator';
import { analyzeTeamComposition } from '@/lib/teamComposition';

interface Props {
  gspr: number;
  slots: FilledRosterSlot[];
  sport: Sport;
  mode: DraftMode;
}

export default function PowerMeter({ gspr, slots, sport, mode }: Props) {
  const teamPower = useMemo(() => {
    if (slots.length === 0) return null;
    return computeTeamGSPR(slots, sport, mode);
  }, [slots, sport, mode]);
  const composition = useMemo(() => analyzeTeamComposition(slots), [slots]);

  const tier = getGsprTier(gspr);
  const fillPct = (gspr / 1000) * 100;
  const undefeatedChance = gspr > 0 ? estimateUndefeatedChance(gspr) : 0;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider">God Squad Power</span>
        <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.label}</span>
      </div>

      {/* GSPR number */}
      <div className="text-4xl font-black tabular-nums mb-3" style={{ color: tier.color }}>
        {gspr}
        <span className="text-base font-normal text-gray-600 ml-1">/1000</span>
      </div>

      {/* Bar */}
      <div className="h-3 bg-black/50 rounded-full overflow-hidden mb-3 border border-white/5">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${fillPct}%`,
            background: `linear-gradient(90deg, ${tier.color}88, ${tier.color})`,
            boxShadow: gspr > 500 ? `0 0 10px ${tier.color}66` : undefined,
          }}
        />
      </div>

      {/* Sub-scores */}
      {teamPower && (
        <div className="space-y-1 mb-3">
          {teamPower.offenseScore > 0 && (
            <SubBar label="Offense" value={teamPower.offenseScore} color="#22c55e" />
          )}
          {teamPower.defenseScore > 0 && (
            <SubBar label="Defense" value={teamPower.defenseScore} color="#3b82f6" />
          )}
          {teamPower.breakdown.length > 1 && (
            <div className="mt-2 space-y-0.5">
              {teamPower.breakdown.slice(1).map((label, i) => (
                <div key={i} className="text-[11px] text-yellow-400 font-medium leading-snug">
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Undefeated probability */}
      <div className="border-t border-white/5 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Undefeated chance</span>
          <span
            className={`text-sm font-bold tabular-nums ${undefeatedChance > 5 ? 'text-yellow-400' : 'text-gray-500'}`}
          >
            {undefeatedChance < 0.01 ? '<0.01%' : `${undefeatedChance.toFixed(1)}%`}
          </span>
        </div>
      </div>

      {/* Composition read */}
      <div className="border-t border-white/5 pt-3 mt-3 space-y-3">
        <CompositionList title="Pros" items={composition.pros} color="text-green-300" marker="+" />
        <CompositionList title="Cons" items={composition.cons} color="text-red-300" marker="-" />
      </div>
    </div>
  );
}

function SubBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-600 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-mono text-gray-500 w-6 text-right">{Math.round(value)}</span>
    </div>
  );
}

function CompositionList({
  title,
  items,
  color,
  marker,
}: {
  title: string;
  items: string[];
  color: string;
  marker: string;
}) {
  return (
    <div>
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color}`}>{title}</div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2 text-[11px] leading-snug text-gray-400">
            <span className={`font-bold ${color}`}>{marker}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
