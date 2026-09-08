const VERBS: Record<string, string> = {
  reauthorize: "Reauthorize", reupload: "Re-upload",
  edit_caption: "Edit caption", retry: "Retry",
};
const CHIP: Record<string, string> = {
  not_yet_attempted: "border border-hairline text-neutral",
  queued: "bg-surface-2 text-neutral",
  live: "bg-positive/15 text-positive",
  failed: "bg-negative/15 text-negative",
  removed: "bg-surface-2 text-neutral line-through",
};
const LABEL: Record<string, string> = {
  not_yet_attempted: "not yet attempted", queued: "queued",
  live: "live", failed: "failed", removed: "removed",
};

export function PostState({ state, failureReason, failureAction, onAction }: {
  state: keyof typeof CHIP;
  failureReason?: string | null;
  failureAction?: string | null;
  onAction?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`rounded-full px-2 py-0.5 text-[11px] ${CHIP[state]}`}>{LABEL[state]}</span>
      {state === "failed" && (
        <>
          <span className="text-[11px] text-negative">{failureReason ?? "Post failed."}</span>
          <button onClick={onAction}
            className="rounded-[6px] border border-hairline px-2 py-0.5 text-[11px] hover:border-ink">
            {VERBS[failureAction ?? "retry"] ?? "Retry"}
          </button>
        </>
      )}
    </span>
  );
}
