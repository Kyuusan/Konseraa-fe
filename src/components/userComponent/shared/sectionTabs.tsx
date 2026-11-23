"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SectionTabsProps {
  label: string;
  items: { href: string; label: string }[];
}

// Tabs that switch between sibling pages (e.g. My tickets / My orders). Filled lime
// when active, so they read differently from the smaller filter tabs inside a page.
export function SectionTabs({ label, items }: SectionTabsProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="max-w-full overflow-x-auto scrollbar-none">
      <ul className="flex w-max gap-1 rounded-full bg-bg-surface p-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center rounded-full px-6 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
                  active ? "bg-accent-lime text-bg-base" : "text-text-primary/70 hover:text-text-primary",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
