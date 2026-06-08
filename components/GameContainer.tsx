'use client';

/**
 * GameContainer — NBA God Squad
 *
 * WHY useReducer FIXES THE MULTI-PICK BUG:
 *
 *   With useState + useCallback, closures capture stale snapshots. Two rapid
 *   DRAFT button clicks both see the same stale state and both execute the draft.
 *
 *   With useReducer, React applies dispatches SEQUENTIALLY through the reducer:
 *     dispatch(DRAFT_PLAYER) → reducer sees phase='ready'   → returns phase='loading'
 *     dispatch(DRAFT_PLAYER) → reducer sees phase='loading' → returns state unchanged ✓
 *
 *   The second call is an unconditional no-op at the reducer level. No refs, no
 *   timing tricks, no guards needed.
 *
 * ASYNC PATTERN:
 *   Reducer is pure (no async). Fetching is triggered by a useEffect that watches
 *   state.pendingLoad. Stale fetches are discarded via loadId.
 */

import { useReducer, useEffect } from 'react';
import type {
  Era, HistoricalTeam, Player, FilledRosterSlot,
  PlayersResponse, SeasonResults, RerollState,
} from '@/lib/types';
import { NBA_ROSTER, SPORT_CONFIG, getGsprTier } from '@/lib/constants';
import { computeTeamGSPR } from '@/lib/algorithms/powerRating';
import { buildEraQueue, rerollTeam, rerollEra, type EraQueueItem } from '@/lib/eraQueue';
import EraCard from './EraCard';
import PlayerPool from './PlayerPool';
import TeamRoster from './TeamRoster';
import PowerMeter from './PowerMeter';
import PlayerPlacementPicker from './PlayerPlacementPicker';
import SimulationModal from './SimulationModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingLoad {
  teamId: string;
  eraId: string;
  era: Era;
  team: HistoricalTeam;
  loadId: number;
}

interface GameState {
  phase: 'loading' | 'ready' | 'placing' | 'complete';
  eraQueue: EraQueueItem[];
  era: Era | null;
  team: HistoricalTeam | null;
  players: Player[];
  slots: FilledRosterSlot[];
  playerToPlace: Player | null;
  justPlacedSlotId: string | null;
  rerolls: RerollState;
  swapSlotId: string | null;
  pendingLoad: PendingLoad | null;
  loadId: number;
  error: string | null;
  simulationResult: SeasonResults | null;
  showResults: boolean;
}

type GameAction =
  | { type: 'NEW_GAME' }
  | { type: 'DRAFT_PLAYER'; player: Player }
  | { type: 'PLACE_PLAYER'; player: Player; slotId: string }
  | { type: 'SKIP_PICK' }
  | { type: 'CANCEL_PLACEMENT' }
  | { type: 'PLAYERS_LOADED'; players: Player[]; loadId: number }
  | { type: 'LOAD_ERROR'; loadId: number }
  | { type: 'REROLL_TEAM' }
  | { type: 'REROLL_ERA' }
  | { type: 'REMOVE_PLAYER'; slotId: string }
  | { type: 'ACTIVATE_SWAP'; slotId: string }
  | { type: 'CANCEL_SWAP' }
  | { type: 'SET_SIMULATION'; result: SeasonResults }
  | { type: 'CLOSE_RESULTS' }
  | { type: 'CLEAR_ERROR' };

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function freshSlots(): FilledRosterSlot[] {
  return NBA_ROSTER.map(t => ({ ...t, player: null }));
}

function compatibleSlots(slots: FilledRosterSlot[], player: Player): FilledRosterSlot[] {
  return slots.filter(s => {
    if (s.player) return false;
    return Array.isArray(s.position)
      ? s.position.includes(player.position)
      : s.position === player.position;
  });
}

function placeInSlot(slots: FilledRosterSlot[], slotId: string, player: Player): FilledRosterSlot[] {
  return slots.map(s => s.id === slotId ? { ...s, player } : s);
}

function isComplete(slots: FilledRosterSlot[]): boolean {
  return slots.filter(s => s.required).every(s => s.player !== null);
}

