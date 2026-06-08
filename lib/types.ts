export type Sport = 'nba';

export type DraftMode = 'combined';

export interface Era {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  sport: Sport;
  teamId: string;
  description: string;
}

export interface HistoricalTeam {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  sport: Sport;
  primaryColor: string;
  secondaryColor: string;
}

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export type PositionGroup = 'offense';

export interface PlayerStats {
  points?: number;
  rebounds?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  fieldGoalPct?: number;
  threePointPct?: number;
  freeThrowPct?: number;
  turnovers?: number;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  positionGroup: PositionGroup;
  eraId?: string;
  teamId?: string;
  bestSeasonYear?: number;
  yearsWithTeam: string;
  stats: PlayerStats;
  playerScore: number;
  isLegend?: boolean;
  isAllStar?: boolean;
  imageUrl?: string;
}

export interface RosterSlotTemplate {
  id: string;
  position: Position | Position[];
  label: string;
  group: PositionGroup;
  required: boolean;
}

export interface FilledRosterSlot extends RosterSlotTemplate {
  player: Player | null;
}

export interface TeamPower {
  gspr: number;
  offenseScore: number;
  defenseScore: number;
  depthScore: number;
  chemistryBonus: number;
  tier: 'average' | 'good' | 'great' | 'legendary' | 'god';
  breakdown: string[];
}

export interface GameResult {
  gameNumber: number;
  win: boolean;
  scoreDiff: number;
  opponentTier: string;
}

export interface SeasonResults {
  sport: Sport;
  wins: number;
  losses: number;
  totalGames: number;
  games: GameResult[];
  teamPower: TeamPower;
  isUndefeated: boolean;
  longestWinStreak: number;
  achievement: string;
  achievementSubtext: string;
  recordLabel: string;
}

export interface RerollState {
  teamUsed: boolean;
  eraUsed: boolean;
}

export interface EraResponse {
  era: Era;
  team: HistoricalTeam;
}

export interface PlayersResponse {
  players: Player[];
  era: Era;
  team: HistoricalTeam;
}
