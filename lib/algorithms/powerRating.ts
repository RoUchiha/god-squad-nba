import type { Player, Sport, FilledRosterSlot, TeamPower, DraftMode } from '../types';
import { clamp } from '../utils';

// ─── Shared helper ────────────────────────────────────────────────────────────

// Parse start year from eraId like "nba-14-1995" → 1995
function eraYear(p: Player): number {
  if (!p.eraId) return 2000;
  const parts = p.eraId.split('-');
  return parseInt(parts[parts.length - 1]) || 2000;
}

// ─── NBA ──────────────────────────────────────────────────────────────────────
// Direct multiplicative formula — no position-adjusted baselines (those cause
// position-specific bias where a PG's assists get zero extra credit because
// "PGs are supposed to have high assists"). Every stat rewarded the same regardless
// of position, letting pool normalization produce the final 18–95 spread.
//
// True Shooting % approximation (we lack FGA/FTA, so we reconstruct from %s):
//   Non-3pt shooters (3P%=0): TS ≈ FG%×0.67 + FT%×0.33
//   3pt shooters:             TS ≈ FG%×0.55 + 3P%×0.25 + FT%×0.20
//   Volume scorers draw fouls → extra TS lift (+0.004 per PPG above 18)
// League-average TS% ≈ 0.54; efficiency-adjusted points = pts × (TS / 0.54)
//
// Weights calibrated so: Jordan/Curry/LeBron era → ~130–140 raw
//                        solid starter → ~60–90 raw
//                        bench player → ~15–30 raw

function scoreNBAPlayer(p: Player): number {
  const s   = p.stats;
  const pts = s.points        ?? 0;
  const reb = s.rebounds      ?? 0;
  const ast = s.assists       ?? 0;
  const stl = s.steals        ?? 0;
  const blk = s.blocks        ?? 0;
  const fg  = s.fieldGoalPct  ?? 0.44;
  const tp  = s.threePointPct ?? 0;
  const ft  = s.freeThrowPct  ?? 0.72;

  const ts = tp === 0
    ? fg * 0.67 + ft * 0.33
    : fg * 0.55 + tp * 0.25 + ft * 0.20;
  const tsAdj = ts + Math.max(0, pts - 18) * 0.004;

  const adjPts = pts * (tsAdj / 0.54);

  return clamp(
    adjPts * 2.5   // efficiency-adjusted scoring (primary)
    + ast  * 4.0   // each assist creates direct team value
    + stl  * 9.0   // steal = possession change + fast break opportunity
    + blk  * 4.5   // disrupts shot, may not change possession
    + reb  * 1.8,  // extends or ends possessions
    0, 300
  );
}

// ─── Calibration helper ───────────────────────────────────────────────────────
// Linear mapping: avgRaw → 60 (bell-curve center), goatRaw → 94 (before tier boost).
// Each sport's scoring function returns a raw value; this converts it to the
// 25–99 absolute scale so scores are the same on every page load.
function calibrate(raw: number, avgRaw: number, goatRaw: number): number {
  const slope = 34 / (goatRaw - avgRaw);
  return clamp(60 + (raw - avgRaw) * slope, 25, 99);
}

export function computePlayerScore(player: Player, _sport?: Sport): number {
  let base = calibrate(scoreNBAPlayer(player), 59, 145);

  const s = player.stats;
  const points = s.points ?? 0;
  const assists = s.assists ?? 0;
  const rebounds = s.rebounds ?? 0;
  const stocks = (s.steals ?? 0) + (s.blocks ?? 0);
  const eliteProduction =
    points >= 27 ||
    (points >= 22 && assists >= 7) ||
    (points >= 20 && rebounds >= 10) ||
    (points >= 18 && stocks >= 3.2);
  const starProduction =
    points >= 20 || assists >= 7.5 || rebounds >= 11 ||
    (points >= 15 && stocks >= 2.5);

  if (player.isLegend) {
    base = Math.max(base, eliteProduction ? 90 : starProduction ? 84 : 80);
    base = Math.min(99, base * 1.04);
  } else if (player.isAllStar) {
    base = Math.max(base, eliteProduction ? 88 : 80);
    base = Math.min(95, base * 1.02);
  } else {
    if (eliteProduction) base = Math.max(base, 86);
    else if (starProduction) base = Math.max(base, 79);
    base = Math.min(base, 86);
  }

  return Math.round(base * 10) / 10;
}

