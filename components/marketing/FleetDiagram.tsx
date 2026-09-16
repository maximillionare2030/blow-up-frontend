const NODES = [
  { initials: "KD", metric: "61% @ 2s", featured: false },
  { initials: "MR", metric: "2.8x Lift", featured: false },
  { initials: "AS", metric: "1.4M Reach", featured: true },
  { initials: "JT", metric: "74% @ 2s", featured: false },
  { initials: "LN", metric: "3.9x Lift", featured: false },
  { initials: "PV", metric: "920k Views", featured: false },
];

const NODE_FILLS = [
  "bg-neutral-100 text-neutral-600",
  "bg-neutral-200 text-neutral-700",
  "bg-obsidian text-white",
  "bg-neutral-100 text-neutral-600",
  "bg-neutral-200 text-neutral-700",
  "bg-neutral-100 text-neutral-600",
];

function VerifiedBadge() {
  return (
    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
      <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path d="M5 13l4 4L19 7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function FleetDiagram() {
  return (
    <div className="relative max-w-3xl mx-auto pt-6">
      <div className="grid grid-cols-6 gap-2 sm:gap-4 relative z-10">
        {NODES.map((n, i) => (
          <div key={n.initials} className="flex flex-col items-center">
            <div className="relative mb-2">
              <span className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ring-1 ring-neutral-200 ${NODE_FILLS[i]}`}>
                {n.initials}
              </span>
              <VerifiedBadge />
            </div>
            {n.featured ? (
              <span className="font-mono tabular-nums text-[10px] sm:text-xs text-white bg-obsidian px-2 py-0.5 rounded-full font-semibold">{n.metric}</span>
            ) : (
              <span className="font-mono tabular-nums text-[10px] sm:text-xs text-neutral-500">{n.metric}</span>
            )}
          </div>
        ))}
      </div>
      <div className="relative w-full h-24 my-2 pointer-events-none" aria-hidden>
        <svg className="w-full h-full text-neutral-300" fill="none" preserveAspectRatio="none" viewBox="0 0 600 100">
          {[50, 150, 250, 350, 450, 550].map((x) => (
            <path
              key={x}
              d={`M ${x} 10 C ${x} ${Math.abs(x - 300) > 150 ? 70 : 55}, 300 ${Math.abs(x - 300) > 150 ? 30 : 45}, 300 90`}
              stroke="currentColor"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center relative -mt-4">
        <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 mb-2">
          <svg className="w-5 h-5 animate-spin motion-reduce:animate-none [animation-duration:10s]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 4v2m0 12v2m8-8h-2M6 12H4m14.142-5.657l-1.414 1.414M7.272 16.728l-1.414 1.414m12.728 0l-1.414-1.414M7.272 7.272L5.858 5.858" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-telemetry" />
          <span className="text-[10px] font-medium text-neutral-600">Your Fleet</span>
        </div>
      </div>
    </div>
  );
}
