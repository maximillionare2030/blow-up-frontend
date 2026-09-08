"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { Button } from "@/components/ui/Button";
import { LeverChip } from "@/components/domain/LeverChip";

type DraftVariant = { value: string; account_id: string; caption: string; scheduled_at: string | null };
type Draft = { source_asset_id: string; lever: string; variants: DraftVariant[] };

export default function PublishReviewPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmed, setConfirmed] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("blowup-draft");
    if (raw) {
      const d = JSON.parse(raw) as Draft;
      setDraft(d);
      setConfirmed(d.variants.map(() => false));
    }
  }, []);

  const publish = useMutation({
    mutationFn: (d: Draft) => api("/api/v1/rounds/publish", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => {
      sessionStorage.removeItem("blowup-draft");
      qc.invalidateQueries({ queryKey: ["videos"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      router.push("/dashboard");
    },
  });

  if (!draft) {
    return (
      <p className="text-[13px] text-neutral">
        Nothing staged. <Link href="/hook-lab" className="underline">Back to the hook lab</Link>.
      </p>
    );
  }
  const allConfirmed = confirmed.length > 0 && confirmed.every(Boolean);
  const n = draft.variants.length;
  const accounts = new Set(draft.variants.map((v) => v.account_id)).size;

  function patch(i: number, p: Partial<DraftVariant>) {
    setDraft((d) => d && { ...d, variants: d.variants.map((v, j) => (j === i ? { ...v, ...p } : v)) });
  }

  return (
    <div className="max-w-[820px] pb-24">
      <h1 className="text-2xl font-semibold">Review before publishing.</h1>
      <p className="mt-1 font-mono text-[13px] text-neutral">{n} variants · {accounts} account{accounts > 1 ? "s" : ""}</p>
      <div className="mt-6 flex flex-col gap-3">
        {draft.variants.map((v, i) => (
          <div key={i} className={`flex items-center gap-4 rounded-[10px] border p-3 ${
            confirmed[i] ? "border-accent" : "border-hairline"}`}>
            <div className="h-[120px] w-[68px] shrink-0 rounded-[6px] bg-surface-2" />
            <div className="min-w-0 flex-1">
              <LeverChip lever={draft.lever} value={v.value} />
              <input value={v.caption} onChange={(e) => patch(i, { caption: e.target.value })}
                aria-label={`Caption for cell ${i + 1}`}
                className="mt-2 w-full rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]" />
              <div className="mt-2 flex items-center gap-3">
                <input type="datetime-local" aria-label={`Schedule for cell ${i + 1}`}
                  onChange={(e) => patch(i, { scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="rounded-[6px] border border-hairline px-2 py-1 font-mono text-[11px]" />
                <span className="text-[11px] text-neutral">blank = publish now · Public — from your TikTok account settings</span>
              </div>
            </div>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={confirmed[i] ?? false}
                onChange={(e) => setConfirmed((c) => c.map((x, j) => (j === i ? e.target.checked : x)))} />
              Confirmed
            </label>
          </div>
        ))}
      </div>
      <footer className="fixed bottom-0 left-[220px] right-0 flex items-center gap-4 border-t border-hairline bg-white px-6 py-3">
        <span className="font-mono text-[13px]">{confirmed.filter(Boolean).length} of {n} confirmed</span>
        <span className="text-[11px] text-neutral">Nothing publishes until you confirm every cell.</span>
        <div className="ml-auto flex gap-2">
          <Link href="/hook-lab" className="rounded-[6px] px-3 py-1.5 text-[13px] text-neutral hover:text-ink">
            Back to hook lab
          </Link>
          <Button disabled={!allConfirmed || publish.isPending} onClick={() => publish.mutate(draft)}>
            Publish {n} posts
          </Button>
        </div>
      </footer>
    </div>
  );
}
