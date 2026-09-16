import Link from "next/link";
import { BoltMark } from "./MarketingHeader";

export function MarketingFooter() {
  return (
    <footer className="border-t border-neutral-100 py-10 bg-white text-xs text-neutral-500 font-mono tabular-nums">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BoltMark className="w-5 h-5" />
          <span>© 2026 BlowUp. Built for hyper-growth engines.</span>
        </div>
        <div className="flex items-center gap-6 text-neutral-600">
          <Link className="hover:text-obsidian transition" href="/privacy">Privacy</Link>
          <Link className="hover:text-obsidian transition" href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
