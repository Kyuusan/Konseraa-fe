"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";

export function HeadbarActions() {
  return (
    <div className="flex h-12 shrink-0 items-center rounded-full bg-bg-surface-2 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
      <Button
        variant="ghost"
        size="icon"
        hoverScale={1}
        aria-label="Notifications"
        className="relative size-9 rounded-full hover:bg-text-primary/8 [&_svg:not([class*='size-'])]:size-5"
      >
        <Bell aria-hidden="true" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-pink" />
      </Button>
    </div>
  );
}
