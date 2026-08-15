import type { SystemUser, Team } from "./types";

export function normalizePersonName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function userName(users: SystemUser[], userId: string) {
  return users.find((user) => user.id === userId)?.name ?? "";
}

/**
 * One person may belong to only one operational team within an event.
 * Leaders count as members of their own team for this rule.
 */
export function findPersonTeam(
  teams: Team[],
  users: SystemUser[],
  personName: string,
  options: { ignoreTeamId?: string; ignoreMemberId?: string } = {},
): Team | null {
  const target = normalizePersonName(personName);
  if (!target) return null;
  for (const team of teams) {
    if (options.ignoreTeamId && team.id === options.ignoreTeamId) continue;
    if (normalizePersonName(userName(users, team.leaderUserId)) === target) return team;
    const hit = team.members.some(
      (member) =>
        member.id !== options.ignoreMemberId &&
        normalizePersonName(member.name) === target,
    );
    if (hit) return team;
  }
  return null;
}

/** Same rule, but scoped so a person cannot be leader and member of one team. */
export function findPersonConflict(
  teams: Team[],
  users: SystemUser[],
  personName: string,
  options: { withinTeamId?: string; ignoreMemberId?: string } = {},
): Team | null {
  const target = normalizePersonName(personName);
  if (!target) return null;
  const external = findPersonTeam(teams, users, personName, {
    ignoreTeamId: options.withinTeamId,
  });
  if (external) return external;
  if (!options.withinTeamId) return null;
  const team = teams.find((item) => item.id === options.withinTeamId);
  if (!team) return null;
  if (normalizePersonName(userName(users, team.leaderUserId)) === target) return team;
  const duplicate = team.members.some(
    (member) =>
      member.id !== options.ignoreMemberId &&
      normalizePersonName(member.name) === target,
  );
  return duplicate ? team : null;
}