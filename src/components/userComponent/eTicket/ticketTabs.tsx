"use client";

import Link from "next/link";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import type { Ticket } from "@/types/ticket";
import { EmptyState } from "../shared/emptyState";
import { TicketListItem } from "./ticketListItem";

function TicketGroup({ tickets, empty }: { tickets: Ticket[]; empty: string }) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        title={empty}
        description="Tickets you buy show up here as soon as the payment is confirmed."
        action={
          <Button asChild hoverScale={1} className="rounded-full">
            <Link href="/events">Browse events</Link>
          </Button>
        }
      />
    );
  }
  return (
    <ul className="space-y-3">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketListItem ticket={ticket} />
        </li>
      ))}
    </ul>
  );
}

export function TicketTabs({ upcoming, past }: { upcoming: Ticket[]; past: Ticket[] }) {
  return (
    <Tabs defaultValue="upcoming" className="gap-6">
      <TabsList className="h-11 w-full rounded-full bg-bg-surface p-1 sm:w-fit">
        <TabsTrigger value="upcoming" className="rounded-full px-5">Upcoming ({upcoming.length})</TabsTrigger>
        <TabsTrigger value="past" className="rounded-full px-5">Past ({past.length})</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value="upcoming">
          <TicketGroup tickets={upcoming} empty="No upcoming tickets" />
        </TabsContent>
        <TabsContent value="past">
          <TicketGroup tickets={past} empty="No past tickets yet" />
        </TabsContent>
      </TabsContents>
    </Tabs>
  );
}
