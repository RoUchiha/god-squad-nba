import type { FilledRosterSlot, Player, SeasonResults } from './types';
import { getServerEnv } from './serverEnv';
import { fetchWithTimeout } from './security';

interface Explanation {
  recordJustification: string;
  recordFactors: string[];
  explanationSource: 'llm' | 'local';
}

const INJURY_PROFILE: Record<string, string> = {
  'Stephen Curry': 'ankle and availability risk in longer season samples',
  'Kevin Durant': 'foot, Achilles, and late-career durability risk',
  'Kawhi Leonard': 'load-management and lower-body durability risk',
  'Anthony Davis': 'availability risk despite elite two-way impact',
  'Joel Embiid': 'availability risk under an 82-game burden',
  'Zion Williamson': 'availability and conditioning risk',
  'Kyrie Irving': 'availability volatility',
  'Chris Paul': 'late-season durability risk',
  'Derrick Rose': 'major knee-injury history',
  'Tracy McGrady': 'back and knee durability risk',
  'Yao Ming': 'foot-injury history',
  'Grant Hill': 'ankle-injury history',
};

function filledPlayers(slots: FilledRosterSlot[]): Player[] {
  return slots.flatMap(slot => slot.player ? [slot.player] : []);
}

function stat(player: Player, key: keyof Player['stats']): number {
  return player.stats[key] ?? 0;
}

