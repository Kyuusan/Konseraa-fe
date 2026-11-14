import { notFound } from "next/navigation";
import { getTicket, getTicketQrToken } from "@/__fixtures__/tickets";
import { ETicketView } from "@/components/userComponent/eTicket/eTicketView";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = getTicket(id);
  if (!ticket) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="E-ticket"
        title={ticket.event_title}
        actions={
          <ButtonLink href="/tickets" variant="outline" hoverScale={1} className="rounded-full">All tickets</ButtonLink>
        }
      />
      <ETicketView ticket={ticket} qrToken={getTicketQrToken(ticket)} />
    </div>
  );
}
