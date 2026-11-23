import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";

export function SubmittedNotice({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-[20px] bg-bg-surface p-6 sm:p-10">
      <StatusBadge status="pending_review" />
      <div className="max-w-xl space-y-2">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{title} is in review</h2>
        <p className="text-text-primary/70">
          We will check the event details and the permit. When it is approved the event goes live and tickets go on
          sale. If something needs fixing, you will find the reason under My events.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/organizer/events?status=pending_review" hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
          Go to My events
        </ButtonLink>
        <ButtonLink href="/organizer" variant="outline" className="h-11 rounded-full px-5">
          Back to dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
