"use client";

import { ImageIcon, Star } from "lucide-react";
import { useState } from "react";
import type { ModeratedReview } from "@/__fixtures__/reviews";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { OptionSelect } from "@/components/organizerComponent/shared/optionSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { formatDateTime } from "@/lib/format";
import type { Review } from "@/types/event";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";

const RATINGS = [
  { value: "all", label: "Any rating", match: () => true },
  { value: "low", label: "1–2 stars", match: (rating: number) => rating <= 2 },
  { value: "mid", label: "3 stars", match: (rating: number) => rating === 3 },
  { value: "high", label: "4–5 stars", match: (rating: number) => rating >= 4 },
];

const STATUS_TABS: { value: Review["status"]; label: string }[] = [
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
];

// Admins moderate reviews (recommended over organizers, who would have a conflict of
// interest). Hiding sets reviews.status = "hidden"; it can be undone. Lasts until reload.
export function ReviewModeration({ items: initial }: { items: ModeratedReview[] }) {
  const [items, setItems] = useState(initial);
  const [status, setStatus] = useState<Review["status"]>("published");
  const [show, setShow] = useState("all");
  const [rating, setRating] = useState("all");
  const [search, setSearch] = useState("");
  const [hiding, setHiding] = useState<ModeratedReview | null>(null);

  const shows = [...new Set(items.map((item) => item.show_title))].toSorted();
  const ratingMatch = RATINGS.find((item) => item.value === rating)?.match ?? (() => true);
  const query = search.trim().toLowerCase();
  const matchesFilters = (item: ModeratedReview) =>
    (show === "all" || item.show_title === show) &&
    ratingMatch(item.review.rating) &&
    (query === "" || [item.review.user_full_name, item.review.comment].some((text) => text.toLowerCase().includes(query)));
  const shown = items.filter((item) => item.review.status === status && matchesFilters(item));

  const setReviewStatus = (id: string, next: Review["status"]) =>
    setItems((list) => list.map((item) => (item.review.id === id ? { ...item, review: { ...item.review, status: next } } : item)));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-[20px] bg-bg-surface p-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="review-show" className="text-xs font-semibold">Show</Label>
          <OptionSelect
            id="review-show"
            value={show}
            options={[{ value: "all", label: "All shows" }, ...shows.map((title) => ({ value: title, label: title }))]}
            onChange={setShow}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="review-rating" className="text-xs font-semibold">Rating</Label>
          <OptionSelect id="review-rating" value={rating} options={RATINGS.map(({ value, label }) => ({ value, label }))} onChange={setRating} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="review-search" className="text-xs font-semibold">Search</Label>
          <Input
            id="review-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Reviewer or words in the review"
            className="h-11"
          />
        </div>
      </div>

      <Tabs value={status} onValueChange={(value) => setStatus(value === "hidden" ? "hidden" : "published")}>
        <TabsList className="h-11 w-fit rounded-full bg-bg-surface p-1">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-full px-4">
              {tab.label} ({items.filter((item) => item.review.status === tab.value && matchesFilters(item)).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {shown.length === 0 ? (
        <EmptyState title="No reviews here" description="Try another show, rating or search." />
      ) : (
        <div className="overflow-hidden rounded-[20px] bg-bg-surface">
          <Table className="min-w-220">
            <TableHeader>
              <TableRow>
                <TableHead>Review</TableHead>
                <TableHead>Show</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((item) => (
                <TableRow key={item.review.id}>
                  <TableCell className="max-w-md">
                    <p className="font-semibold">{item.review.user_full_name}</p>
                    {/* Plain text: user content is never rendered as HTML. */}
                    <p className="line-clamp-2 text-text-primary/80">{item.review.comment}</p>
                    {item.review.photo_urls.length > 0 && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-primary/70">
                        <ImageIcon className="size-3.5" aria-hidden="true" />
                        {item.review.photo_urls.length} {item.review.photo_urls.length === 1 ? "photo" : "photos"}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="max-w-56 truncate text-text-primary/80">{item.show_title}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                      <Star className="size-4 fill-accent-lime text-accent-lime" aria-hidden="true" />
                      {item.review.rating}
                      <span className="sr-only">out of 5</span>
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">
                    {formatDateTime(item.review.created_at, ADMIN_TIME_ZONE, { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    {item.review.status === "published" ? (
                      <Button variant="outline" size="sm" hoverScale={1} onClick={() => setHiding(item)} className="rounded-full">
                        Hide
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" hoverScale={1} onClick={() => setReviewStatus(item.review.id, "published")} className="rounded-full">
                        Restore
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={hiding !== null} onOpenChange={(open) => !open && setHiding(null)}>
        <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-md">
          {hiding && (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="font-heading text-2xl">Hide this review?</DialogTitle>
                <DialogDescription className="text-text-primary/70">
                  {hiding.review.user_full_name}&apos;s review of {hiding.show_title} disappears from the event page. You can
                  restore it from the Hidden tab.
                </DialogDescription>
              </DialogHeader>
              <blockquote className="rounded-2xl bg-bg-surface-2 p-4 text-sm text-text-primary/80">{hiding.review.comment}</blockquote>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" hoverScale={1} onClick={() => setHiding(null)} className="rounded-full">
                  Cancel
                </Button>
                <Button
                  hoverScale={1}
                  onClick={() => {
                    setReviewStatus(hiding.review.id, "hidden");
                    setHiding(null);
                  }}
                  className="rounded-full bg-danger font-semibold text-bg-base hover:bg-danger/90"
                >
                  Hide review
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
