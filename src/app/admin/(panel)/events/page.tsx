import { EVENT_REVIEWS } from "@/__fixtures__/adminReviews";
import { EventReviews } from "@/components/adminComponent/reviews/eventReviews";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const review = param(await searchParams, "review");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Event reviews"
        description="Every event is checked with its own permit. Approving publishes it right away; rejecting sends the reason to the organizer."
      />
      <EventReviews items={EVENT_REVIEWS} initialOpenId={review} />
    </div>
  );
}
