export function GoogleAuthButton({ label }: { label: string }) {
  return (
    <a
      href="/api/v1/auth/google/start"
      className="flex w-full items-center justify-center rounded-[6px] border border-hairline px-3 py-2 text-[13px] font-medium hover:bg-surface"
    >
      {label}
    </a>
  );
}
