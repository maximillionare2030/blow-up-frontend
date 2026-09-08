"use client";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";

const SEV: Record<string, string> = {
  red: "border-l-2 border-l-negative", amber: "border-l-2 border-l-warning", grey: "",
};
const VERB_LABEL: Record<string, string> = {
  reupload: "Re-upload", retry: "Retry", reauthorize: "Reauthorize", review: "Review",
};
const VERB_HREF: Record<string, string> = {
  reupload: "/hook-lab", reauthorize: "/accounts", review: "/library",
};

export default function DashboardPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: keys.dashboard(), queryFn: () => api<any>("/api/v1/dashboard/needs-attention") });
  const retry = useMutation({
    mutationFn: (postId: string) => api(`/api/v1/posts/${postId}/retry`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.dashboard() }),
  });
  if (!q.data) return null;
  const { items, stats } = q.data;
  const tiles: [string, number, string][] = [
    ["Accounts connected", stats.accounts_connected, "/accounts"],
    ["Published this week", stats.videos_published_this_week, "/library"],
    ["Above baseline", stats.videos_above_baseline, "/library"],
    ["Rounds run", stats.rounds_run, "/rounds"],
  ];
  return (
    <div className="max-w-[900px]">
      <div className="mb-6 flex items-baseline gap-6">
        <h1 className="text-2xl font-semibold">Needs attention</h1>
        <nav className="flex gap-3 text-[13px] text-neutral">
          <span className="font-medium text-ink">Needs attention</span>
          <Link href="/library" className="hover:text-ink">Recent</Link>
          <Link href="/rounds" className="hover:text-ink">Rounds</Link>
        </nav>
      </div>
      <div className="mb-6 grid grid-cols-4 gap-3">
        {tiles.map(([label, n, href]) => (
          <Link key={label} href={href} className="rounded-[10px] border border-hairline p-3 hover:border-ink">
            <p className="font-mono text-2xl">{n}</p>
            <p className="label-11">{label}</p>
          </Link>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="rounded-[10px] border border-hairline py-16 text-center">
          <p className="text-[15px] font-medium">Nothing needs you.</p>
          <p className="mt-1 text-[13px] text-neutral">Everything live is being tracked. Come back after your next post.</p>
          <Link href="/hook-lab"
            className="mt-4 inline-block rounded-[6px] bg-accent px-4 py-2 text-[13px] font-medium text-ink">
            Open hook lab
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((it: any, i: number) => (
            <div key={i} className={`flex items-center gap-3 rounded-[10px] border border-hairline p-3 ${SEV[it.severity] ?? ""}`}>
              <p className="flex-1 text-[13px]">{it.message}</p>
              {it.type === "failed_post" && it.action === "retry" ? (
                <button onClick={() => retry.mutate(it.post_id)}
                  className="rounded-[6px] border border-hairline px-3 py-1 text-[13px] hover:border-ink">
                  Retry
                </button>
              ) : (
                <Link href={VERB_HREF[it.action] ?? "/library"}
                  className="rounded-[6px] border border-hairline px-3 py-1 text-[13px] hover:border-ink">
                  {VERB_LABEL[it.action] ?? "Review"}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
