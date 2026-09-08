export function Sparkline({ points }: { points: { captured_at: string; views: number }[] }) {
  const W = 320, H = 64, PAD = 4;
  if (points.length === 0) {
    return <p className="text-[11px] text-neutral">No snapshots yet.</p>;
  }
  const max = Math.max(...points.map((p) => p.views), 1);
  const min = Math.min(...points.map((p) => p.views), 0);
  const range = max - min || 1;
  const x = (i: number) => PAD + (points.length <= 1 ? 0 : (i / (points.length - 1)) * (W - 2 * PAD));
  const y = (v: number) => H - PAD - ((v - min) / range) * (H - 2 * PAD);
  const coords = points.map((p, i) => `${x(i)},${y(p.views)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Views over time">
        <polyline points={coords} fill="none" stroke="var(--color-neutral)" strokeWidth="1.5" />
      </svg>
      <p className="mt-1 text-[11px] text-neutral">Still moving — results stay provisional.</p>
    </div>
  );
}
