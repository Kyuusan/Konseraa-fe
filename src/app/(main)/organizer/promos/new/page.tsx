import { getOrganizerEvents } from "@/__fixtures__/organizerEvents";
import { getPromos } from "@/__fixtures__/promos";
import { PromoForm } from "@/components/organizerComponent/promos/promoForm";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

/** Codes only make sense for events that are, or will be, on sale. */
const SELLABLE = ["published", "ongoing", "approved", "pending_review"];

export default async function Page() {
  await requireApprovedOrganizer();
  const events = getOrganizerEvents()
    .filter((event) => SELLABLE.includes(event.status))
    .map((event) => ({ id: event.id, title: event.title, min_price: event.min_price }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Promo codes"
        title="Create promo code"
        description="Set the discount, where it applies and how often it can be used."
        actions={
          <ButtonLink href="/organizer/promos" variant="outline" className="rounded-full">
            Cancel
          </ButtonLink>
        }
      />
      <PromoForm events={events} takenCodes={getPromos().map((promo) => promo.code)} />
    </div>
  );
}
