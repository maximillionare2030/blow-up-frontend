"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { VerdictBadge } from "@/components/domain/VerdictBadge";
import { EvidenceClass } from "@/components/domain/EvidenceClass";
import { Button } from "@/components/ui/Button";

const LEVERS = ["text_overlay", "trim_point", "punch_in", "cover_frame"];

export default function RoundsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [lever, setLever] = useState(LEVERS[0]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [includeIngested, setIncludeIngested] = useState(false);

  const roundsQ = useQuery({ queryKey: keys.rounds(), queryFn: () => api<any[]>("/api/v1/rounds") });

  const run = useMutation({
    mutationFn: () =>
      api<any>("/api/v1/rounds", {
        method: "POST",
        body: JSON.stringify({
          lever,
          account_ids: null,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          include_ingested: includeIngested,
        }),
      }),
    onSuccess: (round) => {
      qc.invalidateQueries({ queryKey: keys.rounds() });
      router.push(`/rounds/${round.id}`);
    },
  });

  return (
    <div className="max-w-[900px]">
      <h1 className="mb-1 text-2xl font-semibold">Ask a question.</h1>
      <p className="mb-6 text-[13px] text-neutral">
        A round is a lens on videos you&rsquo;ve already posted. Nothing is scheduled or set up.
      </p>

      <EvidenceClass isExploratory={includeIngested}>
        <p className="text-[15px] leading-relaxed">
          Compare videos by{" "}
          <select value={lever} onChange={(e) => setLever(e.target.value)} aria-label="Lever"
            className="rounded-[6px] border border-hairline px-2 py-1 font-mono text-[13px]">
            {LEVERS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>{" "}
          across{" "}
          <span className="rounded-[6px] border border-hairline px-2 py-1 font-mono text-[13px] text-neutral">
            all accounts
          </span>{" "}
          posted between{" "}
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            aria-label="Date from" className="rounded-[6px] border border-hairline px-2 py-1 font-mono text-[13px]" />{" "}
          and{" "}
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            aria-label="Date to" className="rounded-[6px] border border-hairline px-2 py-1 font-mono text-[13px]" />.
        </p>

        <label className="mt-4 flex items-start gap-2">
          <input type="checkbox" checked={includeIngested}
            onChange={(e) => setIncludeIngested(e.target.checked)} className="mt-0.5" />
          <span className="text-[13px]">
            Include ingested videos
            <span className="mt-0.5 block text-[12px] text-neutral">
              Ingested videos have no locked levers. Including them makes this exploratory, not a finding.
            </span>
          </span>
        </label>

        {run.isError && (
          <p className="mt-3 text-[13px] text-negative">
            {run.error instanceof ApiError ? run.error.detail : "Couldn't run this round — try again."}
          </p>
        )}

        <Button className="mt-4" disabled={run.isPending} onClick={() => run.mutate()}>
          {run.isPending ? "Running…" : "Run round"}
        </Button>
      </EvidenceClass>

      <h2 className="mb-3 mt-8 text-[15px] font-medium">Past rounds</h2>
      {roundsQ.isPending ? (
        <p className="text-[13px] text-neutral">Loading…</p>
      ) : roundsQ.isError || !roundsQ.data ? (
        <div className="rounded-[10px] border border-hairline p-6 text-[13px]">
          <p>Couldn&rsquo;t load past rounds.</p>
          <button onClick={() => roundsQ.refetch()} className="mt-2 rounded-[6px] border border-hairline px-3 py-1 hover:border-ink">Try again</button>
        </div>
      ) : roundsQ.data.length === 0 ? (
        <p className="text-[13px] text-neutral">No rounds yet.</p>
      ) : (
        <div className="flex flex-col">
          {roundsQ.data.map((r: any) => (
            <Link key={r.id} href={`/rounds/${r.id}`}
              className="flex items-center gap-4 border-b border-hairline py-2.5 text-[13px] hover:bg-surface-2">
              <span className="w-[140px] shrink-0 font-mono">{r.lever}</span>
              <span className="w-[80px] shrink-0 font-mono text-neutral">n={r.n_videos}</span>
              <VerdictBadge verdict={r.verdict} size="sm" />
              <span className="ml-auto shrink-0 font-mono text-[12px] text-neutral">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
