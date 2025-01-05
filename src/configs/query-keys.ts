// we define query keys here so that we can use them in multiple places
// and so that we can easily change them if needed

export const QUERY_KEYS = {
  USER: () => ["user"],
  TEAMS: () => ["user-teams"],
  TEAM_MEMBERS: (teamId: string) => ["team-members", teamId],
  TEAM_API_KEYS: (teamId: string) => ["team-api-keys", teamId],
  TEAM_SANDBOXES: (teamId: string) => ["team-sandboxes", teamId],
  TEAM_TEMPLATES: (teamId: string) => ["team-templates", teamId],
  TEAM_INVOICES: (teamId: string) => ["team-invoices", teamId],
};
