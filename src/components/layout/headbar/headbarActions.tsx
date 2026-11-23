"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/animate-ui/components/buttons/button";

interface HeadbarActionsProps {
  /** The role's notifications page. */
  notificationsHref: string;
  unread: number;
}

export function HeadbarActions({ notificationsHref, unread }: HeadbarActionsProps) {
  return (
    <div className="flex h-12 shrink-0 items-center rounded-full bg-bg-surface-2 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
      <Button
        asChild
        variant="ghost"
        size="icon"
        hoverScale={1}
        className="relative size-9 rounded-full hover:bg-text-primary/8 [&_svg:not([class*='size-'])]:size-5"
      >
        <Link href={notificationsHref} aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}>
          <Bell aria-hidden="true" />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-pink" />}
        </Link>
      </Button>
    </div>
  );
}
