"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import type { ReviewDecision } from "@/types/admin";

interface ReviewQueueProps<T> {
  items: T[];
  getId: (item: T) => string;
  isWaiting: (item: T) => boolean;
  /** Opened on load, from `?review=` (links on the dashboard). */
  initialOpenId?: string;
  renderTable: (items: T[], open: (id: string) => void) => ReactNode;
  renderDetail: (item: T, decide: (decision: ReviewDecision) => void) => ReactNode;
  /** The item after the decision, as the API would return it. */
  applyDecision: (item: T, decision: ReviewDecision, decidedAt: string) => T;
  sheetTitle: (item: T) => string;
  sheetDescription: (item: T) => string;
  emptyWaiting: string;
  /** Optional filters: the controls, and which items they keep. Decisions survive filter changes. */
  toolbar?: ReactNode;
  filter?: (item: T) => boolean;
}

// Shared by the event and organizer reviews: Waiting / Decided tabs, a table, and
// the detail with the decision in a side sheet. Decisions last until reload.
export function ReviewQueue<T>({
  items: initial,
  getId,
  isWaiting,
  initialOpenId,
  renderTable,
  renderDetail,
  applyDecision,
  sheetTitle,
  sheetDescription,
  emptyWaiting,
  toolbar,
  filter,
}: ReviewQueueProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(
    initialOpenId && initial.some((item) => getId(item) === initialOpenId) ? initialOpenId : null,
  );

  const visible = filter ? items.filter(filter) : items;
  const waiting = visible.filter(isWaiting);
  const decided = visible.filter((item) => !isWaiting(item));
  const open = items.find((item) => getId(item) === openId);

  function close() {
    setOpenId(null);
    // Drop ?review= so a refresh does not reopen it.
    router.replace(pathname, { scroll: false });
  }

  function decide(decision: ReviewDecision) {
    if (!open) return;
    const decidedAt = new Date().toISOString();
    setItems((current) => current.map((item) => (getId(item) === getId(open) ? applyDecision(item, decision, decidedAt) : item)));
  }

  const tabs = [
    { value: "waiting", label: `Waiting (${waiting.length})`, items: waiting, empty: emptyWaiting },
    { value: "decided", label: `Decided (${decided.length})`, items: decided, empty: "Decisions you make show up here." },
  ];

  return (
    <>
      <Tabs defaultValue="waiting" className="gap-6">
        {toolbar}
        <TabsList className="h-11 w-fit rounded-full bg-bg-surface p-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-full px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContents>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.items.length === 0 ? (
                <EmptyState title="Nothing here" description={tab.empty} />
              ) : (
                renderTable(tab.items, setOpenId)
              )}
            </TabsContent>
          ))}
        </TabsContents>
      </Tabs>

      <Sheet open={open !== undefined} onOpenChange={(next) => !next && close()}>
        <SheetContent data-lenis-prevent className="w-full gap-0 overflow-y-auto border-text-primary/10 bg-bg-surface sm:max-w-xl">
          {open && (
            <>
              <SheetHeader className="border-b border-text-primary/10 p-6 pr-12">
                <SheetTitle className="font-heading text-2xl">{sheetTitle(open)}</SheetTitle>
                <SheetDescription className="text-text-primary/70">{sheetDescription(open)}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 p-6">{renderDetail(open, decide)}</div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
