"use client";

import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import type { OrganizerEvent } from "@/types/organizer";
import { EventsTable } from "./eventsTable";
import { groupEventsByStatus, type StatusFilterValue } from "./statusFilters";

interface EventsByStatusProps {
  events: OrganizerEvent[];
  initialStatus: StatusFilterValue;
}

export function EventsByStatus({ events, initialStatus }: EventsByStatusProps) {
  const groups = groupEventsByStatus(events);

  return (
    <Tabs defaultValue={initialStatus} className="gap-6">
      <div className="-mx-3 overflow-x-auto px-3 scrollbar-none sm:mx-0 sm:px-0">
        <TabsList className="h-11 w-max rounded-full bg-bg-surface p-1">
          {groups.map((group) => (
            <TabsTrigger key={group.value} value={group.value} className="rounded-full px-4">
              {group.label} ({group.events.length})
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContents>
        {groups.map((group) => (
          <TabsContent key={group.value} value={group.value}>
            <EventsTable events={group.events} />
          </TabsContent>
        ))}
      </TabsContents>
    </Tabs>
  );
}
