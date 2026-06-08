import type { Sport, SeasonResults, TeamPower, GameResult } from '../types';
import { SPORT_CONFIG } from '../constants';
import { clamp, getAchievement } from '../utils';

// NBA-only win probability
// Going undefeated (82-0): ~20-25% at max GSPR, ~5-10% at GSPR 900

const WIN_PROB_CONFIG = { base: 0.620, range: 0.365, power: 1.8 };

export function getBaseWinProbability(gspr: number, _sport?: Sport): number {
  const { base, range, power } = WIN_PROB_CONFIG;
  const normalized = Math.pow(gspr / 1000, power);
  return clamp(base + range * normalized, 0.05, 0.995);
}

// ─── Opponent tiers ───────────────────────────────────────────────────────────

const OPPONENT_TIERS = [
  { weight: 0.10, label: 'Elite',   strengthBonus:  0.12 },
  { weight: 0.20, label: 'Strong',  strengthBonus:  0.06 },
  { weight: 0.40, label: 'Average', strengthBonus:  0.00 },
  { weight: 0.20, label: 'Weak',    strengthBonus: -0.05 },
  { weight: 0.10, label: 'Poor',    strengthBonus: -0.10 },
];

function sampleOpponentTier(rand: number): (typeof OPPONENT_TIERS)[0] {
  let cumulative = 0;
  for (const tier of OPPONENT_TIERS) {
    cumulative += tier.weight;
    if (rand < cumulative) return tier;
  }
  return OPPONENT_TIERS[2];
}

// ─── Season Simulation ────────────────────────────────────────────────────────

export function simulateSeason(teamPower: TeamPower, _sport?: Sport): SeasonResults {
  const totalGames = SPORT_CONFIG.gamesInSeason;
  const baseWinProb = getBaseWinProbability(teamPower.gspr);

  const games: GameResult[] = [];
  let wins = 0;
  let losses = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  // Seeded pseudorandom for consistency within session
  let seed = teamPower.gspr * 1000 + Math.floor(Date.now() / 10000);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  for (let g = 1; g <= totalGames; g++) {
    const opponent = sampleOpponentTier(rand());
    const adjustedProb = clamp(baseWinProb - opponent.strengthBonus, 0.05, 0.995);
    const win = rand() < adjustedProb;
    const margin = win
      ? Math.floor(rand() * 18 + 2)
      : -Math.floor(rand() * 15 + 1);

    games.push({ gameNumber: g, win, scoreDiff: margin, opponentTier: opponent.label });

    if (win) {
      wins++;
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      losses++;
      currentStreak = 0;
    }
  }

  const isUndefeated = losses === 0;
  const { title: achievement, subtext: achievementSubtext } = getAchievement(wins, losses, 'nba');

  return {
    sport: 'nba',
    wins,
    losses,
    totalGames,
    games,
    teamPower,
    isUndefeated,
    longestWinStreak: longestStreak,
    achievement,
    achievementSubtext,
    recordLabel: `${wins}-${losses}`,
  };
}

export function estimateUndefeatedChance(gspr: number): number {
  const p = getBaseWinProbability(gspr);
  return Math.pow(p, SPORT_CONFIG.gamesInSeason) * 100;
}
