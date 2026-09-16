import Link from "next/link";
import { FleetDiagram } from "./FleetDiagram";

export function Hero() {
  return (
    <section className="pt-20 pb-16 md:pt-24 md:pb-24 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3F4F6] border border-neutral-200 mb-8">
          <span className="w-2 h-2 rounded-full bg-telemetry animate-pulse motion-reduce:animate-none" />
          <span className="text-[11px] font-semibold tracking-wider text-neutral-600 uppercase font-mono">Creator telemetry engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-[58px] font-extrabold tracking-tighter leading-[1.08] text-neutral-950 mb-6 max-w-3xl mx-auto">
          Turn high-velocity hooks into algorithmic reach.
        </h1>
        <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Precision frame diagnostics and retention telemetry for creator fleets. Test hooks before you publish to systematically capture the 0–2 second window.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-20">
          <Link href="/signup" className="w-full sm:w-auto px-7 py-3 rounded-full bg-obsidian text-white font-medium text-sm hover:bg-neutral-800 transition shadow-sm">Start Free Trial</Link>
          <a href="#telemetry" className="w-full sm:w-auto px-7 py-3 rounded-full bg-white border border-neutral-200 text-neutral-800 font-medium text-sm hover:bg-neutral-50 transition">
            Explore Live Sandbox <span className="ml-1 text-neutral-400">→</span>
          </a>
        </div>
        <FleetDiagram />
      </div>
    </section>
  );
}
