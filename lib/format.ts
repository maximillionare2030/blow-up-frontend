export const fmt = {
  views: (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US")),
  date: (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
};
