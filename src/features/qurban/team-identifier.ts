import type { ResponsibilityKind, Team } from "./types";
import { RESPONSIBILITY_SHORT } from "./constants";

/**
 * Team names are derived from the category with per-category numbering and
 * gap filling (Tim Jagal 1, Tim Jagal 2, ...). Never entered manually.
 */
export function nextTeamName(
  teams: Team[],
  kind: ResponsibilityKind,
  ignoreId?: string,
): string {
  const used = new Set<number>();
  for (const team of teams) {
    if (team.kind !== kind) continue;
    if (ignoreId && team.id === ignoreId) continue;
    const match = /(\d+)$/.exec(team.name);
    if (match) used.add(Number(match[1]));
  }
  let candidate = 1;
  while (used.has(candidate)) candidate += 1;
  return `Tim ${RESPONSIBILITY_SHORT[kind]} ${candidate}`;
}
