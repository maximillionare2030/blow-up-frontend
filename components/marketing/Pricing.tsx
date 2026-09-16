import Link from "next/link";

function Feature({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <li className="flex items-center gap-2.5">
      <svg className="w-4 h-4 text-neutral-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </svg>
      <span className={strong ? "font-medium text-neutral-900" : undefined}>{children}</span>
    </li>
  );
}

export function Pricing() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono mb-2">Transparent fleet access</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">Simple pricing. Massive scale.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-neutral-200 p-8 flex flex-col justify-between hover:border-neutral-300 transition shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900">Solo Operator</h3>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">Single seat</span>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-mono tabular-nums">$89</span>
                <span className="text-neutral-400 text-sm ml-2 font-medium font-mono">/ month</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-8">
                Tailored for independent video essayists and founders who obsess over every 0.1s frame retention curve.
              </p>
              <ul className="space-y-3.5 text-xs text-neutral-600 mb-8">
                <Feature>150 hook diagnostics / mo</Feature>
                <Feature>0–2s frame breakdown &amp; OCR readout</Feature>
                <Feature>TikTok &amp; IG Reels benchmark overlay</Feature>
                <Feature>Individual audio pitch cadence tester</Feature>
              </ul>
            </div>
            <Link href="/signup" className="w-full py-3 rounded-full bg-[#F3F4F6] text-neutral-800 text-xs font-semibold hover:bg-neutral-200 transition text-center">
              Deploy Solo Node
            </Link>
          </div>
          <div className="rounded-3xl border-2 border-obsidian p-8 flex flex-col justify-between relative shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-white">
            <div className="absolute -top-3.5 right-8">
              <span className="bg-obsidian text-white font-mono text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">Recommended</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Fleet Cluster</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-mono tabular-nums">$240</span>
                <span className="text-neutral-400 text-sm ml-2 font-medium font-mono">/ month</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-8">
                Engineered for multi-account holding companies, production networks, and hyper-velocity creator fleets.
              </p>
              <ul className="space-y-3.5 text-xs text-neutral-600 mb-8">
                <Feature strong>Unlimited hook diagnostics &amp; dispatch</Feature>
                <Feature>Multi-node cohort variance modeling</Feature>
                <Feature>Automated A/B variant batch export</Feature>
                <Feature>Direct team webhook and API ingest</Feature>
              </ul>
            </div>
            <Link href="/signup" className="w-full py-3 rounded-full bg-obsidian text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-sm text-center">
              Deploy Cluster Engine
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
