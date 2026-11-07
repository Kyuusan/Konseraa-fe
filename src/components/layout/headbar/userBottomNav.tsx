"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath, type NavItem } from "../shared/navigation";

// Mobile replacement for the nav pills, which don't fit next to the logo and actions.
export function UserBottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid rounded-full bg-bg-surface-2 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] md:hidden"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const active = isActivePath(pathname, item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-14 flex-col items-center justify-center gap-1 rounded-full text-[11px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
              active ? "bg-accent-pink text-bg-base" : "text-text-muted",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
