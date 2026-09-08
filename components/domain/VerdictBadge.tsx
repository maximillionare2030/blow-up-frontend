export function VerdictBadge({ verdict }: { verdict: "separated" | "inconclusive" }) {
  const sep = verdict === "separated";
  return (
    <span className={`inline-block rounded-[6px] px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest ${
      sep ? "bg-accent text-ink" : "bg-surface-2 text-neutral"}`}>
      {sep ? "SEPARATED" : "INCONCLUSIVE"}
    </span>
  );
}
