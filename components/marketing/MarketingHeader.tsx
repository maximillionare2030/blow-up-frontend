import Link from "next/link";

export function BoltMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <span className={`${className} rounded-full bg-obsidian text-white inline-flex items-center justify-center`}>
      <svg className="w-1/2 h-1/2 fill-current" viewBox="0 0 24 24" aria-hidden>
        <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
      </svg>
    </span>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F0F1F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <BoltMark />
          <span className="font-bold text-lg tracking-tight">BlowUp</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a className="hover:text-obsidian transition" href="#features">Features</a>
          <a className="hover:text-obsidian transition" href="#telemetry">Hook Telemetry</a>
          <a className="hover:text-obsidian transition" href="#pricing">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-obsidian transition px-2 py-1">Sign In</Link>
          <Link href="/signup" className="bg-obsidian hover:bg-neutral-800 text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm transition">Deploy Fleet</Link>
        </div>
      </div>
    </header>
  );
}
