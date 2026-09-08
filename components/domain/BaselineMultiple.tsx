export function BaselineMultiple({ multiple, isWinner = false, className = "" }: {
  multiple: number | null; isWinner?: boolean; className?: string;
}) {
  if (multiple == null) return <span className={`font-mono ${className}`} style={{ color: "var(--color-neutral)" }}>—</span>;
  const style: React.CSSProperties = isWinner
    ? { color: "var(--color-ink)", background: "var(--color-accent)", padding: "0 6px", borderRadius: 6 }
    : { color: multiple >= 1 ? "var(--color-positive)" : "var(--color-negative)" };
  return <span className={`font-mono ${className}`} style={style}>{multiple.toFixed(multiple >= 10 ? 0 : 1)}x</span>;
}
