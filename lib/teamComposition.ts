import type { FilledRosterSlot, Player, TeamCompositionAnalysis } from './types';
import { playersWithEffectiveScores } from './effectivePlayerScore';
import { playerEligiblePositions } from './playerRoles';

interface Read {
  score: number;
  text: string;
}

function stat(player: Player, key: keyof Player['stats']): number {
  return player.stats[key] ?? 0;
}

function names(players: Player[], limit = 2): string {
  const selected = players.slice(0, limit).map(player => player.name);
  if (selected.length <= 2) return selected.join(' and ');
  return `${selected.slice(0, -1).join(', ')}, and ${selected.at(-1)}`;
}

function choose(reads: Read[], count = 3): string[] {
  const seen = new Set<string>();
  return reads
    .sort((a, b) => b.score - a.score)
    .filter(read => {
      const key = read.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, count)
    .map(read => read.text);
}

export function analyzeTeamComposition(slots: FilledRosterSlot[]): TeamCompositionAnalysis {
  const players = playersWithEffectiveScores(slots);
  if (players.length === 0) {
    return {
      pros: ['Draft a player to establish the lineup identity.'],
      cons: ['The lineup has no playable five yet.'],
    };
  }

  const ranked = [...players].sort((a, b) => b.playerScore - a.playerScore);
  const scorers = [...players].sort((a, b) => stat(b, 'points') - stat(a, 'points'));
  const creators = [...players].sort((a, b) => stat(b, 'assists') - stat(a, 'assists'));
  const shooters = players
    .filter(player => stat(player, 'threePointPct') >= 0.36 && stat(player, 'points') >= 10)
    .sort((a, b) => stat(b, 'threePointPct') - stat(a, 'threePointPct'));
  const paintBound = players.filter(player =>
    stat(player, 'threePointPct') < 0.30 && stat(player, 'points') >= 10
  );
  const rimProtectors = [...players].sort((a, b) =>
    (stat(b, 'blocks') * 2 + stat(b, 'rebounds') * 0.25) -
    (stat(a, 'blocks') * 2 + stat(a, 'rebounds') * 0.25)
  );
  const pointOfAttack = [...players].sort((a, b) => stat(b, 'steals') - stat(a, 'steals'));
  const rebounders = [...players].sort((a, b) => stat(b, 'rebounds') - stat(a, 'rebounds'));
  const stars = players.filter(player => player.isLegend || player.isAllStar || player.playerScore >= 86);
  const primaryOptions = players.filter(player => stat(player, 'points') >= 22);
  const versatile = players
    .map(player => ({ player, roles: playerEligiblePositions(player) }))
    .filter(item => item.roles.length >= 2)
    .sort((a, b) => b.roles.length - a.roles.length);
  const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
  const averageScore = average(players.map(player => player.playerScore));
  const teamAssists = players.reduce((sum, player) => sum + stat(player, 'assists'), 0);
  const teamRebounds = players.reduce((sum, player) => sum + stat(player, 'rebounds'), 0);
  const teamStocks = players.reduce((sum, player) => sum + stat(player, 'steals') + stat(player, 'blocks'), 0);

  const pros: Read[] = [{
    score: averageScore + stars.length * 8,
    text: `${names(ranked)} ${ranked.length > 1 ? 'give' : 'gives'} this group real top-end shotmaking without asking a role player to carry the offense.`,
  }];

  if (creators[0] && stat(creators[0], 'assists') >= 6) {
    pros.push({
      score: 75 + teamAssists,
      text: `${creators[0].name} can organize the first action, and the lineup has enough secondary passing to attack the rotation after the defense shifts.`,
    });
  }
  if (shooters.length >= 2) {
    pros.push({
      score: 82 + shooters.length * 5,
      text: `${names(shooters)} keeps both corners honest, opening cleaner driving and post-up lanes for the primary creators.`,
    });
  }
  if (rimProtectors[0] && (stat(rimProtectors[0], 'blocks') >= 1.3 || stat(rimProtectors[0], 'rebounds') >= 10)) {
    pros.push({
      score: 78 + stat(rimProtectors[0], 'blocks') * 5,
      text: `${rimProtectors[0].name} gives the defense a back-line anchor, so perimeter defenders can pressure the ball without exposing the rim.`,
    });
  }
  if (pointOfAttack[0] && stat(pointOfAttack[0], 'steals') >= 1.5) {
    pros.push({
      score: 72 + teamStocks * 2,
      text: `${pointOfAttack[0].name} supplies point-of-attack disruption that can turn stops into early offense before the defense gets set.`,
    });
  }
  if (versatile.length >= 2) {
    pros.push({
      score: 80 + versatile.length * 4,
      text: `${names(versatile.map(item => item.player))} can slide across matchups, giving the team credible switch and small-ball counters.`,
    });
  }
  if (rebounders[0] && teamRebounds / players.length >= 6) {
    pros.push({
      score: 74 + teamRebounds,
      text: `${rebounders[0].name} leads a strong rebounding group that should finish defensive possessions and create second chances.`,
    });
  }

  const cons: Read[] = [];
  if (shooters.length < 2) {
    const nonSpacer = paintBound[0];
    cons.push({
      score: 92 - shooters.length * 10,
      text: nonSpacer
        ? `${nonSpacer.name} needs paint touches, and there are not enough proven spacers around that role to keep help defenders occupied.`
        : 'The lineup is short on dependable off-ball shooting, so opponents can shrink the floor against drives and post touches.',
    });
  }
  if (creators.filter(player => stat(player, 'assists') >= 5).length < 2) {
    cons.push({
      score: 84,
      text: creators[0]
        ? `Too much creation runs through ${creators[0].name}; aggressive traps could force the next decision onto a less natural organizer.`
        : 'The roster lacks a natural organizer and may stall into difficult isolation possessions late in the clock.',
    });
  }
  if (!rimProtectors[0] || stat(rimProtectors[0], 'blocks') < 1) {
    cons.push({
      score: 82,
      text: `${rimProtectors[0]?.name ?? 'The current frontcourt'} is not a high-level rim deterrent, leaving little margin when perimeter defenders are beaten.`,
    });
  }
  if (primaryOptions.length >= 4) {
    cons.push({
      score: 80 + primaryOptions.length * 3,
      text: `${names(primaryOptions, 3)} all need meaningful on-ball reps, so the team must define a late-game hierarchy instead of taking turns in isolation.`,
    });
  }
  if (players.filter(player => ['PG', 'SG'].includes(player.position)).length >= 4) {
    cons.push({
      score: 76,
      text: 'The guard-heavy rotation can be forced into cross-matches against bigger wings, especially after offensive rebounds and transition scrambles.',
    });
  }
  if (teamRebounds / players.length < 5.2) {
    cons.push({
      score: 73,
      text: 'This group is light on defensive rebounding outside the center spot, which can erase otherwise good first-shot defense.',
    });
  }
  if (teamStocks / players.length < 1.5) {
    cons.push({
      score: 68,
      text: 'The lineup does not create many live-ball turnovers or blocked shots, so it will need disciplined half-court defense to generate stops.',
    });
  }
  const weakest = ranked[ranked.length - 1];
  if (weakest && weakest.playerScore < 70) {
    cons.push({
      score: 70,
      text: `${weakest.name} is the matchup opponents are most likely to involve repeatedly in screening actions on both ends.`,
    });
  }
  if (cons.length === 0) {
    cons.push({
      score: 1,
      text: `The main risk is role compression: even ${weakest.name}, the lowest-rated player, needs a clear job to keep the stars connected.`,
    });
  }

  return { pros: choose(pros), cons: choose(cons) };
}
