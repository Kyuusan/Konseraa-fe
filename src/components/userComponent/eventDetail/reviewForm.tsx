"use client";

import { Star } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type ReviewForm as ReviewFormValues, ReviewFormSchema } from "@/types/event";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Unforgettable"];

// Stands in for POST /events/{id}/reviews (not in spec). Only attendees see it.
export function ReviewForm({ onSubmit }: { onSubmit: (review: ReviewFormValues) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ReviewFormSchema.safeParse({ rating, comment });
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      return;
    }
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-[20px] border border-accent-lime/40 bg-bg-surface p-5">
      <div className="space-y-1">
        <p className="font-heading text-lg font-semibold">You were there. How was it?</p>
        <p className="text-sm text-text-primary/70">Your review helps other fans pick their next show.</p>
      </div>

      <div className="space-y-2">
        <div role="radiogroup" aria-label="Your rating" className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="icon"
              hoverScale={1.1}
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} out of 5, ${LABELS[value]}`}
              onClick={() => {
                setRating(value);
                setErrors((current) => ({ ...current, rating: "" }));
              }}
              className="size-10 rounded-full hover:bg-text-primary/8"
            >
              <Star className={cn("size-6", value <= rating ? "fill-accent-lime text-accent-lime" : "text-text-primary/40")} />
            </Button>
          ))}
          <span className="ml-2 text-sm font-semibold">{LABELS[rating]}</span>
        </div>
        {errors.rating && <p className="text-sm text-danger">{errors.rating}</p>}
      </div>

      <FormField id="review-comment" label="Your review" hint="Sound, crowd, venue, getting in: what should others know?" error={errors.comment}>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setErrors((current) => ({ ...current, comment: "" }));
          }}
          aria-invalid={errors.comment ? true : undefined}
          rows={4}
          maxLength={1000}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
          Post review
        </Button>
      </div>
    </form>
  );
}
