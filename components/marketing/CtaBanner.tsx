import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-12 sm:p-20 text-center relative overflow-hidden">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 mb-4">
          High-velocity creators spread. You scale.
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Equip your production studio with the algorithmic retention telemetry needed to command the feed.
        </p>
        <Link href="/signup" className="inline-block px-8 py-3.5 rounded-full bg-obsidian text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-sm">
          Deploy Fleet
        </Link>
      </div>
    </section>
  );
}
