import type { HistoricalTeam, NBATeamStrength } from './types';
import { clamp } from './utils';

export const NBA_BASELINE_SEASON = '2024-25';
export const NBA_BASELINE_DATE = '2025-04-13';

type Conference = 'East' | 'West';

interface LastSeasonTeamData {
  conference: Conference;
  division: string;
  wins: number;
  losses: number;
  ppg: number;
  oppg: number;
  lineup: [string, string, string, string, string];
}

// ESPN 2024-25 regular-season records and scoring; lineups represent each
// team's most recognizable healthy closing/start group from that season.
const LAST_SEASON: Record<string, LastSeasonTeamData> = {
  ATL: { conference: 'East', division: 'Southeast', wins: 40, losses: 42, ppg: 118.2, oppg: 119.3, lineup: ['Trae Young', 'Dyson Daniels', 'Zaccharie Risacher', 'Jalen Johnson', 'Onyeka Okongwu'] },
  BOS: { conference: 'East', division: 'Atlantic', wins: 61, losses: 21, ppg: 116.3, oppg: 107.2, lineup: ['Jrue Holiday', 'Derrick White', 'Jaylen Brown', 'Jayson Tatum', 'Kristaps Porzingis'] },
  BKN: { conference: 'East', division: 'Atlantic', wins: 26, losses: 56, ppg: 105.1, oppg: 112.2, lineup: ["D'Angelo Russell", 'Cam Thomas', 'Ziaire Williams', 'Cameron Johnson', 'Nic Claxton'] },
  CHA: { conference: 'East', division: 'Southeast', wins: 19, losses: 63, ppg: 105.1, oppg: 114.2, lineup: ['LaMelo Ball', 'Josh Green', 'Brandon Miller', 'Miles Bridges', 'Mark Williams'] },
  CHI: { conference: 'East', division: 'Central', wins: 39, losses: 43, ppg: 117.8, oppg: 119.4, lineup: ['Josh Giddey', 'Coby White', 'Kevin Huerter', 'Matas Buzelis', 'Nikola Vucevic'] },
  CLE: { conference: 'East', division: 'Central', wins: 64, losses: 18, ppg: 121.9, oppg: 112.4, lineup: ['Darius Garland', 'Donovan Mitchell', 'Max Strus', 'Evan Mobley', 'Jarrett Allen'] },
  DAL: { conference: 'West', division: 'Southwest', wins: 39, losses: 43, ppg: 114.2, oppg: 115.4, lineup: ['Kyrie Irving', 'Klay Thompson', 'P.J. Washington', 'Anthony Davis', 'Dereck Lively II'] },
  DEN: { conference: 'West', division: 'Northwest', wins: 50, losses: 32, ppg: 120.8, oppg: 116.9, lineup: ['Jamal Murray', 'Christian Braun', 'Michael Porter Jr.', 'Aaron Gordon', 'Nikola Jokic'] },
  DET: { conference: 'East', division: 'Central', wins: 44, losses: 38, ppg: 115.5, oppg: 113.6, lineup: ['Cade Cunningham', 'Malik Beasley', 'Ausar Thompson', 'Tobias Harris', 'Jalen Duren'] },
  GSW: { conference: 'West', division: 'Pacific', wins: 48, losses: 34, ppg: 113.8, oppg: 110.5, lineup: ['Stephen Curry', 'Brandin Podziemski', 'Jimmy Butler', 'Draymond Green', 'Kevon Looney'] },
  HOU: { conference: 'West', division: 'Southwest', wins: 52, losses: 30, ppg: 114.3, oppg: 109.8, lineup: ['Fred VanVleet', 'Jalen Green', 'Dillon Brooks', 'Jabari Smith Jr.', 'Alperen Sengun'] },
  IND: { conference: 'East', division: 'Central', wins: 50, losses: 32, ppg: 117.4, oppg: 115.1, lineup: ['Tyrese Haliburton', 'Andrew Nembhard', 'Aaron Nesmith', 'Pascal Siakam', 'Myles Turner'] },
  LAC: { conference: 'West', division: 'Pacific', wins: 50, losses: 32, ppg: 112.9, oppg: 108.2, lineup: ['James Harden', 'Norman Powell', 'Kawhi Leonard', 'Derrick Jones Jr.', 'Ivica Zubac'] },
  LAL: { conference: 'West', division: 'Pacific', wins: 50, losses: 32, ppg: 113.4, oppg: 112.2, lineup: ['Luka Doncic', 'Austin Reaves', 'Rui Hachimura', 'LeBron James', 'Jaxson Hayes'] },
  MEM: { conference: 'West', division: 'Southwest', wins: 48, losses: 34, ppg: 121.7, oppg: 116.9, lineup: ['Ja Morant', 'Desmond Bane', 'Jaylen Wells', 'Jaren Jackson Jr.', 'Zach Edey'] },
  MIA: { conference: 'East', division: 'Southeast', wins: 37, losses: 45, ppg: 110.6, oppg: 110.0, lineup: ['Tyler Herro', 'Duncan Robinson', 'Andrew Wiggins', 'Bam Adebayo', "Kel'el Ware"] },
  MIL: { conference: 'East', division: 'Central', wins: 48, losses: 34, ppg: 115.5, oppg: 113.0, lineup: ['Damian Lillard', 'Gary Trent Jr.', 'Taurean Prince', 'Giannis Antetokounmpo', 'Brook Lopez'] },
  MIN: { conference: 'West', division: 'Northwest', wins: 49, losses: 33, ppg: 114.3, oppg: 109.3, lineup: ['Mike Conley', 'Anthony Edwards', 'Jaden McDaniels', 'Julius Randle', 'Rudy Gobert'] },
  NOP: { conference: 'West', division: 'Southwest', wins: 21, losses: 61, ppg: 109.8, oppg: 119.3, lineup: ['Dejounte Murray', 'CJ McCollum', 'Trey Murphy III', 'Zion Williamson', 'Yves Missi'] },
  NYK: { conference: 'East', division: 'Atlantic', wins: 51, losses: 31, ppg: 115.8, oppg: 111.7, lineup: ['Jalen Brunson', 'Mikal Bridges', 'Josh Hart', 'OG Anunoby', 'Karl-Anthony Towns'] },
  OKC: { conference: 'West', division: 'Northwest', wins: 68, losses: 14, ppg: 120.5, oppg: 107.6, lineup: ['Shai Gilgeous-Alexander', 'Luguentz Dort', 'Jalen Williams', 'Chet Holmgren', 'Isaiah Hartenstein'] },
  ORL: { conference: 'East', division: 'Southeast', wins: 41, losses: 41, ppg: 105.4, oppg: 105.5, lineup: ['Jalen Suggs', 'Kentavious Caldwell-Pope', 'Franz Wagner', 'Paolo Banchero', 'Wendell Carter Jr.'] },
  PHI: { conference: 'East', division: 'Atlantic', wins: 24, losses: 58, ppg: 109.6, oppg: 115.8, lineup: ['Tyrese Maxey', 'Kelly Oubre Jr.', 'Paul George', 'Guerschon Yabusele', 'Joel Embiid'] },
  PHX: { conference: 'West', division: 'Pacific', wins: 36, losses: 46, ppg: 113.6, oppg: 116.6, lineup: ['Tyus Jones', 'Devin Booker', 'Bradley Beal', 'Kevin Durant', 'Nick Richards'] },
  POR: { conference: 'West', division: 'Northwest', wins: 36, losses: 46, ppg: 110.9, oppg: 113.9, lineup: ['Scoot Henderson', 'Shaedon Sharpe', 'Toumani Camara', 'Jerami Grant', 'Donovan Clingan'] },
  SAC: { conference: 'West', division: 'Pacific', wins: 40, losses: 42, ppg: 115.7, oppg: 115.3, lineup: ['Malik Monk', 'Zach LaVine', 'DeMar DeRozan', 'Keegan Murray', 'Domantas Sabonis'] },
  SAS: { conference: 'West', division: 'Southwest', wins: 34, losses: 48, ppg: 113.9, oppg: 116.7, lineup: ["De'Aaron Fox", 'Stephon Castle', 'Devin Vassell', 'Harrison Barnes', 'Victor Wembanyama'] },
  TOR: { conference: 'East', division: 'Atlantic', wins: 30, losses: 52, ppg: 110.9, oppg: 115.2, lineup: ['Immanuel Quickley', 'Gradey Dick', 'RJ Barrett', 'Scottie Barnes', 'Jakob Poeltl'] },
  UTA: { conference: 'West', division: 'Northwest', wins: 17, losses: 65, ppg: 111.9, oppg: 121.2, lineup: ['Isaiah Collier', 'Collin Sexton', 'Lauri Markkanen', 'John Collins', 'Walker Kessler'] },
  WAS: { conference: 'East', division: 'Southeast', wins: 18, losses: 64, ppg: 108.0, oppg: 120.4, lineup: ['Jordan Poole', 'Bub Carrington', 'Bilal Coulibaly', 'Khris Middleton', 'Alex Sarr'] },
};

