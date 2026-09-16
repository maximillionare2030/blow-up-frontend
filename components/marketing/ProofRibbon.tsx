const STATS = [
  { value: "18,700+", label: "Hooks Analyzed" },
  { value: "99.8%", label: "Deterministic Parity" },
  { value: "3.4x", label: "Reach Multiplier" },
];

export function ProofRibbon() {
  return (
    <section className="py-14 bg-white border-t border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-mono tracking-widest text-neutral-400 font-semibold uppercase mb-6">
          Powering top-tier creator studios and multi-account operators
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-xs sm:text-sm text-neutral-800 shadow-xs">
              <span className="font-mono tabular-nums font-semibold">{s.value}</span>{" "}
              <span className="text-neutral-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
