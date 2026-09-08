"use client";

export default function ReferencesPage() {
  return (
    <div className="max-w-[900px]">
      <h1 className="text-2xl font-semibold mb-6">References.</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Paste a TikTok link"
          disabled
          className="rounded-[6px] border border-hairline px-3 py-2 text-[13px] bg-surface opacity-50 cursor-not-allowed"
        />
        <p className="text-[13px] text-neutral">Teardowns arrive with the Analyzer (Milestone 4).</p>
      </div>
    </div>
  );
}