/** Pop next from queue (rebuilds if empty) and return a loading state. */
function toNextPick(state: GameState, queue?: EraQueueItem[]): GameState {
  const q = queue ?? state.eraQueue;
  const src = q.length > 0 ? q : buildEraQueue();
  const [next, ...rest] = src;
  const loadId = state.loadId + 1;
  return {
    ...state,
    phase: 'loading',
    eraQueue: rest,
    era: next.era,
    team: next.team,
    players: [],
    playerToPlace: null,
    swapSlotId: null,
    pendingLoad: { teamId: next.team.id, eraId: next.era.id, era: next.era, team: next.team, loadId },
    loadId,
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'NEW_GAME': {
      const q = buildEraQueue();
      return toNextPick({
        ...state,
        slots: freshSlots(),
        rerolls: { teamUsed: false, eraUsed: false },
        swapSlotId: null,
        simulationResult: null,
        showResults: false,
        error: null,
        loadId: 0,
        eraQueue: q,
        era: null,
        team: null,
        players: [],
        playerToPlace: null,
        justPlacedSlotId: null,
        pendingLoad: null,
      }, q);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DRAFT_PLAYER — the fix lives here.
    //
    // React processes useReducer dispatches sequentially:
    //   call 1 → reducer(state{phase:'ready'},  DRAFT) → returns state{phase:'loading'}
    //   call 2 → reducer(state{phase:'loading'}, DRAFT) → hits the guard, returns unchanged
    //
    // No refs, no closures, no races. The reducer always receives current state.
    // ─────────────────────────────────────────────────────────────────────────
    case 'DRAFT_PLAYER': {
      if (state.phase !== 'ready') return state; // ← THE GUARD

      const { player } = action;

      // Belt-and-suspenders: player already placed → just advance
      if (state.slots.some(s => s.player?.id === player.id)) {
        return toNextPick(state);
      }

      // Swap mode: fill the designated slot directly
      if (state.swapSlotId) {
        const newSlots = placeInSlot(state.slots, state.swapSlotId, player);
        if (isComplete(newSlots)) {
          return { ...state, phase: 'complete', slots: newSlots, swapSlotId: null, players: [], justPlacedSlotId: state.swapSlotId };
        }
        return toNextPick({ ...state, slots: newSlots, swapSlotId: null, justPlacedSlotId: state.swapSlotId });
      }

      const compat = compatibleSlots(state.slots, player);

      if (compat.length === 0) return toNextPick(state);

      if (compat.length === 1) {
        const newSlots = placeInSlot(state.slots, compat[0].id, player);
        if (isComplete(newSlots)) {
          return { ...state, phase: 'complete', slots: newSlots, players: [], justPlacedSlotId: compat[0].id };
        }
        return toNextPick({ ...state, slots: newSlots, justPlacedSlotId: compat[0].id });
      }

      // Multiple compatible slots → placement picker
      // phase → 'placing' means PlayerPool will NOT be in the DOM,
      // so no further DRAFT_PLAYER dispatches are possible from the UI.
      return { ...state, phase: 'placing', playerToPlace: player, justPlacedSlotId: null };
    }

    case 'PLACE_PLAYER': {
      if (state.phase !== 'placing') return state;
      const newSlots = placeInSlot(state.slots, action.slotId, action.player);
      if (isComplete(newSlots)) {
        return { ...state, phase: 'complete', slots: newSlots, playerToPlace: null, players: [], justPlacedSlotId: action.slotId };
      }
      return toNextPick({ ...state, slots: newSlots, playerToPlace: null, justPlacedSlotId: action.slotId });
    }

    case 'SKIP_PICK': {
      if (state.phase !== 'ready') return state;
      return toNextPick(state);
    }

    case 'CANCEL_PLACEMENT': {
      if (state.phase !== 'placing') return state;
      return toNextPick({ ...state, playerToPlace: null });
    }

    case 'PLAYERS_LOADED': {
      if (action.loadId !== state.loadId) return state; // stale fetch
      return { ...state, phase: 'ready', players: action.players, pendingLoad: null, error: null };
    }

    case 'LOAD_ERROR': {
      if (action.loadId !== state.loadId) return state;
      return { ...state, phase: 'ready', players: [], pendingLoad: null, error: 'Failed to load players. Try skipping.' };
    }

    case 'REROLL_TEAM': {
      if (state.rerolls.teamUsed || !state.team || state.phase !== 'ready') return state;
      const result = rerollTeam(state.eraQueue, state.team.id);
      if (!result) return state;
      const loadId = state.loadId + 1;
      return {
        ...state,
        rerolls: { ...state.rerolls, teamUsed: true },
        eraQueue: result.newQueue,
        phase: 'loading',
        era: result.item.era,
        team: result.item.team,
        players: [],
        pendingLoad: { teamId: result.item.team.id, eraId: result.item.era.id, era: result.item.era, team: result.item.team, loadId },
        loadId,
      };
    }

    case 'REROLL_ERA': {
      if (state.rerolls.eraUsed || !state.era || state.phase !== 'ready') return state;
      const result = rerollEra(state.eraQueue, state.era.id);
      if (!result) return state;
      const loadId = state.loadId + 1;
      return {
        ...state,
        rerolls: { ...state.rerolls, eraUsed: true },
        eraQueue: result.newQueue,
        phase: 'loading',
        era: result.item.era,
        team: result.item.team,
        players: [],
        pendingLoad: { teamId: result.item.team.id, eraId: result.item.era.id, era: result.item.era, team: result.item.team, loadId },
        loadId,
      };
    }

    case 'REMOVE_PLAYER': {
      return {
        ...state,
        slots: state.slots.map(s => s.id === action.slotId ? { ...s, player: null } : s),
        justPlacedSlotId: state.justPlacedSlotId === action.slotId ? null : state.justPlacedSlotId,
      };
    }

    case 'ACTIVATE_SWAP': {
      return {
        ...state,
        slots: state.slots.map(s => s.id === action.slotId ? { ...s, player: null } : s),
        swapSlotId: action.slotId,
      };
    }

    case 'CANCEL_SWAP':
      return { ...state, swapSlotId: null };

    case 'SET_SIMULATION':
      return { ...state, simulationResult: action.result, showResults: true };

    case 'CLOSE_RESULTS':
      return { ...state, showResults: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const INITIAL: GameState = {
  phase: 'loading',
  eraQueue: [],
  era: null,
  team: null,
  players: [],
  slots: freshSlots(),
  playerToPlace: null,
  justPlacedSlotId: null,
  rerolls: { teamUsed: false, eraUsed: false },
  swapSlotId: null,
  pendingLoad: null,
  loadId: 0,
  error: null,
  simulationResult: null,
  showResults: false,
};

export default function GameContainer() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const cfg = SPORT_CONFIG;

  // Boot
  useEffect(() => { dispatch({ type: 'NEW_GAME' }); }, []);

  // Async player fetch — only place async work happens
  useEffect(() => {
    if (!state.pendingLoad) return;
    const { teamId, eraId, loadId } = state.pendingLoad;
    let cancelled = false;

    fetch(`/api/players/nba?teamId=${encodeURIComponent(teamId)}&eraId=${encodeURIComponent(eraId)}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() as Promise<PlayersResponse>; })
      .then(data => { if (!cancelled) dispatch({ type: 'PLAYERS_LOADED', players: data.players, loadId }); })
      .catch(() => { if (!cancelled) dispatch({ type: 'LOAD_ERROR', loadId }); });

    return () => { cancelled = true; };
  }, [state.pendingLoad]);

  // Simulate
  const handleSimulate = async () => {
    if (state.phase !== 'complete') return;
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sport: 'nba', mode: 'combined', slots: state.slots }),
      });
      if (!res.ok) throw new Error();
      dispatch({ type: 'SET_SIMULATION', result: await res.json() });
    } catch { /* ignore */ }
  };

  // Derived
  const openRequired = state.slots.filter(s => s.required && !s.player).length;
  const gspr = state.team ? computeTeamGSPR(state.slots, 'nba', 'combined').gspr : 0;
  const tier = getGsprTier(gspr);

  return (
    <div className="theme-nba min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏀</span>
            <span className="font-black text-xl tracking-tight text-white">NBA GOD SQUAD</span>
            <span className="text-xs text-gray-500 hidden sm:block">{cfg.tagline}</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'NEW_GAME' })}
            className="text-xs text-gray-500 hover:text-gray-300 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {state.error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-300 text-sm flex items-center justify-between">
            {state.error}
            <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })} className="text-red-400 hover:text-red-200 ml-2">✕</button>
          </div>
        )}

        <div className="mb-4">
          <EraCard era={state.era} team={state.team} isLoading={state.phase === 'loading'} sport="nba" />
        </div>

        {/* Rerolls */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => dispatch({ type: 'REROLL_TEAM' })}
            disabled={state.rerolls.teamUsed || state.phase !== 'ready'}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {state.rerolls.teamUsed ? '✓ Team rerolled' : '🔀 Reroll Team'}
          </button>
          <button
            onClick={() => dispatch({ type: 'REROLL_ERA' })}
            disabled={state.rerolls.eraUsed || state.phase !== 'ready'}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {state.rerolls.eraUsed ? '✓ Era rerolled' : '🔀 Reroll Era'}
          </button>
        </div>

        {state.swapSlotId && (
          <div className="mb-3 px-4 py-2 bg-yellow-950/60 border border-yellow-700 rounded-lg text-yellow-300 text-sm flex items-center gap-2">
            <span>🔄 Pick any player to swap them into the slot.</span>
            <button onClick={() => dispatch({ type: 'CANCEL_SWAP' })} className="ml-auto text-yellow-400 hover:text-yellow-200 text-xs">Cancel</button>
          </div>
        )}

        {state.justPlacedSlotId && state.phase === 'loading' && (
          <div className="mb-3 px-4 py-2.5 bg-green-950/50 border border-green-800/50 rounded-xl text-sm flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-green-300">Player placed!</span>
            <span className="text-gray-500">{openRequired} slot{openRequired !== 1 ? 's' : ''} remaining — rolling next pick…</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr_1px_280px] gap-4 mt-4">

          {/* Pool column */}
          {state.phase === 'ready' ? (
            <PlayerPool
              key={state.era?.id}
              players={state.players}
              onDraft={(player) => dispatch({ type: 'DRAFT_PLAYER', player })}
              onSkip={() => dispatch({ type: 'SKIP_PICK' })}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              {state.phase === 'loading' && (
                <>
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Rolling next pick…</p>
                </>
              )}
              {state.phase === 'placing' && (
                <p className="text-sm text-gray-500">Choose a slot for <strong className="text-white">{state.playerToPlace?.name}</strong></p>
              )}
              {state.phase === 'complete' && (
                <>
                  <p className="text-sm text-green-400 font-semibold">✓ Roster complete</p>
                  <p className="text-xs text-gray-500">Simulate your season →</p>
                </>
              )}
            </div>
          )}

          <div className="hidden lg:block bg-white/5" />

          <TeamRoster
            slots={state.slots}
            sport="nba"
            onRemove={(slotId) => dispatch({ type: 'REMOVE_PLAYER', slotId })}
            onPositionSwap={(slotId) => dispatch({ type: 'ACTIVATE_SWAP', slotId })}
            positionSwapUsed={false}
            justPlacedSlotId={state.justPlacedSlotId}
          />

          <div className="hidden lg:block bg-white/5" />

          <div className="flex flex-col gap-4">
            <PowerMeter gspr={gspr} slots={state.slots} sport="nba" mode="combined" />

            <div className="text-center py-2">
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: tier.color }}>{tier.label}</div>
              <div className="text-2xl font-black tabular-nums" style={{ color: tier.color }}>{Math.round(gspr)}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">GSPR</div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={state.phase !== 'complete'}
              className={`w-full py-4 rounded-xl font-black text-lg tracking-wide uppercase transition-all duration-200
                ${state.phase === 'complete'
                  ? 'text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              style={state.phase === 'complete'
                ? { background: `linear-gradient(135deg, ${cfg.primaryColor}, ${cfg.accentColor})` }
                : undefined}
            >
              {state.phase === 'complete'
                ? '⚡ Simulate Season'
                : `${openRequired} slot${openRequired !== 1 ? 's' : ''} remaining`}
            </button>
          </div>
        </div>
      </div>

      {state.phase === 'placing' && state.playerToPlace && (
        <PlayerPlacementPicker
          player={state.playerToPlace}
          slots={state.slots}
          onPlace={(player, slotId) => dispatch({ type: 'PLACE_PLAYER', player, slotId })}
          onCancel={() => dispatch({ type: 'CANCEL_PLACEMENT' })}
        />
      )}

      {state.showResults && state.simulationResult && (
        <SimulationModal
          results={state.simulationResult}
          onClose={() => dispatch({ type: 'CLOSE_RESULTS' })}
          onNewGame={() => dispatch({ type: 'NEW_GAME' })}
        />
      )}
    </div>
  );
}
