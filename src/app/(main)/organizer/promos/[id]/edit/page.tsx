import { notFound } from "next/navigation";
import { getOrganizerEvents } from "@/__fixtures__/organizerEvents";
import { getPromos } from "@/__fixtures__/promos";
import { PromoForm } from "@/components/organizerComponent/promos/promoForm";
import { PROMO_TIME_ZONE } from "@/components/organizerComponent/promos/promoFormat";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { params: Promise<{ id: string }> };

/** Codes only make sense for events that are, or will be, on sale. */
const SELLABLE = ["published", "ongoing", "approved", "pending_review"];

const dayOf = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: PROMO_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

export default async function Page({ params }: PageProps) {
  await requireApprovedOrganizer();
  const { id } = await params;
  const promos = getPromos();
  const promo = promos.find((item) => item.id === id);
  if (!promo) notFound();

  const back = (
    <ButtonLink href="/organizer/promos" variant="outline" className="rounded-full">
      Cancel
    </ButtonLink>
  );

  // Codes that were used stay as they are, so past bookings keep their discount history.
  if (promo.used_count > 0) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Promo codes" title={`Edit ${promo.code}`} actions={back} />
        <EmptyState
          title="This code has been used"
          description="Used codes can't be edited. Turn it off and create a new one instead."
          action={back}
        />
      </div>
    );
  }

  const events = getOrganizerEvents()
    .filter((event) => SELLABLE.includes(event.status))
    .map((event) => ({ id: event.id, title: event.title, min_price: event.min_price }));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Promo codes" title={`Edit ${promo.code}`} description="Nobody has used this code yet, so everything can still change." actions={back} />
      <PromoForm
        events={events}
        takenCodes={promos.filter((item) => item.id !== promo.id).map((item) => item.code)}
        initial={{
          code: promo.code,
          discount_type: promo.discount_type,
          discount_value: String(promo.discount_value),
          max_discount_amount: promo.max_discount_amount ? String(promo.max_discount_amount) : "",
          event_id: promo.event_id ?? "all",
          usage_limit: String(promo.usage_limit),
          per_user_limit: String(promo.per_user_limit),
          starts_on: dayOf(promo.starts_at),
          ends_on: dayOf(promo.ends_at),
        }}
      />
    </div>
  );
}
