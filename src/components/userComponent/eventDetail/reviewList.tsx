import { Star } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/event";
import { EmptyState } from "../shared/emptyState";

interface ReviewListProps {
  reviews: Review[];
  eventEnded: boolean;
  timeZone: string;
}

function Rating({ value }: { value: number }) {
  return (
    <span role="img" aria-label={`${value} out of 5`} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          aria-hidden="true"
          className={cn("size-4", step <= value ? "fill-accent-lime text-accent-lime" : "text-text-muted")}
        />
      ))}
    </span>
  );
}

export function ReviewList({ reviews, eventEnded, timeZone }: ReviewListProps) {
  if (!eventEnded) {
    return (
      <EmptyState
        title="Reviews open after the show"
        description="Ticket holders who attended can rate the event once it has ended."
      />
    );
  }

  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first attendee to share how the show went." />;
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-muted">
        <span className="font-heading text-2xl font-semibold text-text-primary">{average.toFixed(1)}</span> / 5 from{" "}
        {reviews.length} attendees
      </p>
      <ul className="space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="space-y-2 rounded-2xl bg-bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{review.user_full_name}</span>
              <Rating value={review.rating} />
            </div>
            <p className="text-sm leading-relaxed">{review.comment}</p>
            <p className="text-xs text-text-muted">{formatDate(review.created_at, timeZone)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
