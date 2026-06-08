import type { Era, HistoricalTeam, RosterSlotTemplate } from './types';

// ─── Sport Config (NBA only) ─────────────────────────────────────────────────

export const SPORT_CONFIG = {
  label: 'NBA',
  emoji: '🏀',
  primaryColor: '#F26522',
  accentColor: '#FDB927',
  bgColor: '#1a0f00',
  gamesInSeason: 82,
  tagline: 'Can your squad go 82-0?',
} as const;

// ─── Roster Template ─────────────────────────────────────────────────────────
//   PG · SG · SF · PF · C · 6th Man (flex)

export const NBA_ROSTER: RosterSlotTemplate[] = [
  { id: 'pg',   position: 'PG',                        label: 'Point Guard',    group: 'offense', required: true },
  { id: 'sg',   position: 'SG',                        label: 'Shooting Guard', group: 'offense', required: true },
  { id: 'sf',   position: 'SF',                        label: 'Small Forward',  group: 'offense', required: true },
  { id: 'pf',   position: 'PF',                        label: 'Power Forward',  group: 'offense', required: true },
  { id: 'c',    position: 'C',                         label: 'Center',         group: 'offense', required: true },
  { id: '6man', position: ['PG','SG','SF','PF','C'],   label: '6th Man',        group: 'offense', required: true },
];

// ─── GSPR Tiers ───────────────────────────────────────────────────────────────

