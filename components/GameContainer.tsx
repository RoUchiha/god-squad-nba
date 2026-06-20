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

import { useReducer, useEffect, useRef } from 'react';
import type {
  Era, HistoricalTeam, Player, FilledRosterSlot, Position,
  PlayersResponse, SeasonResults, RerollState,
} from '@/lib/types';
import { NBA_ROSTER, SPORT_CONFIG, getGsprTier } from '@/lib/constants';
import { computeTeamGSPR } from '@/lib/algorithms/powerRating';
import {
  buildEraQueue,
  hasEraReroll,
  hasTeamReroll,
  pickGambleEra,
  rerollTeam,
  rerollEra,
  type EraQueueItem,
} from '@/lib/eraQueue';
import { selectGambleReplacement } from '@/lib/gamble';
import { hasFilledPrimarySlot, isFlexSlot, rosterHasPlayer, slotAcceptsPlayer } from '@/lib/playerIdentity';
import { swapRosterSlots } from '@/lib/rosterActions';
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

interface PendingGambleLoad {
  slotId: string;
  candidates: EraQueueItem[];
  loadId: number;
}

interface InvalidSelection {
  playerId: string;
  message: string;
  nonce: number;
}

export interface GameState {
  phase: 'loading' | 'ready' | 'placing' | 'complete';
  eraQueue: EraQueueItem[];
  seenTeamEraKeys: Set<string>;
  era: Era | null;
  team: HistoricalTeam | null;
  players: Player[];
  slots: FilledRosterSlot[];
  playerToPlace: Player | null;
  justPlacedSlotId: string | null;
  rerolls: RerollState;
  swapSlotId: string | null;
  invalidRosterSlotId: string | null;
  rosterActionMessage: string | null;
  positionSwapUsed: boolean;
  gambleUsed: boolean;
  gambleConfirmSlotId: string | null;
  gamblePending: boolean;
  pendingGamble: PendingGambleLoad | null;
  pendingLoad: PendingLoad | null;
  loadId: number;
  error: string | null;
  invalidSelection: InvalidSelection | null;
  simulationResult: SeasonResults | null;
  simulationCount: number;
  simulationPending: boolean;
  gameplayLocked: boolean;
  showResults: boolean;
}

export type GameAction =
  | { type: 'NEW_GAME' }
  | { type: 'DRAFT_PLAYER'; player: Player }
  | { type: 'PLACE_PLAYER'; player: Player; slotId: string }
  | { type: 'SKIP_PICK' }
  | { type: 'CANCEL_PLACEMENT' }
  | { type: 'PLAYERS_LOADED'; players: Player[]; loadId: number }
  | { type: 'LOAD_ERROR'; loadId: number }
  | { type: 'REROLL_TEAM' }
  | { type: 'REROLL_ERA' }
  | { type: 'START_ROSTER_SWAP'; slotId: string }
  | { type: 'COMMIT_ROSTER_SWAP'; slotId: string }
  | { type: 'CANCEL_SWAP' }
  | { type: 'REQUEST_GAMBLE'; slotId: string }
  | { type: 'CONFIRM_GAMBLE' }
  | { type: 'CANCEL_GAMBLE' }
  | { type: 'APPLY_GAMBLE'; slotId: string; item: EraQueueItem; player: Player; loadId: number }
  | { type: 'GAMBLE_FAILED'; loadId: number; message: string }
  | { type: 'START_SIMULATION'; loadId: number }
  | { type: 'SET_SIMULATION'; result: SeasonResults; loadId: number }
  | { type: 'SIMULATION_FAILED'; loadId: number }
  | { type: 'CLOSE_RESULTS' }
  | { type: 'CLEAR_ERROR' };

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const MAIN_POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];

function currentExtraPosition(slots: FilledRosterSlot[]): Position | null {
  const extra = slots.find(slot => slot.id === '6man');
  return typeof extra?.position === 'string' ? extra.position : null;
}

function randomExtraPosition(previous?: Position | null): Position {
  const options = previous
    ? MAIN_POSITIONS.filter(position => position !== previous)
    : MAIN_POSITIONS;
  return options[Math.floor(Math.random() * options.length)] ?? MAIN_POSITIONS[0];
}

function buildFreshSlots(extraPosition: Position): FilledRosterSlot[] {
  return NBA_ROSTER.map(t => {
    if (t.id !== '6man') return { ...t, player: null };
    return {
      ...t,
      position: extraPosition,
      label: `${extraPosition} 6th Man`,
      player: null,
    };
  });
}

