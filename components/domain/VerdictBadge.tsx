export function VerdictBadge({ verdict, size = "sm" }: {
  verdict: "separated" | "inconclusive"; size?: "sm" | "lg";
}) {
  const sep = verdict === "separated";
  const sizeClass = size === "lg" ? "px-4 py-1.5 text-base" : "px-3 py-1 text-sm";
  return (
    <span className={`inline-block rounded-[6px] font-mono font-bold uppercase tracking-widest ${sizeClass} ${
      sep ? "bg-accent text-ink" : "bg-surface-2 text-neutral"}`}>
      {sep ? "SEPARATED" : "INCONCLUSIVE"}
    </span>
  );
}
