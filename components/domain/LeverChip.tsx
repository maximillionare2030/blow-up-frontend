export function LeverChip({ lever, value }: { lever: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface px-2 py-0.5 font-mono text-[11px] text-neutral">
      <svg aria-hidden width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
      </svg>
      {lever}: {value}
    </span>
  );
}
