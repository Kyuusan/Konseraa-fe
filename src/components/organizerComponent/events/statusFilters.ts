import type { OrganizerEvent } from "@/types/organizer";

// How events are grouped on the dashboard tiles and the My events tabs.
export const STATUS_FILTERS = [
  { value: "all", label: "All", statuses: null },
  { value: "published", label: "Live", statuses: ["published", "ongoing"] },
  { value: "pending_review", label: "In review", statuses: ["pending_review", "approved"] },
  { value: "draft", label: "Drafts", statuses: ["draft"] },
  { value: "rejected", label: "Rejected", statuses: ["rejected"] },
  { value: "completed", label: "Past", statuses: ["completed", "cancelled"] },
] as const satisfies readonly { value: string; label: string; statuses: readonly OrganizerEvent["status"][] | null }[];

export type StatusFilterValue = (typeof STATUS_FILTERS)[number]["value"];

export function groupEventsByStatus(events: OrganizerEvent[]) {
  return STATUS_FILTERS.map((filter) => ({
    value: filter.value,
    label: filter.label,
    events: filter.statuses === null ? events : events.filter((event) => filter.statuses.some((status) => status === event.status)),
  }));
}

export const toStatusFilter = (value: string | undefined): StatusFilterValue =>
  STATUS_FILTERS.find((filter) => filter.value === value)?.value ?? "all";
