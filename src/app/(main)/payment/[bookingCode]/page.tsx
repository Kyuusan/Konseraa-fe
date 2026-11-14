import { notFound } from "next/navigation";
import { BookingSummaryCard } from "@/components/userComponent/payment/bookingSummaryCard";
import { loadPayment } from "@/components/userComponent/payment/loadPayment";
import { PaymentInstructions } from "@/components/userComponent/payment/paymentInstructions";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = {
  params: Promise<{ bookingCode: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { bookingCode } = await params;
  const data = loadPayment(bookingCode, await searchParams);
  if (!data) notFound();

  const { event, session, tiers, booking, method, promo, payment, query } = data;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Payment" title={`Pay with ${method.name}`} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <PaymentInstructions
          payment={payment}
          method={method}
          retryHref={`/events/${event.slug}/tickets?session=${session.id}`}
          successHref={`/payment/${booking.booking_code}/success?${query}`}
        />
        <aside aria-label="Booking summary">
          <BookingSummaryCard event={event} session={session} tiers={tiers} booking={booking} promoCode={promo} />
        </aside>
      </div>
    </div>
  );
}
