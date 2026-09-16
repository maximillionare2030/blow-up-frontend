"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";

const LINKS = [
  ["Dashboard", "/dashboard"], ["Hook Lab", "/hook-lab"], ["Library", "/library"],
  ["Rounds", "/rounds"], ["References", "/references"], ["Accounts", "/accounts"],
] as const;

export function Sidebar() {
  const path = usePathname();
  return (
    <nav className="flex w-[220px] shrink-0 flex-col border-r border-hairline p-3">
      <div className="mb-6 flex items-center gap-1.5 px-2">
        <LogoMark size={28} />
        <span className="font-mono text-[15px] font-bold">BlowUp</span>
      </div>
      {LINKS.map(([label, href]) => (
        <Link key={href} href={href}
          className={`rounded-[6px] px-2 py-1.5 text-[13px] ${
            path.startsWith(href) ? "bg-surface font-medium" : "text-neutral hover:text-ink"}`}>
          {label}
        </Link>
      ))}
      <div className="mt-auto border-t border-hairline pt-3">
        <span className="px-2 text-[13px] text-neutral opacity-50" title="Milestone 4">Settings</span>
      </div>
    </nav>
  );
}
