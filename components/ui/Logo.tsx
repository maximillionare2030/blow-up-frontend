import Image from "next/image";
import Link from "next/link";

export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="BlowUp logo"
      width={size}
      height={size}
      className={className}
      unoptimized
      priority
    />
  );
}

export function Logo({
  size = 32,
  wordmarkClassName = "font-bold text-lg tracking-tight",
  href = "/",
}: {
  size?: number;
  wordmarkClassName?: string;
  href?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-1.5">
      <LogoMark size={size} />
      <span className={wordmarkClassName}>BlowUp</span>
    </Link>
  );
}
