import { getEventAnalytics } from "@/__fixtures__/analytics";
import { getOrganizerEvents } from "@/__fixtures__/organizerEvents";
import { ArrivalsHeatmap } from "@/components/organizerComponent/analytics/arrivalsHeatmap";
import { DailySalesChart } from "@/components/organizerComponent/analytics/dailySalesChart";
import { EventPicker } from "@/components/organizerComponent/analytics/eventPicker";
import { TierBreakdownTable } from "@/components/organizerComponent/analytics/tierBreakdownTable";
import { EventStats } from "@/components/organizerComponent/eventDetail/eventStats";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Only events that have been on sale have numbers to show. */
const WITH_SALES = ["published", "ongoing", "completed"];

export default async function Page({ searchParams }: PageProps) {
  await requireApprovedOrganizer();
  const events = getOrganizerEvents().filter((event) => WITH_SALES.includes(event.status));
  const requested = param(await searchParams, "event");
  const event = events.find((item) => item.slug === requested) ?? events[0];

  const header = (
    <PageHeader eyebrow="Organizer" title="Analytics" description="How each event is selling and when people arrive." />
  );

  if (!event) {
    return (
      <div className="space-y-8">
        {header}
        <EmptyState title="Nothing to analyse yet" description="Numbers show up here once one of your events goes on sale." />
      </div>
    );
  }

  const analytics = getEventAnalytics(event);

  return (
    <div className="space-y-6">
      {header}
      <EventPicker events={events.map(({ slug, title }) => ({ slug, title }))} value={event.slug} />
      <EventStats event={event} />
      <DailySalesChart daily={analytics.daily} windowTickets={analytics.window_tickets} windowGross={analytics.window_gross} />

      <section aria-labelledby="tiers-heading" className="space-y-4 pt-2">
        <SectionHeader id="tiers-heading" title="Sales by tier" description="Sold against each tier's quota per session." />
        <TierBreakdownTable tiers={analytics.tiers} />
      </section>

      <section aria-labelledby="arrivals-heading" className="space-y-4 pt-2">
        <SectionHeader id="arrivals-heading" title="Arrivals by time" description="When ticket holders came through the gates." />
        {analytics.arrivals ? (
          <ArrivalsHeatmap arrivals={analytics.arrivals} />
        ) : (
          <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">
            Shows once the gates of a session have opened.
          </p>
        )}
      </section>
    </div>
  );
}
