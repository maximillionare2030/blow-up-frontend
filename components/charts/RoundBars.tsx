import { BaselineMultiple } from "@/components/domain/BaselineMultiple";

type Entry = {
  lever_value: string;
  n: number;
  median_multiple: number;
  is_winner: boolean;
};

export function RoundBars({ entries }: { entries: Entry[] }) {
  const max = Math.max(2, ...entries.map((e) => e.median_multiple));
  return (
    <div className="flex flex-col gap-2 py-2">
      {entries.map((e) => (
        <div key={e.lever_value} className="flex items-center gap-3">
          <span className="w-[140px] shrink-0 truncate text-right font-mono text-[13px]">{e.lever_value}</span>
          <div className="h-5 flex-1">
            <div className="h-5 rounded-r-[3px]"
              style={{ width: `${(e.median_multiple / max) * 100}%`,
                       background: e.is_winner ? "var(--color-accent)" : "var(--color-surface-2)" }} />
          </div>
          <BaselineMultiple multiple={e.median_multiple} isWinner={e.is_winner} />
          <span className="font-mono text-[11px] text-neutral">n={e.n}</span>
        </div>
      ))}
      <p className="label-11 mt-1 pl-[140px]">1.0x = baseline</p>
    </div>
  );
}
