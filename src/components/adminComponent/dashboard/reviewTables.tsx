import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDate, formatDateTime } from "@/lib/format";
import type { PendingEventReview, PendingVerification } from "@/types/admin";
import { ADMIN_TIME_ZONE } from "./reviewQueueCard";

const submitted = (iso: string) =>
  formatDateTime(iso, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function EventReviewTable({ reviews }: { reviews: PendingEventReview[] }) {
  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Show date</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-px">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.event_id}>
              <TableCell>
                <p className="flex items-center gap-2 font-semibold">
                  {review.title}
                  {review.is_resubmission && (
                    <span className="rounded-full bg-bg-surface-2 px-2 py-0.5 text-xs font-medium text-text-primary/80">
                      Resubmitted
                    </span>
                  )}
                </p>
                <p className="text-xs text-text-primary/70">{review.organizer_name}</p>
              </TableCell>
              <TableCell className="text-text-primary/80">{review.city}</TableCell>
              <TableCell className="whitespace-nowrap text-text-primary/80">{formatDate(review.starts_at, ADMIN_TIME_ZONE)}</TableCell>
              <TableCell className="whitespace-nowrap text-text-primary/70">{submitted(review.submitted_at)}</TableCell>
              <TableCell>
                <ButtonLink href={`/admin/events?review=${review.event_id}`} variant="outline" size="sm" className="rounded-full">
                  Review
                </ButtonLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function VerificationTable({ verifications }: { verifications: PendingVerification[] }) {
  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Organizer</TableHead>
            <TableHead>Person in charge</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-px">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.map((item) => (
            <TableRow key={item.organizer_id}>
              <TableCell>
                <p className="font-semibold">{item.organizer_name}</p>
                <p className="text-xs text-text-primary/70">
                  {item.organizer_type === "company" ? "Company" : "Individual"} · {item.city}
                </p>
              </TableCell>
              <TableCell className="text-text-primary/80">{item.pic_name}</TableCell>
              <TableCell className="whitespace-nowrap text-text-primary/70">{submitted(item.submitted_at)}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell>
                <ButtonLink
                  href={`/admin/verifications?review=${item.organizer_id}`}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Check
                </ButtonLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
