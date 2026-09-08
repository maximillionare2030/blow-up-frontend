"use client";
import { LeverChip } from "@/components/domain/LeverChip";
import { slugify } from "@/lib/upload";

export type Variant = { text: string; account_id: string; caption: string };

export function VariantList({ variants, accounts, onChange }: {
  variants: Variant[];
  accounts: { id: string; handle: string }[];
  onChange: (i: number, v: Partial<Variant>) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-[10px] border border-hairline bg-surface p-3">
        <p className="text-[13px] font-medium">Original</p>
        <p className="text-[11px] text-neutral">No overlay. Your control cell.</p>
      </div>
      {variants.map((v, i) => (
        <div key={i} className="rounded-[10px] border border-hairline p-3">
          <input value={v.text} onChange={(e) => onChange(i, { text: e.target.value })}
            placeholder={`Overlay text ${i + 1}`} aria-label={`Overlay text ${i + 1}`}
            className="w-full rounded-[6px] border border-hairline px-2 py-1.5 text-[13px]" />
          <div className="mt-2 flex items-center justify-between gap-2">
            <LeverChip lever="text_overlay" value={slugify(v.text)} />
            <select value={v.account_id} onChange={(e) => onChange(i, { account_id: e.target.value })}
              aria-label={`Account for variant ${i + 1}`}
              className="rounded-[6px] border border-hairline px-2 py-1 text-[11px]">
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.handle}</option>)}
            </select>
          </div>
          <input value={v.caption} onChange={(e) => onChange(i, { caption: e.target.value })}
            placeholder="Caption #fyp" aria-label={`Caption for variant ${i + 1}`}
            className="mt-2 w-full rounded-[6px] border border-hairline px-2 py-1.5 text-[11px]" />
        </div>
      ))}
    </div>
  );
}
