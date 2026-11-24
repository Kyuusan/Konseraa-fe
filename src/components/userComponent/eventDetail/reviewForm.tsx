"use client";

import { Star, X } from "lucide-react";
import Image from "next/image";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MAX_REVIEW_PHOTOS, type ReviewForm as ReviewFormValues, ReviewFormSchema } from "@/types/event";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Unforgettable"];
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Stands in for POST /events/{id}/reviews (not in spec). Only attendees see it.
export function ReviewForm({ onSubmit }: { onSubmit: (review: ReviewFormValues) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  // Local previews; the real upload would return storage URLs for reviews.photo_urls.
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const picked = Array.from(files);
    const valid = picked.filter((file) => PHOTO_TYPES.includes(file.type) && file.size <= MAX_PHOTO_BYTES);
    const room = MAX_REVIEW_PHOTOS - photos.length;
    const added = valid.slice(0, room).map((file) => URL.createObjectURL(file));
    setPhotos((current) => [...current, ...added]);
    setErrors((current) => ({
      ...current,
      photo_urls:
        valid.length < picked.length
          ? "Use JPG, PNG or WebP images up to 5 MB."
          : valid.length > room
            ? `Only ${MAX_REVIEW_PHOTOS} photos per review.`
            : "",
    }));
  }

  function removePhoto(url: string) {
    URL.revokeObjectURL(url);
    setPhotos((current) => current.filter((photo) => photo !== url));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ReviewFormSchema.safeParse({ rating, comment, photo_urls: photos });
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

      <div className="space-y-2">
        <p className="text-sm font-medium">Photos (optional)</p>
        {photos.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {photos.map((photo, index) => (
              <li key={photo} className="relative size-20 overflow-hidden rounded-xl bg-bg-surface-2">
                <Image src={photo} alt={`Photo ${index + 1}`} fill unoptimized sizes="80px" className="object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  hoverScale={1}
                  onClick={() => removePhoto(photo)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-1 right-1 size-6 rounded-full bg-bg-base/80 p-0 hover:bg-bg-base"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        {photos.length < MAX_REVIEW_PHOTOS && (
          <Input
            id="review-photos"
            type="file"
            accept={PHOTO_TYPES.join(",")}
            multiple
            aria-label="Add photos"
            onChange={(event) => {
              addPhotos(event.target.files);
              event.target.value = "";
            }}
            className="h-12 cursor-pointer py-2.5 file:mr-3 file:rounded-full file:bg-bg-surface-2 file:px-3 file:text-text-primary"
          />
        )}
        {errors.photo_urls ? (
          <p className="text-sm text-danger">{errors.photo_urls}</p>
        ) : (
          <p className="text-xs text-text-primary/60">
            Up to {MAX_REVIEW_PHOTOS} photos from the show. JPG, PNG or WebP, 5 MB each.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
          Post review
        </Button>
      </div>
    </form>
  );
}
