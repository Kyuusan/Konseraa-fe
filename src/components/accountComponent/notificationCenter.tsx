"use client";

import { Briefcase, CalendarDays, CheckCheck, Info, ScanLine, Star, Ticket, Wallet, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types/notification";

const TIME_ZONE = "Asia/Jakarta";

const ICONS: Record<NotificationType, LucideIcon> = {
  booking: Ticket,
  event: CalendarDays,
  organizer: Briefcase,
  payout: Wallet,
  gate: ScanLine,
  review: Star,
  system: Info,
};

// Shared by every role. Marking as read stands in for PATCH calls and lasts until reload.
export function NotificationCenter({ notifications: initial }: { notifications: AppNotification[] }) {
  const [notifications, setNotifications] = useState(initial);
  const unread = notifications.filter((item) => !item.is_read);

  const markRead = (id: string) =>
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
  const markAllRead = () => setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));

  const tabs = [
    { value: "all", label: `All (${notifications.length})`, items: notifications },
    { value: "unread", label: `Unread (${unread.length})`, items: unread },
  ];

  return (
    <Tabs defaultValue="all" className="gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList className="h-11 rounded-full bg-bg-surface p-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-full px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button variant="ghost" hoverScale={1} onClick={markAllRead} disabled={unread.length === 0} className="rounded-full">
          <CheckCheck aria-hidden="true" />
          Mark all as read
        </Button>
      </div>
      <TabsContents>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.items.length === 0 ? (
              <EmptyState title="You're all caught up" description="New notifications will show up here." />
            ) : (
              <ul className="divide-y divide-text-primary/10 overflow-hidden rounded-[20px] bg-bg-surface">
                {tab.items.map((item) => (
                  <li key={item.id}>
                    <NotificationRow item={item} onOpen={() => markRead(item.id)} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </TabsContents>
    </Tabs>
  );
}

function NotificationRow({ item, onOpen }: { item: AppNotification; onOpen: () => void }) {
  const Icon = ICONS[item.type];
  const content = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          item.is_read ? "bg-bg-surface-2 text-text-primary/70" : "bg-accent-lime text-bg-base",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className={cn("block", item.is_read ? "font-medium text-text-primary/80" : "font-semibold")}>{item.title}</span>
        <span className="block text-sm text-text-primary/70">{item.body}</span>
        <span className="block text-xs text-text-primary/60">
          {formatDateTime(item.created_at, TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
        </span>
      </span>
      {!item.is_read && <span className="mt-2 size-2.5 shrink-0 rounded-full bg-accent-pink" aria-label="Unread" />}
    </>
  );

  const className = "flex items-start gap-4 p-5 text-left";
  return item.link ? (
    <Link
      href={item.link}
      onClick={onOpen}
      className={cn(className, "outline-none transition-colors hover:bg-bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-inset")}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>
      {content}
      {!item.is_read && (
        <Button variant="ghost" size="sm" hoverScale={1} onClick={onOpen} className="shrink-0 rounded-full">
          Mark as read
        </Button>
      )}
    </div>
  );
}
