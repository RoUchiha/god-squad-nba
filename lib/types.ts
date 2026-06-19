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
  logoUrl?: string;
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

export interface TeamCompositionAnalysis {
  pros: string[];
  cons: string[];
}

export interface GameResult {
  gameNumber: number;
  win: boolean;
  scoreDiff: number;
  opponentTier: string;
  opponentTeamId: string;
  opponentName: string;
  opponentAbbreviation: string;
  opponentGspr: number;
  isHome: boolean;
  teamScore: number;
  opponentScore: number;
}

export interface NBATeamStrength {
  teamId: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: 'East' | 'West';
  division: string;
  gspr: number;
  offenseScore: number;
  defenseScore: number;
  compositionAnalysis: TeamCompositionAnalysis;
  rosterNames: string[];
  startingLineup: string[];
  baselineWins: number;
  baselineLosses: number;
  pointsPerGame: number;
  opponentPointsPerGame: number;
  source: '2024-25-baseline' | 'hardcoded-fallback';
  snapshotDate: string;
}

export interface LeagueStanding {
  rank: number;
  conferenceRank: number;
  teamId: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: 'East' | 'West';
  wins: number;
  losses: number;
  gspr: number;
  powerScore: number;
  isCustomTeam?: boolean;
  playoffStatus?: 'playoffs' | 'play-in' | 'lottery';
}

export interface PlayerSeasonStatLine {
  playerId: string;
  name: string;
  position: Position;
  slotLabel: string;
  playerScore: number;
  gamesPlayed: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
}

export interface SeasonResults {
  sport: Sport;
  wins: number;
  losses: number;
  totalGames: number;
  games: GameResult[];
  teamPower: TeamPower;
  compositionAnalysis: TeamCompositionAnalysis;
  isUndefeated: boolean;
  longestWinStreak: number;
  leagueStandings: LeagueStanding[];
  rosterStats: PlayerSeasonStatLine[];
  teamStrengthSnapshotDate: string;
  achievement: string;
  achievementSubtext: string;
  recordLabel: string;
  recordJustification?: string;
  recordFactors?: string[];
  explanationSource?: 'llm' | 'local';
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
