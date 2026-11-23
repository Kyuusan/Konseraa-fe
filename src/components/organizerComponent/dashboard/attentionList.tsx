import type { OrganizerEvent } from "@/types/organizer";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { eventAction } from "../shared/eventAction";

// Events waiting on the organizer (draft, rejected) or on the admin (in review).
export function AttentionList({ events }: { events: OrganizerEvent[] }) {
  if (events.length === 0) {
    return <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">Nothing needs your attention.</p>;
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const action = eventAction(event);
        return (
          <li key={event.id} className="space-y-3 rounded-[20px] bg-bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 truncate font-semibold">{event.title}</p>
              <StatusBadge status={event.status} />
            </div>
            {event.rejection_reason && <p className="line-clamp-2 text-sm text-text-primary/70">{event.rejection_reason}</p>}
            {event.status === "pending_review" && (
              <p className="text-sm text-text-primary/70">An admin is checking the event and its permit.</p>
            )}
            {event.status !== "pending_review" && (
              <ButtonLink href={action.href} variant="outline" size="sm" className="rounded-full">
                {action.label}
              </ButtonLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
