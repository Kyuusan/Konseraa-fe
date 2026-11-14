import { notFound } from "next/navigation";
import { getEventBySlug, getEventReviews, getEventSessions } from "@/__fixtures__/events";
import { BookingPanel } from "@/components/userComponent/eventDetail/bookingPanel";
import { EventHero } from "@/components/userComponent/eventDetail/eventHero";
import { EventTabs } from "@/components/userComponent/eventDetail/eventTabs";
import { LineupList } from "@/components/userComponent/eventDetail/lineupList";
import { ReviewList } from "@/components/userComponent/eventDetail/reviewList";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const sessions = getEventSessions(event.id);
  const timeZone = event.venue.timezone;

  return (
    <div className="grid gap-8 pt-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      <div className="space-y-10">
        <EventHero event={event} />
        <EventTabs
          description={event.description}
          lineup={<LineupList sessions={sessions} timeZone={timeZone} />}
          reviews={
            <ReviewList reviews={getEventReviews(event.id)} eventEnded={event.status === "completed"} timeZone={timeZone} />
          }
        />
      </div>
      <aside aria-label="Book tickets" className="lg:pt-0">
        <div className="lg:sticky lg:top-28">
          <BookingPanel event={event} sessions={sessions} />
        </div>
      </aside>
    </div>
  );
}
