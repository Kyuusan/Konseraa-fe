"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/animate-ui/components/radix/progress";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PastShowReviews, Review, ReviewForm as ReviewFormValues } from "@/types/event";
import { EmptyState } from "../shared/emptyState";
import { ReviewForm } from "./reviewForm";
import { ReviewPhotos } from "./reviewPhotos";

function Rating({ value }: { value: number }) {
  return (
    <span role="img" aria-label={`${value} out of 5`} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          aria-hidden="true"
          className={cn("size-4", step <= value ? "fill-accent-lime text-accent-lime" : "text-text-primary/30")}
        />
      ))}
    </span>
  );
}

function ReviewSummary({ reviews, label }: { reviews: Review[]; label: string }) {
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="grid gap-5 rounded-[20px] bg-bg-surface p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8">
      <div>
        <p className="font-heading text-5xl font-bold">{average.toFixed(1)}</p>
        <Rating value={Math.round(average)} />
        <p className="mt-1 text-xs text-text-primary/70">{label}</p>
      </div>
      <ul className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter((review) => review.rating === stars).length;
          return (
            <li key={stars} className="grid grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 text-xs">
              <span className="text-text-primary/70">{stars} star</span>
              <Progress value={(count / reviews.length) * 100} aria-label={`${count} reviews with ${stars} stars`} className="h-1.5" />
              <span className="text-right tabular-nums text-text-primary/70">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReviewItems({ reviews, timeZone, ownId }: { reviews: Review[]; timeZone: string; ownId?: string }) {
  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li
          key={review.id}
          className={cn("space-y-2 rounded-2xl bg-bg-surface p-4", review.id === ownId && "ring-1 ring-accent-lime/50")}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">
              {review.user_full_name}
              {review.id === ownId && <span className="ml-2 text-xs font-medium text-accent-lime">Your review</span>}
            </span>
            <Rating value={review.rating} />
          </div>
          {/* Plain text only: user content is never rendered as HTML (no dangerouslySetInnerHTML, per rules). */}
          <p className="text-sm leading-relaxed whitespace-pre-line">{review.comment}</p>
          <ReviewPhotos photos={review.photo_urls} author={review.user_full_name} />
          <p className="text-xs text-text-primary/60">{formatDate(review.created_at, timeZone)}</p>
        </li>
      ))}
    </ul>
  );
}

interface ReviewsPanelProps {
  reviews: Review[];
  /** For a show that has not happened yet: reviews of the previous edition. */
  pastShow: PastShowReviews | null;
  eventEnded: boolean;
  /** Attended (checked in) and the show has ended. */
  canReview: boolean;
  reviewerName: string;
  timeZone: string;
}

export function ReviewList({ reviews: initial, pastShow, eventEnded, canReview, reviewerName, timeZone }: ReviewsPanelProps) {
  const [reviews, setReviews] = useState(initial);
  const [ownId, setOwnId] = useState<string>();

  function addReview(values: ReviewFormValues) {
    const id = crypto.randomUUID();
    setReviews((current) => [{ id, user_full_name: reviewerName, status: "published" as const, created_at: new Date().toISOString(), ...values }, ...current]);
    setOwnId(id);
  }

  if (!eventEnded) {
    return (
      <div className="space-y-5">
        <p className="rounded-2xl border border-text-primary/15 p-4 text-sm text-text-primary/80">
          Reviews for this show open after it ends, for fans who checked in.
          {pastShow && " Meanwhile, here is what fans said about the previous show."}
        </p>
        {pastShow ? (
          <>
            <ReviewSummary
              reviews={pastShow.reviews}
              label={`${pastShow.show_title} · ${formatDate(pastShow.show_date, timeZone)}`}
            />
            <ReviewItems reviews={pastShow.reviews} timeZone={timeZone} />
          </>
        ) : (
          <EmptyState title="No reviews yet" description="This is the first edition of the show." />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {canReview && !ownId && <ReviewForm onSubmit={addReview} />}
      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Attendees can share how the show went." />
      ) : (
        <>
          <ReviewSummary reviews={reviews} label={`From ${reviews.length} attendees`} />
          <ReviewItems reviews={reviews} timeZone={timeZone} ownId={ownId} />
        </>
      )}
    </div>
  );
}
