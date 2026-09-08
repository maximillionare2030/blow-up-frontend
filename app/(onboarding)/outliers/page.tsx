"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { BaselineStrip } from "@/components/charts/BaselineStrip";
import { EvidenceClass } from "@/components/domain/EvidenceClass";
import { VideoCard } from "@/components/video/VideoCard";

export default function OutliersPage() {
  const videos = useQuery({
    queryKey: keys.videos({ provenance: "ingested" }),
    queryFn: () => api<any>("/api/v1/videos?provenance=ingested&limit=200"),
  });
  const rows = (videos.data?.rows ?? []).filter((r: any) => r.baseline_multiple != null);
  const sorted = [...rows].sort((a, b) => b.baseline_multiple - a.baseline_multiple);
  const best = sorted.slice(0, 2);
  const worst = sorted.slice(-2).reverse();

  if (videos.isPending) {
    return (
      <div className="max-w-[760px]">
        <h1 className="text-2xl font-semibold">Here&rsquo;s what your history actually looks like.</h1>
        <p className="mt-2 text-[13px] text-neutral">Reading your videos…</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-[760px]">
        <h1 className="text-2xl font-semibold">Here&rsquo;s what your history actually looks like.</h1>
        <p className="mt-2 text-[13px] text-neutral">No history yet — connect an account with published videos, or head to the hook lab.</p>
        <div className="mt-6 text-right">
          <Link href="/dashboard" className="text-[13px] text-neutral hover:text-ink">Go to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[760px]">
      <h1 className="text-2xl font-semibold">Here&rsquo;s what your history actually looks like.</h1>
      <p className="mt-2 text-[13px] text-neutral">
        Every video against its own account&rsquo;s median. Most creators have never seen this.
      </p>
      <div className="mt-6 rounded-[10px] border border-hairline p-4">
        <BaselineStrip multiples={rows.map((r: any) => r.baseline_multiple)} />
      </div>
      <div className="mt-6">
        <EvidenceClass isExploratory>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="label-11 mb-2">Your two best</h2>
              <div className="flex gap-3">{best.map((r: any) => <VideoCard key={r.id} row={r} />)}</div>
            </div>
            <div>
              <h2 className="label-11 mb-2">Your worst</h2>
              <div className="flex gap-3">{worst.map((r: any) => <VideoCard key={r.id} row={r} />)}</div>
            </div>
          </div>
        </EvidenceClass>
      </div>
      <div className="mt-4 rounded-[10px] border border-hairline p-4 text-[13px] text-neutral">
        BlowUp doesn&rsquo;t know what was different about these videos — they were posted before you
        started tracking. Treat them as hypotheses, not answers.{" "}
        <Link href="/hook-lab" className="font-medium text-ink underline decoration-accent decoration-2">Test one →</Link>
      </div>
      <div className="mt-6 text-right">
        <Link href="/dashboard" className="text-[13px] text-neutral hover:text-ink">Go to dashboard</Link>
      </div>
    </div>
  );
}