// ─── Team GSPR Calculation ────────────────────────────────────────────────────

const SPORT_WEIGHTS = {
  offense: 0.64,
  defense: 0.28,
  depth: 0.00,
};

function weightedAverage(scores: number[], weights?: number[]): number {
  if (scores.length === 0) return 0;
  if (!weights) return scores.reduce((a, b) => a + b, 0) / scores.length;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  return scores.reduce((acc, s, i) => acc + s * (weights[i] ?? 1), 0) / totalWeight;
}

function stat(player: Player, key: keyof Player['stats']): number {
  return player.stats[key] ?? 0;
}

function scoreNBAOffense(players: Player[]): number {
  if (players.length === 0) return 0;

  const topRotation = [...players]
    .sort((a, b) => b.playerScore - a.playerScore)
    .slice(0, 5);
  const topEndBase = weightedAverage(
    topRotation.map(p => p.playerScore),
    topRotation.map((_, i) => Math.max(0.85, 1.45 - i * 0.15))
  );

  const eliteScorers = players.filter(p => stat(p, 'points') >= 25 || p.playerScore >= 93).length;
  const eliteCreators = players.filter(p => stat(p, 'assists') >= 6).length;
  const eliteShooters = players.filter(p => stat(p, 'threePointPct') >= 0.38 && stat(p, 'points') >= 12).length;
  const topScore = Math.max(...players.map(p => p.playerScore));
  const weakestScore = Math.min(...players.map(p => p.playerScore));

  const fitBonus = Math.min(
    5.25,
    eliteScorers * 1.1 +
    eliteCreators * 1.0 +
    eliteShooters * 0.75 +
    (topScore >= 97 ? 0.9 : 0)
  );
  const weakLinkPenalty = players.length >= 6 ? Math.max(0, 82 - weakestScore) * 0.08 : 0;

  return clamp(topEndBase + fitBonus - weakLinkPenalty, 0, 100);
}

function scoreNBADefender(player: Player): number {
  const positionAnchor =
    player.position === 'C' ? 7 :
    player.position === 'PF' ? 4 :
    player.position === 'SF' ? 2 :
    0;
  const eventValue =
    stat(player, 'steals') * 9.5 +
    stat(player, 'blocks') * 8.5 +
    stat(player, 'rebounds') * 1.15;
  const profileFloor = player.isLegend ? 4 : player.isAllStar ? 2 : 0;

  return clamp(46 + eventValue + positionAnchor + profileFloor, 25, 100);
}

function scoreNBADefense(players: Player[]): number {
  if (players.length === 0) return 0;

  const defenders = [...players]
    .sort((a, b) => scoreNBADefender(b) - scoreNBADefender(a))
    .slice(0, 5);
  const base = weightedAverage(
    defenders.map(scoreNBADefender),
    defenders.map((_, i) => Math.max(0.85, 1.35 - i * 0.12))
  );
  const rimProtector = players.some(p => (p.position === 'C' || p.position === 'PF') && stat(p, 'blocks') >= 2);
  const perimeterPressure = players.filter(p => stat(p, 'steals') >= 1.5).length >= 2;
  const guardHeavyPenalty = players.filter(p => p.position === 'PG' || p.position === 'SG').length >= 4 ? 3 : 0;

  return clamp(base + (rimProtector ? 4 : 0) + (perimeterPressure ? 3 : 0) - guardHeavyPenalty, 0, 100);
}

