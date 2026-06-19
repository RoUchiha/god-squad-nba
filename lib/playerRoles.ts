import type { Player, Position } from './types';

const ROLE_OVERRIDES: Record<string, Position[]> = {
  'stephen curry': ['PG', 'SG'],
  'klay thompson': ['SG', 'SF'],
  'draymond green': ['PF', 'C', 'SF'],
  'andrew wiggins': ['SF', 'SG'],
  'jordan poole': ['SG', 'PG'],
  'gary payton ii': ['SG', 'PG'],
  'chris paul': ['PG'],
  'brandin podziemski': ['SG', 'PG'],
  'moses moody': ['SG', 'SF'],
  'jonathan kuminga': ['PF', 'SF'],
  'otto porter jr': ['SF', 'PF'],
  'andre iguodala': ['SF', 'SG'],
  'shaun livingston': ['PG', 'SG'],
  'lebron james': ['SF', 'PF', 'PG'],
  'magic johnson': ['PG', 'SG', 'SF'],
  'michael jordan': ['SG', 'SF'],
  'scottie pippen': ['SF', 'SG', 'PF'],
  'kobe bryant': ['SG', 'SF'],
  'dwyane wade': ['SG', 'PG'],
  'james harden': ['SG', 'PG'],
  'luka doncic': ['PG', 'SG', 'SF'],
  'jimmy butler': ['SF', 'SG'],
  'paul george': ['SF', 'SG'],
  'kawhi leonard': ['SF', 'SG', 'PF'],
  'kevin durant': ['SF', 'PF'],
  'larry bird': ['SF', 'PF'],
  'nikola jokic': ['C', 'PF'],
  'giannis antetokounmpo': ['PF', 'C', 'SF'],
  'anthony davis': ['PF', 'C'],
  'tim duncan': ['PF', 'C'],
  'kevin garnett': ['PF', 'C'],
  'kevin love': ['PF', 'C'],
  'chris bosh': ['PF', 'C'],
};

function key(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019'.]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function addRole(roles: Position[], position: Position) {
  if (!roles.includes(position)) roles.push(position);
}

export function playerEligiblePositions(player: Player): Position[] {
  const override = ROLE_OVERRIDES[key(player.name)];
  if (override) return override;

  const roles: Position[] = [player.position];
  const s = player.stats;
  const assists = s.assists ?? 0;
  const rebounds = s.rebounds ?? 0;
  const blocks = s.blocks ?? 0;
  const three = s.threePointPct ?? 0;
  const steals = s.steals ?? 0;

  if (player.position === 'PG') {
    if (three >= 0.35 || (s.points ?? 0) >= 15) addRole(roles, 'SG');
  }

  if (player.position === 'SG') {
    if (assists >= 3.5) addRole(roles, 'PG');
    if (rebounds >= 3.5 || blocks >= 0.4) addRole(roles, 'SF');
  }

  if (player.position === 'SF') {
    if (three >= 0.35 || assists >= 3 || steals >= 1.2) addRole(roles, 'SG');
    if (rebounds >= 5.5 || blocks >= 0.6) addRole(roles, 'PF');
  }

  if (player.position === 'PF') {
    if (three >= 0.34 || assists >= 3 || steals >= 1.1) addRole(roles, 'SF');
    if (rebounds >= 8.5 || blocks >= 1.0) addRole(roles, 'C');
  }

  if (player.position === 'C') {
    if (three >= 0.32 || assists >= 3 || rebounds < 8) addRole(roles, 'PF');
  }

  return roles;
}

export function playerRoleLabel(player: Player): string {
  return playerEligiblePositions(player).join('/');
}
