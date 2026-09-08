export function BaselineMultiple({ multiple, isWinner = false, className = "" }: {
  multiple: number | null; isWinner?: boolean; className?: string;
}) {
  if (multiple == null) return <span className={`font-mono text-neutral ${className}`}>—</span>;
  const color = isWinner ? "text-ink bg-accent px-1.5 rounded-[6px]"
    : multiple >= 1 ? "text-positive" : "text-negative";
  return <span className={`font-mono ${color} ${className}`}>{multiple.toFixed(multiple >= 10 ? 0 : 1)}x</span>;
}