const ESPN_LOGO_SLUG: Record<string, string> = {
  GSW: 'gs', NOP: 'no', NYK: 'ny', SAS: 'sa', UTA: 'utah', WAS: 'wsh',
};

export function nbaTeamLogoUrl(abbreviation: string): string {
  const slug = ESPN_LOGO_SLUG[abbreviation] ?? abbreviation.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/nba/500/${slug}.png`;
}

function teamRatings(data: LastSeasonTeamData) {
  const winPct = data.wins / 82;
  const differential = data.ppg - data.oppg;
  const offenseScore = clamp(58 + (data.ppg - 104) * 1.55 + winPct * 10, 55, 96);
  const defenseScore = clamp(58 + (121 - data.oppg) * 1.62 + winPct * 9, 55, 96);
  const gspr = Math.round(clamp(650 + winPct * 250 + differential * 4.5, 600, 925));
  return { gspr, offenseScore, defenseScore };
}

export function buildLastSeasonStrength(team: HistoricalTeam): NBATeamStrength {
  const data = LAST_SEASON[team.abbreviation];
  if (!data) throw new Error(`Missing ${NBA_BASELINE_SEASON} data for ${team.abbreviation}`);
  const ratings = teamRatings(data);
  const differential = data.ppg - data.oppg;

  return {
    teamId: team.id,
    name: team.name,
    city: team.city,
    abbreviation: team.abbreviation,
    conference: data.conference,
    division: data.division,
    ...ratings,
    compositionAnalysis: {
      pros: [
        differential >= 3
          ? `${team.city} carried a strong two-way scoring margin in ${NBA_BASELINE_SEASON}.`
          : `${team.city}'s core lineup is modeled from its ${NBA_BASELINE_SEASON} rotation.`,
      ],
      cons: [
        differential < 0
          ? `The ${NBA_BASELINE_SEASON} team was outscored across the regular season.`
          : `The simulation preserves normal game-to-game variance around last season's baseline.`,
      ],
    },
    rosterNames: [...data.lineup],
    startingLineup: [...data.lineup],
    baselineWins: data.wins,
    baselineLosses: data.losses,
    pointsPerGame: data.ppg,
    opponentPointsPerGame: data.oppg,
    source: '2024-25-baseline',
    snapshotDate: NBA_BASELINE_DATE,
  };
}
