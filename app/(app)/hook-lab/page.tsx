"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { keys } from "@/lib/api/keys";
import { Button } from "@/components/ui/Button";
import { Filmstrip } from "@/components/hooklab/Filmstrip";
import { VariantList, type Variant } from "@/components/hooklab/VariantList";
import { uploadSource, slugify } from "@/lib/upload";

const LEVERS = [
  ["Text overlay", true], ["Trim point", false], ["Punch-in", false],
  ["Cover frame", false], ["Spoken first line", false],
] as const;

function HookLab() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultValue = params.get("value");
  const accounts = useQuery({ queryKey: keys.accounts(), queryFn: () => api<any[]>("/api/v1/accounts") });
  const [asset, setAsset] = useState<{ source_asset_id: string; objectUrl: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>(
    Array.from({ length: 4 }, (_, i) => ({
      text: i === 0 && defaultValue ? defaultValue.replace(/_/g, " ") : "",
      account_id: "", caption: "",
    })));

  const acctList = accounts.data ?? [];
  const filled = variants.filter((v) => v.text.trim());
  const ready = asset && filled.length > 0 && filled.every((v) => v.account_id || acctList[0]);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    setUploadError(null);
    try {
      setAsset(await uploadSource(f));
    } catch (err) {
      const detail = err instanceof Error && "detail" in err ? (err as any).detail : null;
      setUploadError(detail || "Upload failed — try again.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  function review() {
    const draft = {
      source_asset_id: asset!.source_asset_id,
      lever: "text_overlay",
      variants: filled.map((v) => ({
        value: slugify(v.text),
        account_id: v.account_id || acctList[0].id,
        caption: v.caption,
        scheduled_at: null,
      })),
    };
    sessionStorage.setItem("blowup-draft", JSON.stringify(draft));
    router.push("/publish-review");
  }

  return (
    <div className="flex gap-6">
      <aside className="w-[240px] shrink-0">
        {asset ? (
          <>
            <video src={asset.objectUrl} controls muted className="aspect-[9/16] w-full rounded-[10px] bg-surface-2" />
            <Button variant="ghost" className="mt-2 w-full" onClick={() => {
              URL.revokeObjectURL(asset.objectUrl);
              setAsset(null);
            }}>
              Replace video
            </Button>
          </>
        ) : (
          <label className="flex aspect-[9/16] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-hairline text-[13px] text-neutral hover:border-ink">
            <div>
              {busy ? "Uploading…" : "Drop a video or click to pick"}
              {uploadError && <p className="mt-2 text-red-500 text-[12px]">{uploadError}</p>}
            </div>
            <input type="file" accept="video/mp4,video/quicktime" className="hidden" onChange={pick} />
          </label>
        )}
        <div className="mt-4">
          <p className="label-11 mb-2">Lever</p>
          {LEVERS.map(([label, enabled]) => (
            <div key={label}
              className={`border-l-2 px-2 py-1.5 text-[13px] ${
                label === "Text overlay" ? "border-l-accent font-medium" : "border-l-transparent text-neutral"}`}
              title={enabled ? undefined : "Ships next"}>
              {label}{!enabled && label === "Spoken first line" && <span className="label-11 ml-1">soon</span>}
            </div>
          ))}
          <p className="mt-2 text-[11px] text-neutral">One lever per round. Changing two things tells you nothing.</p>
        </div>
      </aside>
      <section className="min-w-0 flex-1">
        {defaultValue && (
          <p className="mb-3 rounded-[6px] bg-accent/20 px-3 py-2 text-[13px]">
            «<span className="font-mono">{defaultValue}</span>» is your default — it won your last round.
          </p>
        )}
        {asset ? <Filmstrip src={asset.objectUrl} /> : (
          <p className="text-[13px] text-neutral">Upload a source video to see its first five seconds.</p>
        )}
      </section>
      <aside className="w-[360px] shrink-0">
        <p className="label-11 mb-2">Variants</p>
        <VariantList variants={variants} accounts={acctList}
          onChange={(i, patch) => setVariants((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)))} />
        <Button disabled variant="ghost" className="mt-2 w-full" title="Coming with the Analyzer">
          Generate more with AI
        </Button>
        <Button className="mt-3 w-full" disabled={!ready} onClick={review}>
          Review &amp; publish {filled.length || ""} variants →
        </Button>
      </aside>
    </div>
  );
}

export default function HookLabPage() {
  return <Suspense><HookLab /></Suspense>;
}
