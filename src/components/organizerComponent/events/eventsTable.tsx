import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrganizerEvent } from "@/types/organizer";
import { eventAction } from "../shared/eventAction";
import { SalesProgress } from "../shared/salesProgress";

export function EventsTable({ events }: { events: OrganizerEvent[] }) {
  if (events.length === 0) {
    return <EmptyState title="No events here" description="Events with this status will show up in this list." />;
  }

  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tickets sold</TableHead>
            <TableHead className="text-right">Gross sales</TableHead>
            <TableHead className="w-px">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const action = eventAction(event);
            return (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image src={event.poster_url} alt="" width={40} height={50} className="h-12 w-10 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="max-w-64 truncate font-semibold">{event.title}</p>
                      <p className="text-xs text-text-primary/70">{event.venue.city}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-text-primary/70">
                  {formatDate(event.starts_at, event.venue.timezone)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell>
                  <SalesProgress sold={event.tickets_sold} capacity={event.ticket_capacity} className="w-44" />
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatPrice(event.gross_revenue)}</TableCell>
                <TableCell>
                  <ButtonLink href={action.href} variant="outline" size="sm" className="rounded-full whitespace-nowrap">
                    {action.label}
                  </ButtonLink>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
