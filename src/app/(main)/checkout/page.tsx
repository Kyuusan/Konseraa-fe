import { holdCartItems, PAYMENT_METHODS } from "@/__fixtures__/checkout";
import { getEventBySlug, getEventSessions, getEventTicketTiers } from "@/__fixtures__/events";
import { parseCheckoutSelection } from "@/components/userComponent/checkout/checkoutParams";
import { CheckoutView } from "@/components/userComponent/checkout/checkoutView";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const selection = parseCheckoutSelection(await searchParams);
  const event = selection ? getEventBySlug(selection.eventSlug) : undefined;
  const session = event && selection ? getEventSessions(event.id).find((item) => item.id === selection.sessionId) : undefined;

  if (!selection || !event || !session) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Checkout" title="Nothing to check out" />
        <EmptyState
          title="Your cart is empty"
          description="Choose tickets for an event to start checking out."
          action={
            <ButtonLink href="/events" hoverScale={1} className="rounded-full">Browse events</ButtonLink>
          }
        />
      </div>
    );
  }

  const tiers = getEventTicketTiers(event.id);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Checkout" title="Review and pay" />
      <CheckoutView
        event={event}
        session={session}
        tiers={tiers}
        cartItems={holdCartItems(selection.items, tiers, selection.heldUntil)}
        paymentMethods={PAYMENT_METHODS}
        selection={selection}
      />
    </div>
  );
}
