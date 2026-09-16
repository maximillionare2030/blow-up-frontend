import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F0F1F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo size={40} />
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
