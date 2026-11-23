import type { OrganizerEvent } from "@/types/organizer";

// The next step for an event depends on where it is in the review flow.
export function eventAction(event: OrganizerEvent) {
  switch (event.status) {
    case "draft":
      return { label: "Continue", href: `/organizer/events/new?draft=${event.slug}` };
    case "rejected":
      return { label: "Fix & resubmit", href: `/organizer/events/${event.slug}` };
    case "pending_review":
    case "approved":
    case "published":
    case "ongoing":
    case "completed":
    case "cancelled":
      return { label: "Manage", href: `/organizer/events/${event.slug}` };
  }
}
