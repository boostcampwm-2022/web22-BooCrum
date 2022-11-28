// Team
export const TEAM_ROLE = {
  MEMBER: 0,
  MANAGER: 1,
  ADMIN: 2,
} as const;

export type TEAM_ROLE = typeof TEAM_ROLE[keyof typeof TEAM_ROLE];

// Workspace
export const WORKSPACE_ROLE = {
  NOT_FOUND: -1,
  VIEWER: 0,
  EDITOR: 1,
  OWNER: 2,
} as const;

export type WORKSPACE_ROLE = typeof WORKSPACE_ROLE[keyof typeof WORKSPACE_ROLE];
