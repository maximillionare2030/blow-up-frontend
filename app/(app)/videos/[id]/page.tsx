"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { fmt } from "@/lib/format";
import { ProvenanceBadge } from "@/components/domain/ProvenanceBadge";
import { BaselineMultiple } from "@/components/domain/BaselineMultiple";
import { LeverChip } from "@/components/domain/LeverChip";
import { PostState } from "@/components/domain/PostState";
import { VideoCard } from "@/components/video/VideoCard";
import { Sparkline } from "@/components/charts/Sparkline";
import { Button } from "@/components/ui/Button";

export default function VideoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const qc = useQueryClient();
  const [noteBody, setNoteBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const q = useQuery({
    queryKey: keys.video(id),
    queryFn: () => api<any>(`/api/v1/videos/${id}`),
  });

  const addNote = useMutation({
    mutationFn: (body: string) => api(`/api/v1/videos/${id}/notes`, { method: "POST", body: JSON.stringify({ body }) }),
    onSuccess: () => {
      setNoteBody("");
      qc.invalidateQueries({ queryKey: keys.video(id) });
    },
  });

  const editNote = useMutation({
    mutationFn: (vars: { noteId: string; body: string }) =>
      api(`/api/v1/notes/${vars.noteId}`, { method: "PATCH", body: JSON.stringify({ body: vars.body }) }),
    onSuccess: () => {
      setEditingId(null);
      qc.invalidateQueries({ queryKey: keys.video(id) });
    },
  });

  const retry = useMutation({
    mutationFn: (postId: string) => api(`/api/v1/posts/${postId}/retry`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.video(id) }),
  });

  if (q.isPending) return <p className="text-[13px] text-neutral">Loading…</p>;
  if (q.isError || !q.data) {
    return (
      <div className="rounded-[10px] border border-hairline p-6 text-[13px]">
        <p>Couldn&rsquo;t load this video.</p>
        <button onClick={() => q.refetch()} className="mt-2 rounded-[6px] border border-hairline px-3 py-1 hover:border-ink">Try again</button>
      </div>
    );
  }

  const d = q.data;
  const latest = d.snapshots.at(-1);
  const share = latest?.views ? (latest.shares ?? 0) / latest.views : null;
  const engage = latest?.views
    ? ((latest.likes ?? 0) + (latest.comments ?? 0) + (latest.shares ?? 0)) / latest.views : null;
  const pct = (x: number | null) => (x == null ? "—" : `${(x * 100).toFixed(1)}%`);

  const cards: [string, React.ReactNode][] = [
    ["Views", <span key="v" className="font-mono text-2xl">{fmt.views(d.views)}</span>],
    ["Baseline", <BaselineMultiple key="b" multiple={d.baseline_multiple} className="text-2xl" />],
    ["Share rate", <span key="s" className="font-mono text-2xl">{pct(share)}</span>],
    ["Engagement", <span key="e" className="font-mono text-2xl">{pct(engage)}</span>],
  ];

  // The detail response has no post_id, so retry can't be wired here; point back to the dashboard instead.
  const postId: string | undefined = d.post_id;

  return (
    <div className="max-w-[1100px]">
      <div className="grid grid-cols-[320px_1fr] gap-8">
        <div>
          <ProvenanceBadge provenance={d.provenance} />
          <div className="mt-3 aspect-[9/16] w-full rounded-[10px] bg-surface-2" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{d.caption || "(no caption)"}</h1>
          <p className="mt-1 text-[13px] text-neutral">{d.handle} · {fmt.date(d.published_at)}</p>

          <div className="mt-4">
            <PostState state={d.post_state} failureReason={d.failure_reason} failureAction={d.failure_action}
              onAction={postId ? () => retry.mutate(postId) : undefined} />
            {d.post_state === "failed" && !postId && (
              <p className="mt-1 text-[11px] text-neutral">Retry from the dashboard.</p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            {cards.map(([label, node]) => (
              <div key={label} className="rounded-[10px] border border-hairline p-3">
                {node}
                <p className="label-11 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Sparkline points={d.snapshots} />
          </div>

          <div className="mt-6">
            <p className="label-11 mb-2">Locked levers</p>
            {d.provenance === "ingested" ? (
              <div className="rounded-[10px] border border-dashed border-hairline p-3 text-[13px] text-neutral">
                No locked levers. This video was posted before tracking — BlowUp doesn&rsquo;t know what was different about it.
              </div>
            ) : (
              <div className="flex gap-2">{Object.entries(d.lever_tags).map(([l, v]) =>
                <LeverChip key={l} lever={l} value={String(v)} />)}</div>
            )}
          </div>

          {d.siblings.length > 0 && (
            <div className="mt-6">
              <p className="label-11 mb-2">Variants</p>
              <div className="flex gap-3 overflow-x-auto">
                {d.siblings.map((s: any) => (
                  <VideoCard key={s.video_id} row={{ id: s.video_id, baseline_multiple: s.baseline_multiple, provenance: d.provenance }} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="label-11 mb-2">Notes</p>
            {addNote.error && (
              <p className="mb-2 rounded-[6px] border border-negative px-3 py-2 text-[13px] text-negative">
                {addNote.error instanceof ApiError ? addNote.error.detail : "Couldn't save the note."}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {d.notes.map((n: any) => (
                <div key={n.id} className="rounded-[10px] border border-hairline border-dashed p-3">
                  <p className="text-[11px] text-neutral">{fmt.date(n.created_at)}</p>
                  {editingId === n.id ? (
                    <div className="mt-1 flex items-center gap-2">
                      <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)}
                        className="flex-1 rounded-[6px] border border-hairline px-2 py-1 text-[13px]" />
                      <Button onClick={() => editNote.mutate({ noteId: n.id, body: editBody })} disabled={editNote.isPending}>Save</Button>
                      <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-start justify-between gap-2">
                      <p className="text-[13px]">{n.body}</p>
                      <button onClick={() => { setEditingId(n.id); setEditBody(n.body); }}
                        className="shrink-0 text-[11px] text-neutral hover:text-ink">Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2">
              <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Add a note…"
                className="flex-1 rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]" />
              <Button disabled={!noteBody.trim() || addNote.isPending} onClick={() => addNote.mutate(noteBody)}>
                Add note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
