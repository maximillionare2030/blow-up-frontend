export function ProvenanceBadge({ provenance }: { provenance: "published" | "ingested" }) {
  const published = provenance === "published";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral">
      <span
        aria-hidden
        className={published
          ? "h-2 w-2 rounded-full bg-accent"
          : "h-2 w-2 rounded-full border border-neutral"}
      />
      {published ? "Published through BlowUp" : "Ingested"}
    </span>
  );
}
