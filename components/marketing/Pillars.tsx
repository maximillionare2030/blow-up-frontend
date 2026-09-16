function CardIcon({ path }: { path: string }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-700 mb-5">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d={path} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-7 rounded-2xl border border-neutral-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {children}
    </div>
  );
}

export function Pillars() {
  return (
    <section className="py-20 bg-white border-t border-neutral-100" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono mb-2">Pillars of reach</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">Built for empirical short-form dominance.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div>
              <CardIcon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <h3 className="text-base font-bold text-neutral-900 mb-2">Surgical 0–2s Hook Diagnostics</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                Break down the sub-second visual triggers, text density, and initial pitch modulation that either capture scrolling thumbs or get skipped.
              </p>
            </div>
            <div className="bg-mist rounded-xl p-4 border border-neutral-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-500 font-medium">Critical Retention</span>
                <span className="font-mono tabular-nums font-semibold text-neutral-900">65.4% Hold</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden mb-2">
                <div className="bg-obsidian h-1.5 rounded-full w-[65.4%]" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono tabular-nums text-neutral-400">
                <span>0.0s (HOOK)</span>
                <span>1.0s</span>
                <span>2.0s (COMMITTED)</span>
              </div>
            </div>
          </Card>
          <Card>
            <div>
              <CardIcon path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              <h3 className="text-base font-bold text-neutral-900 mb-2">Fleet Ingestion &amp; Dispatch</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                Distribute batch hook variations across multi-niche creator nodes. Identify algorithmic outlier variants before publishing to production channels.
              </p>
            </div>
            <div className="bg-mist rounded-xl p-3 border border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] font-mono tabular-nums">V1</span>
                <span className="text-[10px] font-mono tabular-nums text-neutral-400">14% hold</span>
              </div>
              <span className="text-neutral-300 text-xs" aria-hidden>→</span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] font-mono tabular-nums">V2</span>
                <span className="text-[10px] font-mono tabular-nums text-neutral-400">32% hold</span>
              </div>
              <span className="text-neutral-300 text-xs" aria-hidden>→</span>
              <div className="flex items-center gap-1.5 bg-obsidian text-white px-2.5 py-1 rounded-full">
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-mono tabular-nums font-bold">V3</span>
                <span className="text-[10px] font-mono tabular-nums font-semibold">79% outlier</span>
              </div>
            </div>
          </Card>
          <Card>
            <div>
              <CardIcon path="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              <h3 className="text-base font-bold text-neutral-900 mb-2">Empirical Retention Telemetry</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                Remove guesswork. Compare real drop-off slopes to platform-wide benchmarks across verified creator datasets in your target vertical.
              </p>
            </div>
            <div className="bg-mist rounded-xl p-4 border border-neutral-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-500 font-medium">Slope Variance</span>
                <span className="font-mono tabular-nums text-[11px] font-semibold text-neutral-900">+3.4s Baseline</span>
              </div>
              <div className="h-9 w-full flex items-center">
                <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 200 32" aria-hidden>
                  <path d="M 0 24 C 40 22, 70 8, 120 12 C 160 16, 180 4, 200 2" stroke="#0A0A0B" strokeLinecap="round" strokeWidth="2" />
                  <path d="M 0 28 C 40 28, 90 26, 140 24 C 170 23, 190 22, 200 22" stroke="#D1D5DB" strokeDasharray="2 2" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