function fmt(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

function topNames(players: Player[], count = 3): string {
  return players.slice(0, count).map(player => player.name).join(', ');
}

function localExplanation(results: SeasonResults, slots: FilledRosterSlot[]): Explanation {
  const players = filledPlayers(slots);
  const sorted = [...players].sort((a, b) => b.playerScore - a.playerScore);
  const highUsage = players
    .filter(player => stat(player, 'points') >= 24)
    .sort((a, b) => stat(b, 'points') - stat(a, 'points'));
  const creators = players
    .filter(player => stat(player, 'assists') >= 6)
    .sort((a, b) => stat(b, 'assists') - stat(a, 'assists'));
  const weakest = [...players].sort((a, b) => a.playerScore - b.playerScore)[0];
  const injuryRisks = players.filter(player => INJURY_PROFILE[player.name]);
  const lossesByTier = results.games
    .filter(game => !game.win)
    .reduce<Record<string, number>>((counts, game) => {
      counts[game.opponentTier] = (counts[game.opponentTier] ?? 0) + 1;
      return counts;
    }, {});
  const lossTierText = Object.entries(lossesByTier)
    .sort((a, b) => b[1] - a[1])
    .map(([tier, count]) => `${count} ${tier}`)
    .join(', ');

  const factors: string[] = [];

  if (results.losses === 0) {
    factors.push(`The ${results.teamPower.gspr} GSPR translated cleanly because the roster paired ${Math.round(results.teamPower.offenseScore)}/100 offense with ${Math.round(results.teamPower.defenseScore)}/100 defense.`);
  } else if (lossTierText) {
    factors.push(`${results.losses} loss${results.losses === 1 ? '' : 'es'} came against ${lossTierText} opponent tier${results.losses === 1 ? '' : 's'}, which is where upset variance is concentrated.`);
  }

  if (results.teamPower.offenseScore >= 98) {
    factors.push(`The offense is a true 100-level engine: ${topNames(sorted, 3)} give it elite creation, scoring gravity, and late-clock bailout options.`);
  } else if (results.teamPower.offenseScore >= 92) {
    factors.push(`The offense is elite at ${Math.round(results.teamPower.offenseScore)}/100, but the sixth slot and role overlap keep it short of a perfect unit.`);
  }

  if (results.teamPower.defenseScore < 88) {
    factors.push(`The defense is the pressure point at ${Math.round(results.teamPower.defenseScore)}/100; a perfect season needs every possession covered, not just overwhelming shot-making.`);
  } else {
    factors.push(`The defense grades strong at ${Math.round(results.teamPower.defenseScore)}/100, but single-game variance still punishes cross-era rosters on foul trouble, matchup hunting, and shooting luck.`);
  }

  if (highUsage.length >= 4) {
    factors.push(`${topNames(highUsage, 4)} all need touches, so the simulation taxes shot hierarchy and chemistry even when the talent is ridiculous.`);
  } else if (creators.length <= 1 && creators[0]) {
    factors.push(`Primary organization leans heavily on ${creators[0].name}; blitzes or foul trouble can make the offense more isolation-heavy.`);
  }

  if (injuryRisks.length > 0) {
    factors.push(`${topNames(injuryRisks, 2)} add health-liability context: ${injuryRisks.slice(0, 2).map(player => INJURY_PROFILE[player.name]).join('; ')}.`);
  }

  if (weakest && weakest.playerScore < 84) {
    factors.push(`${weakest.name} is the clear matchup target at ${fmt(weakest.playerScore)} overall, so elite opponents can hunt that minutes pocket.`);
  }

  const chosen = factors.slice(0, 4);
  const justification = results.losses === 0
    ? `This roster finished perfect because its top-end talent survived the schedule without a weak enough matchup pocket for opponents to exploit. ${chosen.join(' ')}`
    : `A ${results.recordLabel} record is still historically dominant, but not impossible to justify. ${chosen.join(' ')}`;

  return {
    recordJustification: justification,
    recordFactors: chosen,
    explanationSource: 'local',
  };
}

function buildPrompt(results: SeasonResults, slots: FilledRosterSlot[]): string {
  const players = filledPlayers(slots).map(player => ({
    name: player.name,
    position: player.position,
    yearsWithTeam: player.yearsWithTeam,
    score: player.playerScore,
    stats: player.stats,
    isLegend: Boolean(player.isLegend),
    isAllStar: Boolean(player.isAllStar),
    injuryContext: INJURY_PROFILE[player.name] ?? null,
  }));

  const lossSummary = results.games
    .filter(game => !game.win)
    .map(game => ({
      game: game.gameNumber,
      opponent: game.opponentName,
      opponentTier: game.opponentTier,
      margin: game.scoreDiff,
      score: `${game.teamScore}-${game.opponentScore}`,
    }));

  return JSON.stringify({
    instruction: 'Explain why this NBA fantasy roster produced this simulated season record using established NBA film-room concepts: advantage creation, spacing, shot hierarchy, point-of-attack defense, rim protection, rebounding, lineup size, switchability, transition defense, role fit, chemistry, availability, and matchup variance. Treat the supplied player profiles and box-score fields as the only factual data source. Never invent a stat, accolade, injury, percentage, or decimal. Do not cite opaque model scores in the prose. Use familiar basketball language that would sound credible to an informed NBA analyst. Return JSON only with keys recordJustification and recordFactors. recordFactors must be 3-4 concise strings.',
    record: results.recordLabel,
    gspr: results.teamPower.gspr,
    offenseScore: Math.round(results.teamPower.offenseScore),
    defenseScore: Math.round(results.teamPower.defenseScore),
    chemistryBonus: results.teamPower.chemistryBonus,
    compositionAnalysis: results.compositionAnalysis,
    losses: lossSummary,
    players,
  });
}

function parseLLMExplanation(text: string): Pick<Explanation, 'recordJustification' | 'recordFactors'> | null {
  try {
    const parsed = JSON.parse(text) as Partial<Explanation>;
    if (
      typeof parsed.recordJustification === 'string' &&
      Array.isArray(parsed.recordFactors) &&
      parsed.recordFactors.every(item => typeof item === 'string')
    ) {
      return {
        recordJustification: parsed.recordJustification.slice(0, 900),
        recordFactors: parsed.recordFactors.slice(0, 4).map(item => item.slice(0, 220)),
      };
    }
  } catch {
    return null;
  }

  return null;
}

async function llmExplanation(results: SeasonResults, slots: FilledRosterSlot[]): Promise<Explanation | null> {
  const env = getServerEnv();
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        temperature: 0.35,
        max_tokens: 320,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a concise NBA roster analyst. Be accurate, skeptical, and specific. Return valid JSON only.',
          },
          {
            role: 'user',
            content: buildPrompt(results, slots),
          },
        ],
      }),
    }, env.OPENAI_TIMEOUT_MS);

    if (!response.ok) return null;
    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const parsed = parseLLMExplanation(data.choices?.[0]?.message?.content ?? '');
    if (!parsed) return null;

    return {
      ...parsed,
      explanationSource: 'llm',
    };
  } catch {
    return null;
  }
}

export async function explainSeasonRecord(
  results: SeasonResults,
  slots: FilledRosterSlot[],
  allowLLM = true
): Promise<Explanation> {
  return allowLLM ? await llmExplanation(results, slots) ?? localExplanation(results, slots) : localExplanation(results, slots);
}