// ─── Historic duo bonus ───────────────────────────────────────────────────────
const HISTORIC_DUOS: [string, string, number, string][] = [
  // NBA
  ['Michael Jordan',      'Scottie Pippen',      10, '🐐 Jordan & Pippen — Greatest Duo Ever'],
  ['Magic Johnson',       'Kareem Abdul-Jabbar',  9, '✨ Magic & Kareem — Showtime'],
  ["Shaquille O'Neal",    'Kobe Bryant',           8, '🔥 Shaq & Kobe — Three-Peat'],
  ['LeBron James',        'Dwyane Wade',           7, '👑 LeBron & Wade — Heat Big Three'],
  ['LeBron James',        'Anthony Davis',         7, '💪 LeBron & AD — Lake Show'],
  ['LeBron James',        'Kyrie Irving',          8, '🏆 LeBron & Kyrie — Cavs Champions'],
  ['Stephen Curry',       'Klay Thompson',         8, '🎯 Curry & Klay — Splash Brothers'],
  ['Stephen Curry',       'Draymond Green',        6, '🧠 Curry & Draymond — Warriors IQ'],
  ['Kevin Durant',        'Stephen Curry',         9, '⚡ KD & Curry — Unstoppable Force'],
  ['Larry Bird',          'Kevin McHale',          7, '☘️ Bird & McHale — Celtics Frontcourt'],
  ['Larry Bird',          'Robert Parish',         6, '☘️ Bird & Parish — Celtics Big Three'],
  ['Tim Duncan',          'Tony Parker',           7, '🪨 Duncan & Parker — Spurs Dynasty'],
  ['Tim Duncan',          'Manu Ginobili',         6, '🪨 Duncan & Ginobili — Spurs Big Three'],
  ['Tony Parker',         'Manu Ginobili',         6, '🇫🇷 Parker & Ginobili — International Flair'],
  ['Hakeem Olajuwon',     'Clyde Drexler',         7, '🚀 Hakeem & Clyde — Dream Team'],
  ['Isiah Thomas',        'Joe Dumars',            7, '😈 Isiah & Dumars — Bad Boys Backcourt'],
  ['Kevin Garnett',       'Paul Pierce',           7, '☘️ KG & Pierce — Boston Revived'],
  ['Kevin Garnett',       'Ray Allen',             6, '☘️ KG & Ray Allen — Banner 17'],
  ['Giannis Antetokounmpo','Khris Middleton',      7, '🦌 Giannis & Middleton — Bucks Champions'],
  ['Nikola Jokic',        'Jamal Murray',          7, '⛏️ Jokic & Murray — Mile High Magic'],
  ['Kawhi Leonard',       'Paul George',           7, '🦞 Kawhi & PG — Clippers Threat'],
  ['Karl Malone',         'John Stockton',         9, '📮 Malone & Stockton — Mailman Express'],
  ['Charles Barkley',     'Kevin Johnson',         6, '🌵 Barkley & KJ — Suns Machine'],
  ['Patrick Ewing',       'Charles Oakley',        5, '🗽 Ewing & Oakley — Knicks Bruisers'],
  // NFL
  ['Tom Brady',           'Rob Gronkowski',        9, '🏈 Brady & Gronk — Unstoppable'],
  ['Tom Brady',           'Randy Moss',            9, '🏈 Brady & Moss — Record Breakers'],
  ['Joe Montana',         'Jerry Rice',            10, '🐐 Montana & Rice — GOAT Connection'],
  ['Peyton Manning',      'Marvin Harrison',       8, '🏹 Manning & Harrison — Precision'],
  ['Peyton Manning',      'Reggie Wayne',          7, '🏹 Manning & Wayne — AFC Dominance'],
  ['Aaron Rodgers',       'Davante Adams',         7, '🎯 Rodgers & Adams — Fade Route Kings'],
  ['Aaron Rodgers',       'Jordy Nelson',          6, '💛 Rodgers & Jordy — Packer Magic'],
  ['Patrick Mahomes',     'Travis Kelce',          8, '⚡ Mahomes & Kelce — Dynasty Duo'],
  ['Troy Aikman',         'Michael Irvin',         7, '⭐ Aikman & Irvin — Cowboys WR'],
  ['Dan Marino',          'Mark Clayton',          6, '🌴 Marino & Clayton — Miami Air'],
  ['Lawrence Taylor',     'Carl Banks',            6, '😤 LT & Banks — Giants Defense'],
  ['Emmitt Smith',        'Michael Irvin',         6, '⭐ Smith & Irvin — Cowboys Offense'],
  ['Barry Sanders',       'Herman Moore',          6, '🦁 Sanders & Moore — Lions Magic'],
  ['Steve Young',         'Jerry Rice',            8, '🌉 Young & Rice — 49ers Reload'],
  ['John Elway',          'Shannon Sharpe',        6, '🏔️ Elway & Sharpe — Broncos Champions'],
  // MLB
  ['Babe Ruth',           'Lou Gehrig',            10, '⚾ Ruth & Gehrig — Murderers Row'],
  ['Mickey Mantle',       'Whitey Ford',           8, '⚾ Mantle & Ford — Yankee Dynasty'],
  ['Derek Jeter',         'Mariano Rivera',        9, '⚾ Jeter & Mo — Core Four'],
  ['Willie Mays',         'Willie McCovey',        7, '⚾ Mays & McCovey — Giants Power'],
  ['Hank Aaron',          'Eddie Mathews',         8, '⚾ Aaron & Mathews — Braves Thunder'],
  ['Greg Maddux',         'Tom Glavine',           8, '⚾ Maddux & Glavine — Braves Rotation'],
  ['Ken Griffey Jr.',     'Randy Johnson',         7, '⚾ Griffey & Big Unit — Seattle Legends'],
  ['Albert Pujols',       'Jim Edmonds',           6, '⚾ Pujols & Edmonds — Cards Machine'],
  ['Pedro Martinez',      'Manny Ramirez',         7, '⚾ Pedro & Manny — Sox World Series'],
  ['David Ortiz',         'Manny Ramirez',         7, '⚾ Ortiz & Manny — Boston Clutch'],
  // NHL
  ['Wayne Gretzky',       'Mark Messier',          10, '🏒 Gretzky & Messier — Oilers Dynasty'],
  ['Wayne Gretzky',       'Jari Kurri',             9, '🏒 Gretzky & Kurri — Scoring Machine'],
  ['Mario Lemieux',       'Jaromir Jagr',           9, '🏒 Lemieux & Jagr — Penguins Glory'],
  ['Sidney Crosby',       'Evgeni Malkin',          8, '🏒 Crosby & Malkin — Double Threat'],
  ['Sidney Crosby',       'Marc-Andre Fleury',      7, '🏒 Crosby & Fleury — Penguins Core'],
  ['Patrick Roy',         'Joe Sakic',              8, '🏒 Roy & Sakic — Avs Champions'],
  ['Steve Yzerman',       'Nicklas Lidstrom',       8, '🏒 Yzerman & Lidstrom — Wings Dynasty'],
  ['Bobby Orr',           'Phil Esposito',          9, '🏒 Orr & Esposito — Bruins Gold'],
  ['Gordie Howe',         'Alex Delvecchio',        7, '🏒 Howe & Delvecchio — Wings Classic'],
];

