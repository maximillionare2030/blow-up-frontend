import Link from "next/link";
import { ProvenanceBadge } from "@/components/domain/ProvenanceBadge";
import { PostState } from "@/components/domain/PostState";
import { BaselineMultiple } from "@/components/domain/BaselineMultiple";
import { LeverChip } from "@/components/domain/LeverChip";
import { fmt } from "@/lib/format";

export function VideoRow({ row }: { row: any }) {
  const tags = Object.entries(row.lever_tags ?? {});
  return (
    <Link href={`/videos/${row.id}`}
      className="grid h-12 grid-cols-[16px_1fr_120px_90px_90px_80px_1fr_140px] items-center gap-3 border-b border-hairline px-2 text-[13px] hover:border-l-2 hover:border-l-accent">
      <ProvenanceBadge provenance={row.provenance} compact />
      <span className="truncate">{row.caption || "(no caption)"}</span>
      <span className="truncate text-neutral">{row.handle}</span>
      <span className="font-mono text-neutral">{fmt.date(row.published_at)}</span>
      <span className="font-mono">{fmt.views(row.views)}</span>
      <BaselineMultiple multiple={row.baseline_multiple} />
      <span className="flex gap-1 overflow-hidden">
        {tags.length ? tags.map(([l, v]) => <LeverChip key={l} lever={l} value={String(v)} />)
          : <span className="text-neutral">—</span>}
      </span>
      <PostState state={row.post_state} failureReason={row.failure_reason} failureAction={row.failure_action} />
    </Link>
  );
}
