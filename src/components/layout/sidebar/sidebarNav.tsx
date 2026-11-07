"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath, type NavItem } from "../shared/navigation";
import { SidebarTooltip } from "./sidebarTooltip";

interface SidebarNavProps {
  items: NavItem[];
  label: string;
  /** "rail": icon only with a hover tooltip. "full": icon + label (mobile drawer). */
  variant?: "rail" | "full";
  onNavigate?: () => void;
}

export function SidebarNav({ items, label, variant = "rail", onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const rail = variant === "rail";

  return (
    <nav aria-label={label}>
      <ul className={cn("flex flex-col gap-1", rail && "items-center")}>
        {items.map((item) => {
          const active = isActivePath(pathname, item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/rail relative flex items-center rounded-full text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
                  rail ? "size-11 justify-center" : "h-11 gap-3 px-4",
                  active
                    ? "bg-accent-lime text-bg-base"
                    : "text-text-muted hover:bg-text-primary/8 hover:text-text-primary",
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {rail ? (
                  <>
                    <span className="sr-only">{item.label}</span>
                    <SidebarTooltip label={item.label} />
                  </>
                ) : (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