// ─── Historic rival pairings ──────────────────────────────────────────────────
const HISTORIC_RIVALS: [string, string, number, string][] = [
  // NBA
  ['Larry Bird',          'Magic Johnson',       5, '🔥 Bird vs Magic — Ultimate Rivals'],
  ['Larry Bird',          'Kareem Abdul-Jabbar', 4, '🔥 Bird vs Kareem — Old-School Clash'],
  ['Bill Russell',        'Wilt Chamberlain',    5, '🔥 Russell vs Wilt — Centers Rivalry'],
  ['Michael Jordan',      'Isiah Thomas',        4, '🔥 Jordan vs Isiah — Bad Boys vs Bull'],
  ['LeBron James',        'Kobe Bryant',         4, '🔥 LeBron vs Kobe — The Debate'],
  ['Stephen Curry',       'LeBron James',        4, '🔥 Curry vs LeBron — Finals Rivals'],
  // NFL
  ['Peyton Manning',      'Ray Lewis',           4, '🔥 Manning vs Lewis — Rivals'],
  ['Tom Brady',           'Peyton Manning',      5, '🔥 Brady vs Manning — AFC Legends'],
  ['Tom Brady',           'Aaron Rodgers',       4, '🔥 Brady vs Rodgers — QB Debate'],
  ['Jerry Rice',          'Deion Sanders',       4, '🔥 Rice vs Prime Time'],
  // MLB
  ['Babe Ruth',           'Ty Cobb',             4, '🔥 Ruth vs Cobb — Era Rivals'],
  ['Derek Jeter',         'Manny Ramirez',       4, '🔥 Jeter vs Manny — Sox/Yanks'],
  ['Pedro Martinez',      'Roger Clemens',       4, '🔥 Pedro vs Clemens — Ace Rivals'],
  // NHL
  ['Wayne Gretzky',       'Mario Lemieux',       5, '🔥 Gretzky vs Lemieux — GOAT Debate'],
  ['Patrick Roy',         'Chris Chelios',       4, '🔥 Roy vs Chelios — Classic Clash'],
  ['Sidney Crosby',       'Alex Ovechkin',       5, '🔥 Crosby vs Ovechkin — Modern Rivals'],
];