function freshSlots(previousExtra?: Position | null): FilledRosterSlot[] {
  return buildFreshSlots(randomExtraPosition(previousExtra));
}

function compatibleSlots(slots: FilledRosterSlot[], player: Player): FilledRosterSlot[] {
  return slots.filter(s => {
    if (s.player) return false;
    return slotAcceptsPlayer(s, player);
  });
}

function placeInSlot(slots: FilledRosterSlot[], slotId: string, player: Player): FilledRosterSlot[] {
  return slots.map(s => s.id === slotId ? { ...s, player } : s);
}

function isComplete(slots: FilledRosterSlot[]): boolean {
  return slots.filter(s => s.required).every(s => s.player !== null);
}

function invalidPick(state: GameState, player: Player, message: string): GameState {
  return {
    ...state,
    phase: 'ready',
    invalidSelection: {
      playerId: player.id,
      message,
      nonce: (state.invalidSelection?.nonce ?? 0) + 1,
    },
  };
}

/** Pop next from queue (rebuilds if empty) and return a loading state. */
function toNextPick(state: GameState, queue?: EraQueueItem[]): GameState {
  const q = queue ?? state.eraQueue;
  const src = q.length > 0 ? q : buildEraQueue({ excludeKeys: state.seenTeamEraKeys });
  const [next, ...rest] = src;
  if (!next) {
    return {
      ...state,
      phase: 'ready',
      players: [],
      pendingLoad: null,
      error: 'No unused validated team-era options remain for this run.',
    };
  }
  const seenTeamEraKeys = new Set(state.seenTeamEraKeys);
  seenTeamEraKeys.add(next.key);
  const loadId = state.loadId + 1;
  return {
    ...state,
    phase: 'loading',
    eraQueue: rest,
    seenTeamEraKeys,
    era: next.era,
    team: next.team,
    players: [],
    playerToPlace: null,
    swapSlotId: null,
    invalidSelection: null,
    pendingLoad: { teamId: next.team.id, eraId: next.era.id, era: next.era, team: next.team, loadId },
    loadId,
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'NEW_GAME': {
      const q = buildEraQueue();
      return toNextPick({
        ...state,
        slots: freshSlots(currentExtraPosition(state.slots)),
        rerolls: { teamUsed: false, eraUsed: false },
        swapSlotId: null,
        invalidRosterSlotId: null,
        rosterActionMessage: null,
        positionSwapUsed: false,
        gambleUsed: false,
        gambleConfirmSlotId: null,
        gamblePending: false,
        pendingGamble: null,
        simulationResult: null,
        simulationCount: 0,
        simulationPending: false,
        gameplayLocked: false,
        showResults: false,
        error: null,
        eraQueue: q,
        era: null,
        team: null,
        players: [],
        playerToPlace: null,
        justPlacedSlotId: null,
        invalidSelection: null,
        pendingLoad: null,
        seenTeamEraKeys: new Set<string>(),
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
      if (state.phase !== 'ready' || state.gameplayLocked) return state; // ← THE GUARD

      const { player } = action;

      if (state.swapSlotId) {
        return invalidPick(state, player, 'Choose another filled roster spot to complete the swap.');
      }

      // Belt-and-suspenders: player already placed → just advance
      if (rosterHasPlayer(state.slots, player)) {
        return invalidPick(state, player, 'That player is already on your roster.');
      }

      const compat = compatibleSlots(state.slots, player);

      if (compat.length === 0) {
        return invalidPick(state, player, `${player.position} is already filled. Pick a player for an open spot.`);
      }

      if (compat.length === 1) {
        if (isFlexSlot(compat[0]) && hasFilledPrimarySlot(state.slots, player)) {
          return { ...state, phase: 'placing', playerToPlace: player, justPlacedSlotId: null, invalidSelection: null };
        }
        const newSlots = placeInSlot(state.slots, compat[0].id, player);
        if (isComplete(newSlots)) {
          return { ...state, phase: 'complete', slots: newSlots, players: [], justPlacedSlotId: compat[0].id, invalidSelection: null };
        }
        return toNextPick({ ...state, slots: newSlots, justPlacedSlotId: compat[0].id, invalidSelection: null });
      }

      // Multiple compatible slots → placement picker
      // phase → 'placing' means PlayerPool will NOT be in the DOM,
      // so no further DRAFT_PLAYER dispatches are possible from the UI.
      return { ...state, phase: 'placing', playerToPlace: player, justPlacedSlotId: null, invalidSelection: null };
    }

    case 'PLACE_PLAYER': {
      if (state.phase !== 'placing' || state.gameplayLocked) return state;
      const newSlots = placeInSlot(state.slots, action.slotId, action.player);
      if (isComplete(newSlots)) {
        return { ...state, phase: 'complete', slots: newSlots, playerToPlace: null, players: [], justPlacedSlotId: action.slotId, invalidSelection: null };
      }
      return toNextPick({ ...state, slots: newSlots, playerToPlace: null, justPlacedSlotId: action.slotId, invalidSelection: null });
    }

    case 'SKIP_PICK': {
      if (state.phase !== 'ready' || state.gameplayLocked) return state;
      return toNextPick(state);
    }

    case 'CANCEL_PLACEMENT': {
      if (state.phase !== 'placing') return state;
      return toNextPick({ ...state, playerToPlace: null });
    }

    case 'PLAYERS_LOADED': {
      if (action.loadId !== state.loadId) return state; // stale fetch
      return { ...state, phase: 'ready', players: action.players, pendingLoad: null, error: null, invalidSelection: null };
    }

    case 'LOAD_ERROR': {
      if (action.loadId !== state.loadId) return state;
      return { ...state, phase: 'ready', players: [], pendingLoad: null, error: 'Failed to load players. Try skipping.' };
    }

    case 'REROLL_TEAM': {
      if (state.gameplayLocked || state.rerolls.teamUsed || !state.team || state.phase !== 'ready') return state;
      if (!state.era) return state;
      const result = rerollTeam(state.eraQueue, state.team.id, state.era.startYear);
      if (!result) return { ...state, error: 'No unused team reroll is available near this era.' };
      const seenTeamEraKeys = new Set(state.seenTeamEraKeys);
      seenTeamEraKeys.add(result.item.key);
      const loadId = state.loadId + 1;
      return {
        ...state,
        rerolls: { ...state.rerolls, teamUsed: true },
        eraQueue: result.newQueue,
        seenTeamEraKeys,
        phase: 'loading',
        era: result.item.era,
        team: result.item.team,
        players: [],
        invalidSelection: null,
        pendingLoad: { teamId: result.item.team.id, eraId: result.item.era.id, era: result.item.era, team: result.item.team, loadId },
        loadId,
      };
    }

    case 'REROLL_ERA': {
      if (state.gameplayLocked || state.rerolls.eraUsed || !state.era || !state.team || state.phase !== 'ready') return state;
      const result = rerollEra(state.eraQueue, state.team, state.era.id);
      if (!result) return { ...state, error: 'No unused era reroll is available for this team.' };
      const seenTeamEraKeys = new Set(state.seenTeamEraKeys);
      seenTeamEraKeys.add(result.item.key);
      const loadId = state.loadId + 1;
      return {
        ...state,
        rerolls: { ...state.rerolls, eraUsed: true },
        eraQueue: result.newQueue,
        seenTeamEraKeys,
        phase: 'loading',
        era: result.item.era,
        team: result.item.team,
        players: [],
        invalidSelection: null,
        pendingLoad: { teamId: result.item.team.id, eraId: result.item.era.id, era: result.item.era, team: result.item.team, loadId },
        loadId,
      };
    }

    case 'START_ROSTER_SWAP': {
      if (state.phase !== 'ready' || state.gameplayLocked) return state;
      if (state.positionSwapUsed || state.swapSlotId) return state;
      const targetSlot = state.slots.find(s => s.id === action.slotId);
      if (!targetSlot?.player) return state;
      return {
        ...state,
        swapSlotId: action.slotId,
        invalidRosterSlotId: null,
        rosterActionMessage: null,
        invalidSelection: null,
      };
    }

    case 'COMMIT_ROSTER_SWAP': {
      if (state.phase !== 'ready' || state.gameplayLocked || !state.swapSlotId) return state;
      const newSlots = swapRosterSlots(state.slots, state.swapSlotId, action.slotId);
      if (!newSlots) {
        return {
          ...state,
          invalidRosterSlotId: action.slotId,
          rosterActionMessage: 'Those two roster spots are not position-compatible.',
        };
      }

      return {
        ...state,
        slots: newSlots,
        swapSlotId: null,
        invalidRosterSlotId: null,
        rosterActionMessage: null,
        positionSwapUsed: true,
        justPlacedSlotId: action.slotId,
      };
    }

    case 'CANCEL_SWAP':
      return { ...state, swapSlotId: null, invalidRosterSlotId: null, rosterActionMessage: null };

    case 'REQUEST_GAMBLE': {
      if (state.phase !== 'complete' || state.gameplayLocked || state.gambleUsed || state.gamblePending) return state;
      const slot = state.slots.find(item => item.id === action.slotId);
      if (!slot?.player) return state;
      return { ...state, gambleConfirmSlotId: action.slotId, error: null };
    }

    case 'CANCEL_GAMBLE':
      return { ...state, gambleConfirmSlotId: null };

    case 'CONFIRM_GAMBLE': {
      if (state.phase !== 'complete' || state.gameplayLocked || state.gambleUsed || state.gamblePending || !state.gambleConfirmSlotId) return state;
      const candidates = state.eraQueue.length > 0
        ? state.eraQueue
        : buildEraQueue({ excludeKeys: state.seenTeamEraKeys });
      if (candidates.length === 0) {
        return {
          ...state,
          gambleConfirmSlotId: null,
          error: 'No unused validated team-eras remain for a Gamble.',
        };
      }
      const loadId = state.loadId + 1;
      return {
        ...state,
        gambleConfirmSlotId: null,
        gamblePending: true,
        pendingGamble: { slotId: state.gambleConfirmSlotId, candidates, loadId },
        loadId,
        error: null,
      };
    }

    case 'APPLY_GAMBLE': {
      if (state.gameplayLocked || !state.pendingGamble || action.loadId !== state.pendingGamble.loadId || action.slotId !== state.pendingGamble.slotId) return state;
      const seenTeamEraKeys = new Set(state.seenTeamEraKeys);
      seenTeamEraKeys.add(action.item.key);
      return {
        ...state,
        slots: placeInSlot(state.slots, action.slotId, action.player),
        eraQueue: state.eraQueue.filter(item => item.key !== action.item.key),
        seenTeamEraKeys,
        gambleUsed: true,
        gamblePending: false,
        pendingGamble: null,
        justPlacedSlotId: action.slotId,
        simulationResult: null,
        simulationCount: 0,
        showResults: false,
        error: null,
      };
    }

    case 'GAMBLE_FAILED':
      if (!state.pendingGamble || action.loadId !== state.pendingGamble.loadId) return state;
      return {
        ...state,
        gamblePending: false,
        pendingGamble: null,
        error: action.message,
      };

    case 'START_SIMULATION':
      if (
        state.phase !== 'complete' ||
        state.simulationCount >= 2 ||
        state.simulationPending ||
        state.gamblePending ||
        state.gambleConfirmSlotId
      ) return state;
      return {
        ...state,
        gameplayLocked: true,
        simulationPending: true,
        swapSlotId: null,
        gambleConfirmSlotId: null,
        loadId: action.loadId,
      };

    case 'SET_SIMULATION':
      if (!state.simulationPending || action.loadId !== state.loadId) return state;
      return {
        ...state,
        simulationResult: action.result,
        simulationCount: Math.min(2, state.simulationCount + 1),
        simulationPending: false,
        showResults: true,
      };

    case 'SIMULATION_FAILED':
      if (!state.simulationPending || action.loadId !== state.loadId) return state;
      return { ...state, simulationPending: false, error: 'Simulation failed. Try again.' };

    case 'CLOSE_RESULTS':
      return { ...state, showResults: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const INITIAL_GAME_STATE: GameState = {
  phase: 'loading',
  eraQueue: [],
  seenTeamEraKeys: new Set<string>(),
  era: null,
  team: null,
  players: [],
  slots: buildFreshSlots('SF'),
  playerToPlace: null,
  justPlacedSlotId: null,
  rerolls: { teamUsed: false, eraUsed: false },
  swapSlotId: null,
  invalidRosterSlotId: null,
  rosterActionMessage: null,
  positionSwapUsed: false,
  gambleUsed: false,
  gambleConfirmSlotId: null,
  gamblePending: false,
  pendingGamble: null,
  pendingLoad: null,
  loadId: 0,
  error: null,
  invalidSelection: null,
  simulationResult: null,
  simulationCount: 0,
  simulationPending: false,
  gameplayLocked: false,
  showResults: false,
};

export default function GameContainer() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
  const simulationRequestLock = useRef(false);
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

  // Gamble fetches unseen era rosters until one has a compatible non-duplicate replacement.
  useEffect(() => {
    if (!state.pendingGamble) return;
    const { slotId, loadId } = state.pendingGamble;
    let cancelled = false;

    async function runGamble() {
      let queue = state.pendingGamble?.candidates ?? [];
      let attempts = 0;

      while (queue.length > 0 && attempts < 24) {
        const result = pickGambleEra(queue);
        if (!result) break;
        attempts++;
        queue = result.newQueue;

        try {
          const { item } = result;
          const res = await fetch(`/api/players/nba?teamId=${encodeURIComponent(item.team.id)}&eraId=${encodeURIComponent(item.era.id)}`);
          if (!res.ok) continue;
          const data = await res.json() as PlayersResponse;
          const replacement = selectGambleReplacement(state.slots, slotId, data.players);
          if (replacement) {
            if (!cancelled) dispatch({ type: 'APPLY_GAMBLE', slotId, item, player: replacement, loadId });
            return;
          }
        } catch {
          // Try the next unseen era candidate.
        }
      }

      if (!cancelled) {
        dispatch({
          type: 'GAMBLE_FAILED',
          loadId,
          message: 'No compatible Gamble replacement was available from the remaining unseen eras.',
        });
      }
    }

    void runGamble();

    return () => { cancelled = true; };
  }, [state.pendingGamble, state.slots]);

  useEffect(() => {
    if (!state.simulationPending) simulationRequestLock.current = false;
  }, [state.simulationPending]);

  // Simulate
  const handleSimulate = async () => {
    if (
      simulationRequestLock.current ||
      state.phase !== 'complete' ||
      state.simulationCount >= 2 ||
      state.simulationPending ||
      state.gamblePending ||
      state.gambleConfirmSlotId
    ) return;
    simulationRequestLock.current = true;
    const loadId = state.loadId + 1;
    dispatch({ type: 'START_SIMULATION', loadId });
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sport: 'nba', mode: 'combined', slots: state.slots }),
      });
      if (!res.ok) throw new Error();
      dispatch({ type: 'SET_SIMULATION', result: await res.json(), loadId });
    } catch {
      dispatch({ type: 'SIMULATION_FAILED', loadId });
    }
  };

  // Derived
  const openRequired = state.slots.filter(s => s.required && !s.player).length;
  const gspr = state.team ? computeTeamGSPR(state.slots, 'nba', 'combined').gspr : 0;
  const tier = getGsprTier(gspr);
  const canUseTeamReroll = Boolean(
    state.team &&
    state.era &&
    !state.rerolls.teamUsed &&
    !state.gameplayLocked &&
    hasTeamReroll(state.eraQueue, state.team.id, state.era.startYear)
  );
  const canUseEraReroll = Boolean(
    state.team &&
    state.era &&
    !state.rerolls.eraUsed &&
    !state.gameplayLocked &&
    hasEraReroll(state.eraQueue, state.team.id, state.era.id)
  );
  const canSimulate = state.phase === 'complete' && state.simulationCount < 2 && !state.simulationPending && !state.gamblePending;
  const gambleSlot = state.gambleConfirmSlotId
    ? state.slots.find(slot => slot.id === state.gambleConfirmSlotId) ?? null
    : null;

  return (
    <div className="theme-nba min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏀</span>
            <span className="font-display text-xl text-white">NBA GOD SQUAD</span>
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

        {state.rosterActionMessage && (
          <div className="mb-3 rounded-lg border border-red-700 bg-red-950/50 px-4 py-2 text-sm text-red-300">
            {state.rosterActionMessage}
          </div>
        )}

        {state.phase !== 'complete' && <div className="mb-4">
          <EraCard era={state.era} team={state.team} isLoading={state.phase === 'loading'} sport="nba" />
        </div>}

        {/* Rerolls */}
        {state.phase !== 'complete' && <div className="flex gap-2 mb-4">
          <button
            onClick={() => dispatch({ type: 'REROLL_TEAM' })}
            disabled={state.rerolls.teamUsed || state.phase !== 'ready' || !canUseTeamReroll}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {state.rerolls.teamUsed ? '✓ Team rerolled' : canUseTeamReroll ? '🔀 Reroll Team' : 'Team unavailable'}
          </button>
          <button
            onClick={() => dispatch({ type: 'REROLL_ERA' })}
            disabled={state.rerolls.eraUsed || state.phase !== 'ready' || !canUseEraReroll}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {state.rerolls.eraUsed ? '✓ Era rerolled' : canUseEraReroll ? '🔀 Reroll Era' : 'Era unavailable'}
          </button>
        </div>}

        {state.swapSlotId && (
          <div className="mb-3 px-4 py-2 bg-yellow-950/60 border border-yellow-700 rounded-lg text-yellow-300 text-sm flex items-center gap-2">
            <span>Choose another filled roster spot to complete the swap.</span>
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

        <div className={`grid grid-cols-1 gap-4 mt-4 ${state.phase === 'complete'
          ? 'lg:grid-cols-[minmax(0,1fr)_1px_360px]'
          : 'lg:grid-cols-[1fr_1px_1fr_1px_280px]'
        }`}>

          {/* Pool column */}
          {state.phase !== 'complete' && (state.phase === 'ready' ? (
            <PlayerPool
              key={state.era?.id}
              players={state.players}
              invalidSelection={state.invalidSelection}
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
              {false && (
                <>
                  <p className="text-sm text-green-400 font-semibold">✓ Roster complete</p>
                  <p className="text-xs text-gray-500">Simulate your season →</p>
                </>
              )}
            </div>
          ))}

          {state.phase !== 'complete' && <div className="hidden lg:block bg-white/5" />}

          <TeamRoster
            slots={state.slots}
            sport="nba"
            onPositionSwap={(slotId) => dispatch({ type: 'START_ROSTER_SWAP', slotId })}
            onRosterSwapTarget={(slotId) => dispatch({ type: 'COMMIT_ROSTER_SWAP', slotId })}
            positionSwapUsed={state.positionSwapUsed || state.gameplayLocked || Boolean(state.swapSlotId) || state.phase !== 'ready'}
            activeSwapSlotId={state.swapSlotId}
            invalidSwapSlotId={state.invalidRosterSlotId}
            justPlacedSlotId={state.justPlacedSlotId}
            onGamble={(slotId) => dispatch({ type: 'REQUEST_GAMBLE', slotId })}
            gambleAvailable={state.phase === 'complete' && !state.gameplayLocked && !state.gambleUsed && !state.gamblePending}
            gamblePending={state.gamblePending}
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
              disabled={!canSimulate}
              className={`w-full py-4 rounded-xl font-black text-lg tracking-wide uppercase transition-all duration-200
                ${canSimulate
                  ? 'text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              style={canSimulate
                ? { background: `linear-gradient(135deg, ${cfg.primaryColor}, ${cfg.accentColor})` }
                : undefined}
            >
              {state.gamblePending
                ? 'Gambling...'
                : state.simulationPending
                ? 'Simulating...'
                : state.phase === 'complete' && state.simulationCount === 0
                ? '⚡ Simulate Season'
                : state.phase === 'complete' && state.simulationCount === 1
                ? '↻ Re-simulate Season'
                : state.phase === 'complete'
                ? 'Simulation Final'
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

      {gambleSlot?.player && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-lg border border-yellow-500/20 bg-[#11100e] p-5 shadow-2xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Confirm Gamble</div>
            <h3 className="mt-1 text-xl font-black text-white">{gambleSlot.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Replace {gambleSlot.player.name} with the best compatible non-duplicate player from a random unseen team-era. The result may raise or lower this roster.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => dispatch({ type: 'CANCEL_GAMBLE' })}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => dispatch({ type: 'CONFIRM_GAMBLE' })}
                className="flex-1 rounded-lg bg-yellow-500/20 py-3 text-sm font-black text-yellow-200 transition-colors hover:bg-yellow-500/30"
              >
                Gamble
              </button>
            </div>
          </div>
        </div>
      )}

      {state.showResults && state.simulationResult && (
        <SimulationModal
          results={state.simulationResult}
          onClose={() => dispatch({ type: 'CLOSE_RESULTS' })}
          onNewGame={() => dispatch({ type: 'NEW_GAME' })}
          onResimulate={handleSimulate}
          canResimulate={state.simulationCount < 2}
          isResimulating={state.simulationPending}
        />
      )}
    </div>
  );
}
