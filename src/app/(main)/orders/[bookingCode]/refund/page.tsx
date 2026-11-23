import Image from "next/image";
import { notFound } from "next/navigation";
import { getUserOrder } from "@/__fixtures__/orders";
import { RefundRequestForm } from "@/components/userComponent/orders/refundRequestForm";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { TicketCard } from "@/components/userComponent/shared/ticketCard";
import { REFUND_CLOSES_DAYS_BEFORE } from "@/lib/constants";
import { formatDate, formatPrice, formatTime } from "@/lib/format";

type PageProps = { params: Promise<{ bookingCode: string }> };

export default async function Page({ params }: PageProps) {
  const { bookingCode } = await params;
  const order = getUserOrder(bookingCode);
  if (!order?.refund) notFound();

  const { refund } = order;
  const timeZone = order.venue_timezone;
  const back = (
    <ButtonLink href="/orders" variant="outline" className="rounded-full">
      My orders
    </ButtonLink>
  );

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Refund" title={`Refund ${order.booking_code}`} description={order.event_title} actions={back} />

      {refund.eligible ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <RefundRequestForm amount={refund.amount} ticketCount={order.ticket_count} />

          <aside aria-label="Order" className="space-y-4">
            <TicketCard className="space-y-4 p-5">
              <div className="flex gap-4">
                <Image src={order.poster_url} alt="" width={64} height={80} className="h-20 w-16 rounded-xl object-cover" />
                <div className="min-w-0 space-y-1">
                  <p className="font-heading text-lg leading-tight font-semibold">{order.event_title}</p>
                  <p className="text-sm text-text-primary/70">
                    {order.session_name} · {formatDate(order.session_start_at, timeZone)} · {formatTime(order.session_start_at, timeZone)}
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-text-primary/10 text-sm">
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-text-primary/70">Tickets</dt>
                  <dd className="font-medium">{order.ticket_count}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-text-primary/70">You paid</dt>
                  <dd className="font-medium">{formatPrice(order.total_amount)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="font-semibold">Refund</dt>
                  <dd className="font-heading text-xl font-bold">{formatPrice(refund.amount)}</dd>
                </div>
              </dl>
            </TicketCard>
            <p className="text-sm text-text-primary/70">
              You get the full amount back, fees included. Requests close {REFUND_CLOSES_DAYS_BEFORE} days before the show
              {refund.deadline && ` (${formatDate(refund.deadline, timeZone)}, venue time)`}, and the organizer decides.
            </p>
          </aside>
        </div>
      ) : (
        <EmptyState
          title={refund.request ? "Refund already requested" : "This order can't be refunded"}
          description={
            refund.request
              ? "The organizer is reviewing your request. We'll notify you when they decide."
              : (refund.blocked_reason ?? "The show has already happened.")
          }
          action={back}
        />
      )}
    </div>
  );
}
