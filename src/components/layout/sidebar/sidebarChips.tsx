"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath, type NavItem } from "../shared/navigation";

// Mobile form of a section sidebar: a horizontally scrollable row above the content.
export function SidebarChips({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="-mx-3 mb-4 overflow-x-auto px-3 scrollbar-none md:hidden">
      <ul className="flex w-max gap-2">
        {items.map((item) => {
          const active = isActivePath(pathname, item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent-pink",
                  active
                    ? "bg-accent-lime text-bg-base"
                    : "bg-bg-surface-2 text-text-muted hover:text-text-primary",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
