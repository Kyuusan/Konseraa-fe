import { getOrganizerEvents } from "@/__fixtures__/organizerEvents";
import { getPromos } from "@/__fixtures__/promos";
import { PromoList } from "@/components/organizerComponent/promos/promoList";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  await requireApprovedOrganizer();
  const eventTitles = Object.fromEntries(getOrganizerEvents().map((event) => [event.id, event.title]));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organizer"
        title="Promo codes"
        description="Discounts buyers enter at checkout. Codes that have been used can be turned off, but not deleted."
        actions={
          <ButtonLink href="/organizer/promos/new" hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
            Create promo code
          </ButtonLink>
        }
      />
      <PromoList promos={getPromos()} eventTitles={eventTitles} />
    </div>
  );
}
