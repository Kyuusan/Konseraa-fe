import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import type { OrganizerEvent } from "@/types/organizer";

// One line on what the status means for the organizer, and the next step if there is one.
export function EventStatusNotice({ event }: { event: OrganizerEvent }) {
  if (event.status === "rejected") {
    return (
      <div role="alert" className="flex flex-col gap-4 rounded-[20px] border border-danger/40 bg-danger/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest text-danger uppercase">Reason from the reviewer</p>
          <p>{event.rejection_reason ?? "The reviewer did not leave a reason."}</p>
        </div>
        <ButtonLink
          href={`/organizer/events/new?draft=${event.slug}`}
          hoverScale={1.02}
          className="h-11 shrink-0 rounded-full px-5 font-semibold"
        >
          Fix and resubmit
        </ButtonLink>
      </div>
    );
  }

  const message =
    event.status === "pending_review"
      ? "In review. Nothing can be changed until the team has checked the event and its permit."
      : event.status === "completed"
        ? "This show has ended. Its details are kept for your records and can no longer be changed."
        : event.status === "cancelled"
          ? "This event was cancelled and can no longer be changed."
          : undefined;

  if (!message) return null;
  return <p className="rounded-[20px] border border-text-primary/15 p-5 text-sm text-text-primary/80">{message}</p>;
}
