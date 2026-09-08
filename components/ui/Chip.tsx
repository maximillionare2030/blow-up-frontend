export function Chip({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full border border-hairline px-2 py-0.5 text-[11px] ${className}`} {...props} />;
}
