export function Button({ variant = "primary", className = "", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const styles = {
    primary: "bg-accent text-ink font-medium hover:brightness-95",
    secondary: "border border-hairline hover:border-ink",
    ghost: "text-neutral hover:text-ink",
  }[variant];
  return <button className={`rounded-[6px] px-3 py-1.5 text-[13px] disabled:opacity-40 ${styles} ${className}`} {...props} />;
}