interface BonusResult { total: number; labels: string[] }

function duoAndRivalBonus(players: Player[]): BonusResult {
  const names = players.map(p => p.name);
  const labels: string[] = [];
  let duoBonus = 0;
  let bestLabel = '';
  for (const [a, b, pts, label] of HISTORIC_DUOS) {
    if (names.includes(a) && names.includes(b) && pts > duoBonus) {
      duoBonus = pts;
      bestLabel = label;
    }
  }
  if (duoBonus > 0) labels.push(bestLabel);

  let rivalBonus = 0;
  for (const [a, b, pts, label] of HISTORIC_RIVALS) {
    if (names.includes(a) && names.includes(b)) {
      rivalBonus += pts * 0.5;
      labels.push(label);
    }
  }
  return { total: duoBonus + rivalBonus, labels };
}

// ─── Era chemistry bonus ──────────────────────────────────────────────────────
function eraChemistryBonus(players: Player[]): BonusResult {
  const eraIds = players.map(p => p.eraId).filter((e): e is string => Boolean(e));
  if (eraIds.length < 3) return { total: 0, labels: [] };
  const unique = new Set(eraIds);
  if (unique.size === 1) return { total: 8, labels: ['🕰️ Era Synergy — Same-Era Perfection (+8)'] };
  if (unique.size === 2) return { total: 3, labels: ['🕰️ Era Blend — Cross-Era Chemistry (+3)'] };
  return { total: 0, labels: [] };
}

// ─── Team chemistry bonus ─────────────────────────────────────────────────────
function teamChemistryBonus(players: Player[]): BonusResult {
  const teamIds = players.map(p => p.teamId).filter((t): t is string => Boolean(t));
  if (teamIds.length < 2) return { total: 0, labels: [] };
  const counts: Record<string, number> = {};
  for (const t of teamIds) counts[t] = (counts[t] ?? 0) + 1;
  const max = Math.max(...Object.values(counts));
  if (max >= 5) return { total: 10, labels: ['🤝 Dynasty Core — 5+ Teammates (+10)'] };
  if (max >= 3) return { total: 5,  labels: ['🤝 Familiar Faces — 3+ Teammates (+5)'] };
  if (max >= 2) return { total: 2,  labels: ['🤝 Familiar Faces — 2 Teammates (+2)'] };
  return { total: 0, labels: [] };
}

