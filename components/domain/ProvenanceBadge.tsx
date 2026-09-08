export function ProvenanceBadge({ provenance, compact = false }: {
  provenance: "published" | "ingested";
  compact?: boolean;
}) {
  const published = provenance === "published";
  const label = published ? "Published through BlowUp" : "Ingested";
  const dot = (
    <span
      aria-hidden
      className={published
        ? "h-2 w-2 rounded-full bg-accent"
        : "h-2 w-2 rounded-full border border-neutral"}
    />
  );
  if (compact) {
    return (
      <span className="inline-flex items-center text-[11px] text-neutral" title={label}>
        {dot}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral">
      {dot}
      {label}
    </span>
  );
}
