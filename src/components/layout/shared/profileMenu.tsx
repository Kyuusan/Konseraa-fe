"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ProfileLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface ProfileMenuProps {
  name: string;
  email: string;
  links: ProfileLink[];
  /** Avatar only, for the icon rail. Otherwise name and email show on wide screens. */
  compact?: boolean;
  /** "bottom-end": under the trigger (headbar). "right-end": beside it (rail). */
  placement?: "bottom-end" | "right-end";
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function ProfileMenu({
  name,
  email,
  links,
  compact = false,
  placement = "bottom-end",
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${name}`}
        className={cn(
          "flex min-w-0 cursor-pointer items-center rounded-full text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
          compact
            ? "size-11 justify-center"
            : "h-12 gap-3 bg-bg-surface-2 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-bg-surface-2/80",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-pink text-sm font-bold text-bg-base">
          {initials(name)}
        </span>
        {!compact && (
          <>
            <span className="hidden min-w-0 gap-0.5 pr-1 xl:grid">
              <span className="truncate text-sm font-semibold text-text-primary">{name}</span>
              <span className="truncate text-xs text-text-muted">{email}</span>
            </span>
            <ChevronDown className="mr-2 hidden size-4 shrink-0 text-text-muted xl:block" aria-hidden="true" />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 min-w-52 rounded-2xl bg-bg-surface-2 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
            placement === "bottom-end"
              ? "top-[calc(100%+8px)] right-0"
              : "bottom-0 left-[calc(100%+16px)]",
          )}
        >
          {compact && (
            <div className="px-3 pt-2 pb-2.5">
              <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
              <p className="truncate text-xs text-text-muted">{email}</p>
            </div>
          )}
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-text-primary outline-none hover:bg-text-primary/8 focus-visible:bg-text-primary/8"
            >
              <Icon className="size-4 text-text-muted" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
