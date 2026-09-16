import { LogoMark } from "@/components/ui/Logo";

export function AuthPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-2/5 flex-col justify-between bg-surface p-10 md:flex">
        <span className="flex items-center gap-1.5">
          <LogoMark size={28} />
          <span className="font-mono text-[15px] font-bold">BlowUp</span>
        </span>
        <p className="max-w-xs text-[15px]">Find out whether it&rsquo;s you or the algorithm.</p>
        <p className="label-11">tags lock at publish · inconclusive is an answer</p>
      </aside>
      <main className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
