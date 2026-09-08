import Link from "next/link";
import { Check } from "@/components/ui/Check";

export default function Landing() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-16 flex items-center justify-between">
        <span className="font-mono text-[15px] font-bold">BlowUp</span>
        <Link href="/login" className="text-[13px] text-neutral hover:text-ink">Log in</Link>
      </header>
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
        Find out whether it&rsquo;s you or the algorithm.
      </h1>
      <p className="mt-4 max-w-xl text-[15px] text-neutral">
        Post across your own accounts. BlowUp records what was different about every video
        before it goes out, then tells you which differences moved views.
      </p>
      <Link href="/signup"
        className="mt-6 inline-block rounded-[6px] bg-accent px-4 py-2 text-[13px] font-medium text-ink">
        Start free
      </Link>
      <section className="mt-20 grid grid-cols-3 gap-6 border-t border-hairline pt-8">
        {["75 videos. 2 over 1,000 views.",
          "Same video: 30k on one platform, 350 on another.",
          "Every hook library is built on the ones that worked."].map((s) => (
          <p key={s} className="font-mono text-[13px]">{s}</p>
        ))}
      </section>
      <p className="mt-4 text-[13px] text-neutral">You can&rsquo;t learn from results when nothing was held constant.</p>
      <section className="mt-16 border-t border-hairline pt-8">
        <h2 className="label-11 mb-4">What BlowUp won&rsquo;t do</h2>
        {["Won't create or supply accounts.",
          "Won't tell you why a video worked.",
          "Won't name a winner when the data is noise — 'inconclusive' is an answer we ship."].map((s) => (
          <p key={s} className="mb-1 text-[13px] text-neutral"><Check />{s}</p>
        ))}
      </section>
    </div>
  );
}
