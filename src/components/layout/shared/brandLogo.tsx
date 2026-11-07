import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href: string;
  /** Small label after the wordmark, e.g. "Admin". */
  tag?: string;
  className?: string;
}

export function BrandLogo({ href, tag, className }: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-bg-surface-2 px-5 font-logo text-sm uppercase tracking-widest text-text-primary shadow-[0_8px_24px_rgba(0,0,0,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-accent-pink",
        tag && "pr-2",
        className,
      )}
    >
      Konsera
      {tag && (
        <span className="rounded-full bg-accent-lime px-2.5 py-1 font-sans text-[11px] font-bold tracking-wider text-bg-base">
          {tag}
        </span>
      )}
    </Link>
  );
}
