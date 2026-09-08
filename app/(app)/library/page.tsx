"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { VideoRow } from "@/components/video/VideoRow";

const LEVERS = ["text_overlay", "trim_point", "punch_in", "cover_frame"];
const PAGE_SIZE = 200;

export default function LibraryPage() {
  const [accountId, setAccountId] = useState("");
  const [provenance, setProvenance] = useState("");
  const [lever, setLever] = useState("");
  const [baseline, setBaseline] = useState<"" | "above" | "below">("");
  const [offset, setOffset] = useState(0);
  const [accumulatedRows, setAccumulatedRows] = useState<any[]>([]);

  const accountsQ = useQuery({ queryKey: keys.accounts(), queryFn: () => api<any>("/api/v1/accounts") });

  const filters = useMemo(
    () => ({
      account_id: accountId || undefined,
      provenance: provenance || undefined,
      lever: lever || undefined,
    }),
    [accountId, provenance, lever]
  );

  // Reset accumulation whenever a server-side filter changes.
  useEffect(() => {
    setOffset(0);
    setAccumulatedRows([]);
  }, [filters.account_id, filters.provenance, filters.lever]);

  const q = useQuery({
    queryKey: keys.videos({ ...filters, offset }),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.account_id) params.set("account_id", filters.account_id);
      if (filters.provenance) params.set("provenance", filters.provenance);
      if (filters.lever) params.set("lever", filters.lever);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(offset));
      const qs = params.toString();
      return api<any>(`/api/v1/videos?${qs}`);
    },
  });

  useEffect(() => {
    if (!q.data) return;
    const pageRows: any[] = q.data.rows ?? [];
    setAccumulatedRows((prev) => {
      if (offset === 0) return pageRows;
      const seen = new Set(prev.map((r) => r.id));
      const appended = pageRows.filter((r) => !seen.has(r.id));
      return [...prev, ...appended];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.data, offset]);

  if (q.isPending && offset === 0) return <p className="text-[13px] text-neutral">Loading…</p>;
  if (q.isError && accumulatedRows.length === 0) {
    return (
      <div className="rounded-[10px] border border-hairline p-6 text-[13px]">
        <p>Couldn&rsquo;t load the library.</p>
        <button onClick={() => q.refetch()} className="mt-2 rounded-[6px] border border-hairline px-3 py-1 hover:border-ink">Try again</button>
      </div>
    );
  }

  const total: number = q.data?.total ?? accumulatedRows.length;
  const rows: any[] = accumulatedRows;
  const filtered = rows.filter((r) => {
    if (baseline === "above") return (r.baseline_multiple ?? 0) >= 1;
    if (baseline === "below") return (r.baseline_multiple ?? 0) < 1;
    return true;
  });

  return (
    <div className="max-w-[1100px]">
      <h1 className="mb-4 text-2xl font-semibold">Library</h1>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)}
          aria-label="Account" className="rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]">
          <option value="">All accounts</option>
          {(accountsQ.data as any[] ?? []).map((a: any) => (
            <option key={a.id} value={a.id}>{a.handle ?? a.id}</option>
          ))}
        </select>
        <select value={provenance} onChange={(e) => setProvenance(e.target.value)}
          aria-label="Provenance" className="rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]">
          <option value="">All provenance</option>
          <option value="published">Published</option>
          <option value="ingested">Ingested</option>
        </select>
        <select value={lever} onChange={(e) => setLever(e.target.value)}
          aria-label="Lever" className="rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]">
          <option value="">All levers</option>
          {LEVERS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={baseline} onChange={(e) => setBaseline(e.target.value as any)}
          aria-label="Baseline" className="rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]">
          <option value="">Above or below baseline</option>
          <option value="above">Above baseline</option>
          <option value="below">Below baseline</option>
        </select>
      </div>
      <p className="mb-2 font-mono text-[13px] text-neutral">{filtered.length} of {total} videos</p>
      <div className="flex flex-col">
        {filtered.map((row) => <VideoRow key={row.id} row={row} />)}
      </div>
      {accumulatedRows.length < total ? (
        <button
          onClick={() => setOffset((o) => o + PAGE_SIZE)}
          disabled={q.isFetching}
          className="mt-4 self-start rounded-[6px] border border-hairline px-3 py-1.5 text-[13px] hover:border-ink disabled:opacity-50"
        >
          {q.isFetching ? "Loading…" : "Load more"}
        </button>
      ) : null}
    </div>
  );
}
