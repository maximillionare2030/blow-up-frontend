export function BaselineStrip({ multiples }: { multiples: number[] }) {
  const W = 640, H = 120, PAD = 24;
  const x = (m: number) => PAD + (Math.min(m, 5) / 5) * (W - 2 * PAD);
  const oneX = x(1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Videos vs baseline">
      <line x1={oneX} y1={8} x2={oneX} y2={H - 20} stroke="#18181b" strokeWidth="1.5" />
      <text x={oneX + 4} y={16} fontSize="10" fontFamily="var(--font-mono)">your median</text>
      {[0, 1, 2, 3, 4, 5].map((t) => (
        <text key={t} x={x(t)} y={H - 6} fontSize="10" textAnchor="middle"
          fontFamily="var(--font-mono)" fill="#71717a">{t}x</text>
      ))}
      {multiples.map((m, i) => (
        <rect key={i} x={x(m) - 2.5} y={20 + ((i * 37) % (H - 60))} width="5" height="5"
          fill={m >= 1 ? "#4ade80" : "#f87171"} />
      ))}
    </svg>
  );
}
