"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath, type NavItem } from "../shared/navigation";

export function NavPills({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="flex min-w-0 items-center gap-1 rounded-full bg-bg-surface-2 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
    >
      {items.map((item) => {
        const active = isActivePath(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
              active ? "bg-accent-pink text-bg-base" : "text-text-muted hover:text-text-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
