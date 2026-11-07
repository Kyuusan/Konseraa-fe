"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

export function MobileDrawer({ open, onClose, label, children }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-50 md:hidden", !open && "pointer-events-none")}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-bg-base/75 transition-opacity motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        inert={!open}
        data-lenis-prevent
        className={cn(
          "absolute inset-y-0 left-0 flex w-[min(85vw,320px)] flex-col gap-4 overflow-y-auto bg-bg-surface-2 p-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-transform duration-300 motion-reduce:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-11 cursor-pointer items-center justify-center self-end rounded-full text-text-primary outline-none hover:bg-text-primary/8 focus-visible:ring-2 focus-visible:ring-accent-pink"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