// ─── Physical composition bonus ───────────────────────────────────────────────
function physicalBonus(players: Player[]): BonusResult {

  const heightMap: Record<string, number> = { C: 84, PF: 81, SF: 79, SG: 76, PG: 73 };
  const heights = players.map(p => heightMap[p.position] ?? 77);
  const avgHeight = heights.reduce((a, b) => a + b, 0) / heights.length;

  const centers = players.filter(p => p.position === 'C').length;
  const bigs    = players.filter(p => p.position === 'C' || p.position === 'PF').length;

  const labels: string[] = [];
  let bonus = 0;
  if (centers >= 2) { bonus += 8; labels.push('🏗️ Twin Towers — Dominant Inside (+8)'); }
  else if (bigs >= 3) { bonus += 5; labels.push('💪 Big Lineup — Frontcourt Dominance (+5)'); }
  if (avgHeight >= 80) { bonus += 3; labels.push('📏 Tall Team — Height Advantage (+3)'); }
  return { total: bonus, labels };
}

// ─── Sport-specific stat combo bonuses ───────────────────────────────────────

// ─── Stat-based combo bonuses ─────────────────────────────────────────────────
function statComboBonus(players: Player[]): BonusResult {

  const labels: string[] = [];
  let bonus = 0;

  // Alley-oop engine: a high-assist PG paired with a high-athleticism dunker (SG/SF with high blocks/pts)
  const passers = players.filter(p => p.position === 'PG' && (p.stats.assists ?? 0) >= 8);
  const dunkers = players.filter(p =>
    (p.position === 'SG' || p.position === 'SF' || p.position === 'PF') &&
    (p.stats.points ?? 0) >= 20 && (p.stats.blocks ?? 0) >= 0.8
  );
  if (passers.length > 0 && dunkers.length > 0) {
    bonus += 8;
    labels.push(`🔛 Alley-Oop Factory — ${passers[0].name} feeds ${dunkers[0].name} (+8)`);
  }

  // Deadeye shooter + facilitator: 3pt% > 0.40 shooter + assists > 8 player
  const snipers = players.filter(p => (p.stats.threePointPct ?? 0) >= 0.40 && (p.stats.points ?? 0) >= 15);
  const facilitators = players.filter(p => (p.stats.assists ?? 0) >= 8 && p !== (passers[0] ?? null));
  if (snipers.length >= 2 && facilitators.length > 0) {
    bonus += 7;
    labels.push(`🎯 Deadeye Arsenal — ${snipers[0].name} & ${snipers[1].name} off assists (+7)`);
  } else if (snipers.length >= 2) {
    bonus += 5;
    labels.push(`🎯 Sniper Duo — ${snipers[0].name} & ${snipers[1].name} shoot lights out (+5)`);
  }

  // Rim protector + scorer: C/PF with blocks >= 2 + SG/SF with pts >= 22
  const rimProtectors = players.filter(p =>
    (p.position === 'C' || p.position === 'PF') && (p.stats.blocks ?? 0) >= 2
  );
  const eliteScorers = players.filter(p =>
    (p.position === 'SG' || p.position === 'SF' || p.position === 'PG') && (p.stats.points ?? 0) >= 22
  );
  if (rimProtectors.length > 0 && eliteScorers.length > 0) {
    bonus += 7;
    labels.push(`🛡️ Defend & Attack — ${rimProtectors[0].name} protects, ${eliteScorers[0].name} scores (+7)`);
  }

  // Inside-outside: dominant big (pts >= 20, reb >= 10) + perimeter threat (3pt% >= 0.38, pts >= 15)
  const dominantBigs = players.filter(p =>
    (p.position === 'C' || p.position === 'PF') &&
    (p.stats.points ?? 0) >= 20 && (p.stats.rebounds ?? 0) >= 10
  );
  const perimeterThreats = players.filter(p =>
    (p.position === 'PG' || p.position === 'SG' || p.position === 'SF') &&
    (p.stats.threePointPct ?? 0) >= 0.38 && (p.stats.points ?? 0) >= 15
  );
  if (dominantBigs.length > 0 && perimeterThreats.length > 0) {
    bonus += 6;
    labels.push(`⚖️ Inside-Outside — ${dominantBigs[0].name} in the post, ${perimeterThreats[0].name} from deep (+6)`);
  }

  // Triple-double threat: player with pts >= 20, reb >= 8, ast >= 7
  const tripleDoubleThreats = players.filter(p =>
    (p.stats.points ?? 0) >= 20 &&
    (p.stats.rebounds ?? 0) >= 8 &&
    (p.stats.assists ?? 0) >= 7
  );
  if (tripleDoubleThreats.length >= 2) {
    bonus += 10;
    labels.push(`🌟 Double Triple-Double Threat — ${tripleDoubleThreats[0].name} & ${tripleDoubleThreats[1].name} (+10)`);
  } else if (tripleDoubleThreats.length === 1) {
    bonus += 5;
    labels.push(`🌟 Triple-Double Threat — ${tripleDoubleThreats[0].name} does it all (+5)`);
  }

  return { total: bonus, labels };
}

