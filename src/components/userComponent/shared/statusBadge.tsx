import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus } from "@/types/booking";
import type { EVENT_STATUSES } from "@/types/event";
import type { TicketStatus } from "@/types/ticket";

type Status = BookingStatus | PaymentStatus | TicketStatus | (typeof EVENT_STATUSES)[number];

// lime = done/active, pink = waiting on someone, muted = finished/neutral,
// danger = failed/refused, warning = timed out.
const TONES = {
  positive: "bg-accent-lime text-bg-base",
  attention: "bg-accent-pink text-bg-base",
  neutral: "bg-bg-surface-2 text-text-muted",
  danger: "bg-danger text-bg-base",
  warning: "bg-warning text-bg-base",
} as const;

const STATUS_TONE: Record<Status, keyof typeof TONES> = {
  paid: "positive",
  success: "positive",
  issued: "positive",
  checked_in: "positive",
  published: "positive",
  approved: "positive",
  ongoing: "positive",
  pending: "attention",
  awaiting_payment: "attention",
  processing: "attention",
  pending_review: "attention",
  draft: "neutral",
  completed: "neutral",
  transferred: "neutral",
  refunded: "neutral",
  partially_refunded: "neutral",
  expired: "warning",
  failed: "danger",
  cancelled: "danger",
  rejected: "danger",
  void: "danger",
};

const label = (status: Status) => status.replaceAll("_", " ");

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge className={cn("capitalize", TONES[STATUS_TONE[status]], className)}>{label(status)}</Badge>
  );
}
