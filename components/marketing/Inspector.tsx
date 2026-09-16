const FRAMES = [
  { t: "0.1s", label: "Curiosity Gap", value: "0.94 score", curve: "M 0 30 C 30 28, 60 12, 100 14 C 130 16, 150 6, 160 4" },
  { t: "0.3s", label: "Sound Modulation", value: "Pitch Peak", curve: "M 0 20 C 20 8, 40 30, 60 12 C 80 28, 100 6, 120 22 C 140 10, 150 24, 160 14" },
  { t: "1.1s", label: "Retention Lock", value: "64.2% lock", curve: "M 0 26 C 40 24, 80 20, 120 19 C 140 18, 150 18, 160 18" },
];

function FrameCard({ f }: { f: (typeof FRAMES)[number] }) {
  return (
    <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-200/70">
      <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden relative mb-2 flex items-center px-3">
        <svg className="w-full h-10 text-neutral-400" fill="none" viewBox="0 0 160 40" preserveAspectRatio="none" aria-hidden>
          <path d={f.curve} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="absolute bottom-1 left-1 bg-black/70 text-white font-mono tabular-nums text-[9px] px-1 rounded">{f.t}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-neutral-700 text-[11px]">{f.label}</span>
        <span className="font-mono tabular-nums font-semibold text-neutral-900 text-[11px]">{f.value}</span>
      </div>
    </div>
  );
}

const METRICS = [
  { label: "Thumb Stop Rate", value: "73.8%", note: "Top 2% of SaaS creator cohort" },
  { label: "Auditory Retention", value: "89.1%", note: "Zero acoustic friction detected" },
  { label: "Rel. Algorithm Index", value: "4.8x", note: "Deterministic multiplier" },
];

export function Inspector() {
  return (
    <section className="py-20 bg-[#FAFBFD] border-t border-neutral-100" id="telemetry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-neutral-200 mb-3 text-xs text-neutral-600 font-mono">
              <span className="text-neutral-400" aria-hidden>✦</span>
              <span>Frame-By-Frame Inspector</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 max-w-xl">Track every frame, audio cue, and retention drop.</h2>
          </div>
          <p className="text-sm text-neutral-500 max-w-sm mt-4 md:mt-0 leading-relaxed">
            Simulate TikTok and Reels viral gating algorithms before a single asset goes live to multi-million subscriber clusters.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-[280px] bg-neutral-900 rounded-[32px] p-2.5 shadow-2xl ring-1 ring-neutral-800">
                <div className="relative w-full aspect-[9/16] rounded-[24px] overflow-hidden bg-neutral-950">
                  <svg className="absolute inset-x-4 top-1/4 h-24 text-neutral-600" fill="none" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden>
                    <path d="M 0 60 C 40 56, 70 20, 110 26 C 150 32, 175 10, 200 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 0 70 C 50 70, 110 64, 200 58" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.2" opacity="0.5" />
                  </svg>
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono tabular-nums text-white">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded-md">00:02:04</span>
                    <span className="bg-neutral-800 px-2 py-0.5 rounded-md">60 FPS</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full border border-neutral-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-neutral-900 rounded-xl p-3 border border-neutral-700 text-white">
                    <p className="text-[11px] font-medium text-neutral-300 mb-1">Variant C: &ldquo;Why your 0-2s will fail&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">Viral Probability</span>
                      <span className="text-xs font-mono tabular-nums font-bold text-telemetry">91.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold tracking-wider text-neutral-500 uppercase">Hook breakdown sequence</span>
                  <span className="text-xs font-mono tabular-nums font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">+28.4% Lift Identified</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {FRAMES.map((f) => <FrameCard key={f.t} f={f} />)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {METRICS.map((m) => (
                  <div key={m.label} className="bg-mist rounded-2xl p-4 border border-neutral-100">
                    <p className="text-xs text-neutral-500 font-medium mb-1">{m.label}</p>
                    <p className="text-3xl font-extrabold font-mono tabular-nums text-neutral-900 tracking-tight">{m.value}</p>
                    <p className="text-[11px] text-neutral-400 mt-2">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