export function computeTeamGSPR(
  slots: FilledRosterSlot[],
  sport: Sport,
  mode: DraftMode
): TeamPower {
  const filled = slots.filter(s => s.player !== null);
  const players = filled.map(s => s.player as Player);

  if (players.length === 0) {
    return { gspr: 0, offenseScore: 0, defenseScore: 0, depthScore: 0, chemistryBonus: 0, tier: 'average', breakdown: [] };
  }

  const offenseScore = scoreNBAOffense(players);
  const defenseScore = scoreNBADefense(players);

  const depthScore = 0;

  const duoRival   = duoAndRivalBonus(players);
  const eraChem    = eraChemistryBonus(players);
  const teamChem   = teamChemistryBonus(players);
  const physical   = physicalBonus(players);
  const statCombo  = statComboBonus(players);
  const totalBonus = duoRival.total + eraChem.total + teamChem.total + physical.total + statCombo.total;
  const topFive = [...players].sort((a, b) => b.playerScore - a.playerScore).slice(0, 5);
  const starCore = weightedAverage(topFive.map(player => player.playerScore));
  const starPower = Math.max(0, starCore - 80) * 0.35;
  const twoWayBalance = Math.min(offenseScore, defenseScore) >= 90 ? 2.5 : 0;

  const w = SPORT_WEIGHTS;
  const raw = (
    offenseScore * w.offense +
    defenseScore * w.defense +
    depthScore * w.depth +
    totalBonus * 0.32 +
    starPower +
    twoWayBalance
  );

  // Scale to 0–1000
  const rosterCompletion = clamp(players.length / 6, 0, 1);
  const gspr = Math.round(clamp(raw * 10 * rosterCompletion, 0, 1000));

  const tier = gspr >= 950 ? 'god'
    : gspr >= 850 ? 'legendary'
    : gspr >= 700 ? 'great'
    : gspr >= 500 ? 'good'
    : 'average';

  const breakdownParts: string[] = [
    `📊 Offense: ${Math.round(offenseScore)}/100`,
    `Defense: ${Math.round(defenseScore)}/100`,
    `Star power: ${Math.round(starCore)}/100`,
    `Roster completion: ${players.length}/6`,
    ...duoRival.labels,
    ...eraChem.labels,
    ...teamChem.labels,
    ...physical.labels,
    ...statCombo.labels,
  ];

  return { gspr, offenseScore, defenseScore, depthScore, chemistryBonus: totalBonus, tier, breakdown: breakdownParts };
}
