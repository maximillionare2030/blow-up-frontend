import Link from "next/link";
import { ProvenanceBadge } from "@/components/domain/ProvenanceBadge";
import { BaselineMultiple } from "@/components/domain/BaselineMultiple";
import { fmt } from "@/lib/format";

export function VideoCard({ row, badge }: { row: any; badge?: React.ReactNode }) {
  return (
    <Link href={`/videos/${row.id}`} className="block w-44 rounded-[10px] border border-hairline p-3 hover:border-ink">
      <div className="mb-2 aspect-[9/16] rounded-[6px] bg-surface-2" />
      <p className="truncate text-[13px]">{row.caption || "(no caption)"}</p>
      <p className="font-mono text-[13px] text-neutral">{fmt.views(row.views)} views</p>
      <div className="mt-1 flex items-center justify-between">
        {badge ?? <BaselineMultiple multiple={row.baseline_multiple} className="text-[15px]" />}
        <ProvenanceBadge provenance={row.provenance} compact />
      </div>
    </Link>
  );
}
