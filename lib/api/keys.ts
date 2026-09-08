export const keys = {
  videos: (filters: Record<string, unknown> = {}) => ["videos", filters] as const,
  video: (id: string) => ["video", id] as const,
  rounds: () => ["rounds"] as const,
  round: (id: string) => ["round", id] as const,
  accounts: () => ["accounts"] as const,
  dashboard: () => ["dashboard", "needs-attention"] as const,
};
