export const keys = {
  videosRoot: () => ["videos"] as const,
  videos: (filters: Record<string, unknown> = {}) => ["videos", filters] as const,
  video: (id: string) => ["video", id] as const,
  rounds: () => ["rounds"] as const,
  round: (id: string) => ["round", id] as const,
  accounts: () => ["accounts"] as const,
  dashboardRoot: () => ["dashboard"] as const,
  dashboard: () => ["dashboard", "needs-attention"] as const,
};
