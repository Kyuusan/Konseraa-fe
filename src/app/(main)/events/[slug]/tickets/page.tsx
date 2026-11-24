import { notFound } from "next/navigation";
import { getEventBySlug, getEventSessions, getEventTicketTiers } from "@/__fixtures__/events";
import { getVenueLayout } from "@/__fixtures__/venueLayouts";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { VenueSeatMap } from "@/components/userComponent/shared/venueSeatMap";
import { TierSelector } from "@/components/userComponent/ticketSelection/tierSelector";
import { formatDate, formatTime } from "@/lib/format";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const sessions = getEventSessions(event.id);
  const requested = param(await searchParams, "session");
  const session = sessions.find((item) => item.id === requested) ?? sessions[0];
  const timeZone = event.venue.timezone;
  const tiers = getEventTicketTiers(event.id);
  const layout = getVenueLayout(event.venue.id);

  const backLink = (
    <ButtonLink href={`/events/${event.slug}`} variant="outline" hoverScale={1} className="rounded-full">Back to event</ButtonLink>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Choose tickets"
        title={event.title}
        description={
          session
            ? `${session.name} · ${formatDate(session.start_at, timeZone)} · ${formatTime(session.start_at, timeZone)} · ${event.venue.name}`
            : event.venue.name
        }
        actions={backLink}
      />
      {event.status === "published" && session ? (
        <TierSelector
          eventSlug={event.slug}
          sessionId={session.id}
          tiers={tiers}
          seatMap={
            layout.sections.length > 0 ? (
              <VenueSeatMap
                variant="inline"
                layout={layout}
                tiers={tiers}
                eventTitle={event.title}
                description="Match each tier to its area. Not to scale."
              />
            ) : undefined
          }
        />
      ) : (
        <EmptyState
          title="Ticket sales are closed"
          description="This event is no longer selling tickets."
          action={backLink}
        />
      )}
    </div>
  );
}
