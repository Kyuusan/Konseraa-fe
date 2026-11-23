import { TICKETS } from "@/__fixtures__/tickets";
import { TicketTabs } from "@/components/userComponent/eTicket/ticketTabs";
import { SectionTabs } from "@/components/userComponent/shared/sectionTabs";
import { TICKET_SECTIONS } from "@/components/userComponent/shared/ticketSections";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import type { TicketStatus } from "@/types/ticket";

/** Tickets that can no longer be used at the gate. */
const PAST_STATUSES: TicketStatus[] = ["checked_in", "transferred", "expired", "cancelled", "void"];

export default function Page() {
  const past = TICKETS.filter((ticket) => PAST_STATUSES.includes(ticket.status));
  const upcoming = TICKETS.filter((ticket) => !PAST_STATUSES.includes(ticket.status));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tickets"
        title="My tickets"
        description="Show the QR code at the gate to get in."
        actions={<SectionTabs label="Tickets and orders" items={TICKET_SECTIONS} />}
        actionsAlign="center"
      />
      <TicketTabs upcoming={upcoming} past={past} />
    </div>
  );
}
