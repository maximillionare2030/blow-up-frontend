"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { VerdictBadge } from "@/components/domain/VerdictBadge";
import { EvidenceClass } from "@/components/domain/EvidenceClass";
import { RoundBars } from "@/components/charts/RoundBars";

export default function RoundResultPage() {
  const { id } = useParams<{ id: string }>();
  const q = useQuery({ queryKey: keys.round(id), queryFn: () => api<any>(`/api/v1/rounds/${id}`) });

  if (q.isPending) return <p className="text-[13px] text-neutral">Loading…</p>;
  if (q.isError || !q.data) {
    return (
      <div className="rounded-[10px] border border-hairline p-6 text-[13px]">
        <p>Couldn&rsquo;t load this round.</p>
        <button onClick={() => q.refetch()} className="mt-2 rounded-[6px] border border-hairline px-3 py-1 hover:border-ink">Try again</button>
      </div>
    );
  }

  const round = q.data;
  const [top, second] = [...round.entries].sort((a: any, b: any) => b.median_multiple - a.median_multiple);

  let headline: string;
  if (!top) {
    headline = "Not enough tagged videos yet to compare.";
  } else if (round.verdict === "separated") {
    headline = `${top.lever_value} ran ${top.median_multiple}x baseline. ${second?.lever_value ?? "the rest"} ran ${second?.median_multiple ?? "—"}x.`;
  } else if (second) {
    headline = `No separation. ${top.median_multiple}x vs ${second.median_multiple}x across ${round.video_ids.length} videos. This spread is what noise looks like.`;
  } else {
    headline = `Not enough tagged videos yet to compare.`;
  }

  const winner = round.entries.find((e: any) => e.is_winner);
  const date = new Date(round.created_at).toLocaleDateString();

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-6 rounded-[10px] border border-hairline p-6">
        <VerdictBadge verdict={round.verdict} size="lg" />
        <p className="mt-4 text-[17px]">{headline}</p>
        <p className="mt-2 font-mono text-[13px] text-neutral">{round.video_ids.length} videos · {date}</p>
      </div>

      <EvidenceClass isExploratory={round.is_exploratory}>
        <RoundBars entries={round.entries} />
      </EvidenceClass>

      <div className="mt-6 rounded-[10px] border border-hairline p-4">
        {round.verdict === "separated" && winner ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px]">
              Make «<span className="font-mono">{winner.lever_value}</span>» the default in the hook lab.
            </p>
            <Link href={`/hook-lab?value=${winner.lever_value}`}
              className="shrink-0 rounded-[6px] bg-accent px-4 py-2 text-[13px] font-medium text-ink hover:brightness-95">
              Set as default
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] text-neutral">
              Keep posting — more tagged videos would make this readable.
            </p>
            <Link href="/hook-lab"
              className="shrink-0 rounded-[6px] border border-hairline px-4 py-2 text-[13px] font-medium hover:border-ink">
              Open hook lab
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
