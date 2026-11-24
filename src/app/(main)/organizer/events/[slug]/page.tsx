import { notFound, redirect } from "next/navigation";
import { getOrganizerEventDetail } from "@/__fixtures__/organizerEvents";
import { getVenueLayout } from "@/__fixtures__/venueLayouts";
import { EventContentForm } from "@/components/organizerComponent/eventDetail/eventContentForm";
import { EventFacts } from "@/components/organizerComponent/eventDetail/eventFacts";
import { EventStats } from "@/components/organizerComponent/eventDetail/eventStats";
import { EventStatusNotice } from "@/components/organizerComponent/eventDetail/eventStatusNotice";
import { SessionList } from "@/components/organizerComponent/eventDetail/sessionList";
import { TierTable } from "@/components/organizerComponent/eventDetail/tierTable";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { VenueSeatMap } from "@/components/userComponent/shared/venueSeatMap";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDate } from "@/lib/format";

type PageProps = { params: Promise<{ slug: string }> };

/** Live events: only the banner and description stay editable. */
const EDITABLE = ["approved", "published", "ongoing"];
/** Events that have been on sale have sales figures and a public page. */
const ON_SALE = ["published", "ongoing", "completed"];

export default async function Page({ params }: PageProps) {
  await requireApprovedOrganizer();
  const { slug } = await params;
  const detail = getOrganizerEventDetail(slug);
  if (!detail) notFound();

  const { event, sessions, tiers } = detail;
  if (event.status === "draft") redirect(`/organizer/events/new?draft=${event.slug}`);

  const editable = EDITABLE.includes(event.status);
  const onSale = ON_SALE.includes(event.status);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My events"
        title={event.title}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={event.status} />
            {formatDate(event.starts_at, event.venue.timezone)} · {event.venue.name}, {event.venue.city}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/organizer/events" variant="outline" className="h-11 rounded-full px-5">
              All events
            </ButtonLink>
            {onSale && (
              <ButtonLink href={`/events/${event.slug}`} hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
                View public page
              </ButtonLink>
            )}
          </div>
        }
      />

      <EventStatusNotice event={event} />
      {onSale && <EventStats event={event} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="sessions-heading" className="space-y-4">
            <SectionHeader id="sessions-heading" title="Sessions" description={`Times in ${event.venue.timezone}.`} />
            <SessionList sessions={sessions} timeZone={event.venue.timezone} />
          </section>
          <section aria-labelledby="tiers-heading" className="space-y-4">
            <SectionHeader id="tiers-heading" title="Ticket tiers" description="Quota is per session." />
            <TierTable tiers={tiers} />
          </section>
          <VenueSeatMap
            layout={getVenueLayout(event.venue.id)}
            tiers={tiers}
            eventTitle={event.title}
            description="Built from the venue's sections. Buyers see it on the event and ticket pages."
          />
        </div>

        <div className="space-y-6">
          {editable && <EventContentForm bannerUrl={event.banner_url} description={event.description} />}
          <EventFacts
            event={event}
            showContent={!editable}
            note={editable ? "Locked after publishing." : undefined}
          />
        </div>
      </div>
    </div>
  );
}
