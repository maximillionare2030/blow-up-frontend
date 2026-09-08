export function EvidenceClass({ isExploratory, children }: {
  isExploratory: boolean; children: React.ReactNode;
}) {
  if (!isExploratory) {
    return <div className="rounded-[10px] border border-hairline bg-white p-4">{children}</div>;
  }
  return (
    <div
      className="rounded-[10px] border border-dashed border-hairline p-4"
      style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(24,24,27,0.04) 0 6px, transparent 6px 12px)" }}
    >
      <span className="label-11 mb-2 inline-block rounded-full border border-hairline px-2 py-0.5">Exploratory</span>
      {children}
    </div>
  );
}
