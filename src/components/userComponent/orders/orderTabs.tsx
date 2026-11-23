"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { ButtonLink } from "../shared/buttonLink";
import { EmptyState } from "../shared/emptyState";

interface OrderGroup {
  value: string;
  label: string;
  /** Rendered order cards (built on the server), keyed by booking code. */
  cards: { id: string; node: ReactNode }[];
}

export function OrderTabs({ groups }: { groups: OrderGroup[] }) {
  return (
    <Tabs defaultValue={groups[0]?.value} className="gap-6">
      <div className="-mx-3 overflow-x-auto px-3 scrollbar-none sm:mx-0 sm:px-0">
        <TabsList className="h-11 w-max rounded-full bg-bg-surface p-1">
          {groups.map((group) => (
            <TabsTrigger key={group.value} value={group.value} className="rounded-full px-4">
              {group.label} ({group.cards.length})
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContents>
        {groups.map((group) => (
          <TabsContent key={group.value} value={group.value}>
            {group.cards.length === 0 ? (
              <EmptyState
                title="No orders here"
                description="Orders with this status show up in this list."
                action={
                  <ButtonLink href="/events" className="rounded-full">
                    Browse events
                  </ButtonLink>
                }
              />
            ) : (
              <ul className="space-y-3">
                {group.cards.map((card) => (
                  <li key={card.id}>{card.node}</li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </TabsContents>
    </Tabs>
  );
}