export const GSPR_TIERS = [
  { min: 950, label: 'GOD SQUAD', color: '#ff4444', glow: 'rgba(255,68,68,0.5)' },
  { min: 850, label: 'LEGENDARY', color: '#ffd700', glow: 'rgba(255,215,0,0.4)' },
  { min: 700, label: 'GREAT',     color: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
  { min: 500, label: 'GOOD',      color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
  { min: 0,   label: 'AVERAGE',   color: '#6b7280', glow: 'rgba(107,114,128,0.2)' },
];

export function getGsprTier(gspr: number) {
  return GSPR_TIERS.find(t => gspr >= t.min) ?? GSPR_TIERS[GSPR_TIERS.length - 1];
}

// ─── Era generation ───────────────────────────────────────────────────────────

const NBA_ERA_START = 1970;

const TEAM_FOUNDED: Partial<Record<string, number>> = {
  'nba-4':  1988,  // Charlotte
  'nba-7':  1980,  // Dallas
  'nba-15': 1995,  // Toronto
  'nba-16': 1988,  // Miami
  'nba-18': 1989,  // Orlando
  'nba-19': 2002,  // New Orleans
  'nba-22': 1989,  // Minnesota
  'nba-28': 1995,  // Toronto (was set, keep)
  'nba-30': 1995,  // Oklahoma (was SEA)
};

const ERA_DATA: Record<string, { name: string; description: string }> = {
  'nba-14-1980': { name: 'Showtime I',       description: "Magic Johnson's no-look passes ignite Showtime; two titles in five years with Kareem" },
  'nba-14-1985': { name: 'Showtime II',      description: "Back-to-back titles cap the Showtime era; Kareem and Magic are unstoppable together" },
  'nba-14-1999': { name: 'Shaq & Kobe',      description: "Shaquille O'Neal and Kobe Bryant rip off three straight championships" },
  'nba-14-2009': { name: "Kobe's Rings",     description: "Kobe Bryant wins two titles without Shaq, silencing every doubter" },
  'nba-14-2019': { name: "LeBron's Lakers",  description: "LeBron James brings a title back to Los Angeles in a bubble championship" },
  'nba-2-1980':  { name: 'Bird Era',         description: "Larry Bird, Kevin McHale, and Robert Parish deliver three championships" },
  'nba-2-2007':  { name: 'Big Three Revival',description: "Paul Pierce, Kevin Garnett, and Ray Allen assemble to end the drought" },
  'nba-2-2020':  { name: 'Tatum & Brown',    description: "Jayson Tatum and Jaylen Brown build toward the franchise's 18th banner" },
  'nba-5-1990':  { name: 'First Three-Peat', description: "Michael Jordan and Scottie Pippen win three straight titles with the Triangle Offense" },
  'nba-5-1995':  { name: 'Second Three-Peat',description: "Jordan returns, Rodman joins, and Chicago wins three more rings" },
  'nba-27-2000': { name: "Duncan's Dynasty", description: "Tim Duncan and David Robinson win the title in Robinson's farewell season" },
  'nba-27-2004': { name: "Popovich's Best",  description: "Parker, Ginobili, and Duncan at their peak win two more rings" },
  'nba-16-2005': { name: 'D-Wade & Shaq',    description: "Dwyane Wade and Shaquille O'Neal deliver Miami's first NBA title" },
  'nba-16-2010': { name: "LeBron's Decision",description: "The Big Three — LeBron, Wade, and Bosh — win back-to-back championships" },
  'nba-10-2014': { name: 'Splash Brothers',  description: "Curry and Thompson light up the league; record 73-win season and three rings in four years" },
  'nba-10-2019': { name: 'Durant Era',       description: "Kevin Durant joins the dynasty; back-to-back before Klay injury ends the run" },
  'nba-9-1988':  { name: 'Bad Boys',         description: "Isiah Thomas, Bill Laimbeer, and the Bad Boys rough up the league; two championships" },
  'nba-9-2003':  { name: "Goin' to Work",    description: "Chauncey Billups leads a teamwork masterclass to a shocking 2004 championship" },
  'nba-23-1982': { name: 'Dr. J & Moses',    description: "Moses Malone joins Dr. J and declares 'Fo, Fo, Fo'; delivers the title in dominant fashion" },
  'nba-11-1993': { name: "Hakeem's Rockets", description: "Hakeem Olajuwon's Dream Shake destroys defenses; back-to-back titles" },
  'nba-24-2004': { name: 'Seven Seconds',    description: "Steve Nash's two MVPs power the most exciting offense in basketball" },
  'nba-29-1995': { name: 'Stockton & Malone',description: "The pick-and-roll duo reaches back-to-back Finals; the best team never to win it" },
  'nba-6-2015':  { name: 'LeBron Comes Home',description: "LeBron returns to Cleveland and delivers the city's first major title in 52 years" },
  'nba-17-2018': { name: 'Greek Freak',      description: "Giannis Antetokounmpo wins two MVPs and a title in an all-time Bucks revival" },
  'nba-28-2018': { name: 'We The North',     description: "Kawhi Leonard's iconic shot and Finals MVP give Canada its only NBA championship" },
  'nba-8-2019':  { name: 'Jokic Era',        description: "Nikola Jokic wins three MVPs and leads Denver to its first championship" },
  'nba-25-1989': { name: "Drexler's Era",    description: "Clyde the Glide leads Portland to two Finals appearances" },
  'nba-20-1991': { name: "Ewing's Knicks",   description: "Patrick Ewing and Riley's defensive Knicks reach the Finals; New York's last great team" },
};

export function generateTeamEras(team: HistoricalTeam): Era[] {
  const founded = TEAM_FOUNDED[`nba-${team.id}`] ?? NBA_ERA_START;
  const firstEraStart = Math.max(NBA_ERA_START, Math.floor(founded / 5) * 5);
  const eras: Era[] = [];

  for (let start = firstEraStart; start <= 2025; start += 5) {
    const id = `nba-${team.id}-${start}`;
    const custom = ERA_DATA[id];
    eras.push({
      id,
      teamId: team.id,
      sport: 'nba',
      startYear: start,
      endYear: start + 4,
      name: custom?.name ?? `${start}–${start + 4}`,
      description: custom?.description ?? `${team.city} ${team.name} — ${start}–${start + 4}`,
    });
  }

  return eras;
}
