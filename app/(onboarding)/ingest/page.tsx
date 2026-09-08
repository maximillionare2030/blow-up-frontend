"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { fmt } from "@/lib/format";
import { Check } from "@/components/ui/Check";

export default function IngestPage() {
  const router = useRouter();
  const accounts = useQuery({
    queryKey: keys.accounts(),
    queryFn: () => api<any[]>("/api/v1/accounts"),
    refetchInterval: (query) => { const l = (query.state.data as any[] | undefined) ?? []; return l.length > 0 && l.every((a) => a.baseline_median_views != null) ? false : 2000; },
  });
  const list = accounts.data ?? [];
  const allDone = list.length > 0 && list.every((a) => a.baseline_median_views != null);
  useEffect(() => { if (allDone) router.push("/outliers"); }, [allDone, router]);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Reading your history.</h1>
      <p className="mt-2 text-[13px] text-neutral">
        We&rsquo;re computing what normal looks like for each account, so we can tell you when something isn&rsquo;t.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        {list.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-[10px] border border-hairline p-3">
            <span className="h-8 w-8 rounded-full bg-surface-2" />
            <span className="text-[13px] font-medium">{a.handle}</span>
            <span className="ml-auto font-mono text-[13px] text-neutral">
              {a.baseline_median_views != null
                ? <>
                    {a.videos_tracked} videos · median {fmt.views(a.baseline_median_views)} views <Check />
                  </>
                : a.videos_tracked > 0
                  ? `${a.videos_tracked} videos found · computing baseline…`
                  : "Pulling back catalogue…"}
            </span>
          </div>
        ))}
      </div>
      <p className="label-11 mt-6 text-center">This usually takes a minute</p>
    </div>
  );
}
