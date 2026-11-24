"use client";

import Image from "next/image";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { VenueSeatMap } from "@/components/userComponent/shared/venueSeatMap";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { TIER_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatDateTime, formatNumber, formatPrice, formatTime } from "@/lib/format";
import type { AdminEventReview } from "@/types/admin";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";
import { DecisionPanel } from "./decisionPanel";
import { DecisionResult, DocumentChip, FactList, ReviewSection } from "./reviewParts";
import { ReviewQueue } from "./reviewQueue";

// The permit checks follow the agreed rule: it must name the venue, date and capacity.
const CHECKLIST = [
  "The permit names this venue and address.",
  "The permit covers the date of every session.",
  "The permitted capacity is at least the venue capacity.",
  "Title, description and artwork follow the content guidelines.",
];

const VENUE_TYPES: Record<AdminEventReview["venue"]["type"], string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  hybrid: "Indoor and outdoor",
};

const submitted = (iso: string) =>
  formatDateTime(iso, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function EventReviews({ items, initialOpenId }: { items: AdminEventReview[]; initialOpenId?: string }) {
  return (
    <ReviewQueue
      items={items}
      initialOpenId={initialOpenId}
      getId={(item) => item.event_id}
      isWaiting={(item) => item.status === "pending_review"}
      emptyWaiting="No events are waiting for review."
      sheetTitle={(item) => item.title}
      sheetDescription={(item) => `${item.organizer_name} · submitted ${submitted(item.submitted_at)}`}
      applyDecision={(item, decision, decidedAt) => ({
        ...item,
        status: decision.approved ? ("approved" as const) : ("rejected" as const),
        rejection_reason: decision.approved ? null : decision.rejection_reason,
        decided_at: decidedAt,
      })}
      renderTable={(rows, open) => (
        <div className="overflow-hidden rounded-[20px] bg-bg-surface">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>City</TableHead>
                <TableHead>First show</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((review) => (
                <TableRow key={review.event_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image src={review.poster_url} alt="" width={40} height={50} className="h-12 w-10 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-semibold">
                          <span className="max-w-56 truncate">{review.title}</span>
                          {review.is_resubmission && review.status === "pending_review" && (
                            <span className="rounded-full bg-bg-surface-2 px-2 py-0.5 text-xs font-medium text-text-primary/80">
                              Resubmitted
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-text-primary/70">{review.organizer_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-primary/80">{review.venue.city}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/80">
                    {review.sessions[0] ? formatDate(review.sessions[0].start_at, review.venue.timezone) : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">{submitted(review.submitted_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={review.status === "approved" ? "published" : review.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" hoverScale={1} onClick={() => open(review.event_id)} className="rounded-full">
                      {review.status === "pending_review" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      renderDetail={(review, decide) => {
        const timeZone = review.venue.timezone;
        return (
          <>
            {review.is_resubmission && review.previous_rejection_reason && (
              <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
                <p className="font-semibold text-warning">Resubmitted after a rejection</p>
                <p className="text-text-primary/80">Last time: {review.previous_rejection_reason}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Image src={review.poster_url} alt="Poster" width={96} height={120} className="h-30 w-24 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold text-text-primary/70">{review.categories.join(", ")}</p>
                <p className="text-sm text-text-primary/90">{review.description}</p>
              </div>
            </div>

            <ReviewSection title="Venue">
              <FactList
                facts={[
                  { label: "Venue", value: `${review.venue.name} · ${VENUE_TYPES[review.venue.type]}` },
                  { label: "Address", value: review.address },
                  { label: "Capacity", value: formatNumber(review.venue.total_capacity) },
                  { label: "Time zone", value: timeZone },
                ]}
              />
            </ReviewSection>

            <ReviewSection title={`Sessions (${review.sessions.length})`}>
              <ul className="divide-y divide-text-primary/10 rounded-2xl bg-bg-surface-2 px-4 text-sm">
                {review.sessions.map((session) => (
                  <li key={session.id} className="flex justify-between gap-4 py-3">
                    <span className="min-w-0">
                      <span className="block font-semibold">{session.name}</span>
                      <span className="block truncate text-text-primary/70">{session.artists.map((artist) => artist.name).join(", ")}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-medium">{formatDate(session.start_at, timeZone)}</span>
                      <span className="block text-text-primary/70">
                        {formatTime(session.start_at, timeZone)} – {formatTime(session.end_at, timeZone)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </ReviewSection>

            <ReviewSection title={`Ticket tiers (${review.tiers.length})`}>
              <FactList
                facts={review.tiers.map((tier) => ({
                  label: tier.name,
                  value: `${formatPrice(tier.price)} · ${TIER_TYPE_LABELS[tier.tier_type]} · ${formatNumber(tier.available_quota)} per session`,
                }))}
              />
            </ReviewSection>

            <ReviewSection title="Permit and seat map">
              <DocumentChip label="Crowd permit" file={review.permit} />
              {review.layout.sections.length > 0 ? (
                <VenueSeatMap
                  layout={review.layout}
                  tiers={review.tiers}
                  eventTitle={review.title}
                  description="Check that every tier points to the right area."
                  className="bg-bg-surface-2"
                />
              ) : (
                <p className="text-sm text-text-primary/70">This venue has no sections yet. Buyers will only see the tier list.</p>
              )}
            </ReviewSection>

            <ReviewSection title="Decision">
              {review.status === "pending_review" ? (
                <DecisionPanel
                  key={review.event_id}
                  checklist={CHECKLIST}
                  approveLabel="Approve and publish"
                  rejectHint="e.g. The permit is dated 13 February but the event is on 20 February. Upload a permit for the correct date."
                  onDecide={decide}
                />
              ) : (
                <DecisionResult
                  status={review.status}
                  decidedAt={review.decided_at}
                  reason={review.rejection_reason}
                  approvedNote="Published. Tickets are on sale and the organizer was notified."
                />
              )}
            </ReviewSection>
          </>
        );
      }}
    />
  );
}
