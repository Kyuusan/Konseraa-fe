import { notFound } from "next/navigation";
import { getEventBySlug, getEventSessions } from "@/__fixtures__/events";
import { canReviewEvent, getPastShowReviews, getShowReviews } from "@/__fixtures__/reviews";
import { getCurrentSession } from "@/__fixtures__/session";
import { BookingPanel } from "@/components/userComponent/eventDetail/bookingPanel";
import { EventHero } from "@/components/userComponent/eventDetail/eventHero";
import { EventTabs } from "@/components/userComponent/eventDetail/eventTabs";
import { LineupList } from "@/components/userComponent/eventDetail/lineupList";
import { ReviewList } from "@/components/userComponent/eventDetail/reviewList";
import { SeatMapPreview } from "@/components/userComponent/shared/seatMapPreview";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const TABS = ["description", "lineup", "reviews"] as const;

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const { user } = await getCurrentSession();
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const sessions = getEventSessions(event.id);
  const timeZone = event.venue.timezone;

  return (
    <div className="grid gap-8 pt-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      <div className="space-y-10">
        <EventHero event={event} />
        <EventTabs
          initialTab={TABS.find((item) => item === tab) ?? "description"}
          description={event.description}
          lineup={<LineupList sessions={sessions} timeZone={timeZone} />}
          reviews={
            <ReviewList
              reviews={getShowReviews(event)}
              pastShow={getPastShowReviews(event)}
              eventEnded={event.status === "completed"}
              canReview={canReviewEvent(event)}
              reviewerName={user.full_name}
              timeZone={timeZone}
            />
          }
        />
      </div>
      <aside aria-label="Book tickets" className="lg:pt-0">
        <div className="space-y-4 lg:sticky lg:top-28">
          <BookingPanel event={event} sessions={sessions} />
          {event.seat_map_url && <SeatMapPreview src={event.seat_map_url} eventTitle={event.title} />}
        </div>
      </aside>
    </div>
  );
}
