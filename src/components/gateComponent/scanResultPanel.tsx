import type { ScanOutcome } from "@/__fixtures__/checkIns";
import { cn } from "@/lib/utils";

// Big colour feedback (PRD §13.9): green admits, yellow needs a check, red refuses.
const LOOK: Record<ScanOutcome["result"] | "queued", { title: string; className: string }> = {
  success: { title: "Valid", className: "bg-accent-lime text-bg-base" },
  duplicate: { title: "Already scanned", className: "bg-warning text-bg-base" },
  expired: { title: "Wrong session", className: "bg-danger text-bg-base" },
  invalid: { title: "Invalid ticket", className: "bg-danger text-bg-base" },
  queued: { title: "Saved offline", className: "bg-bg-surface-2 text-text-primary" },
};

export type ScanFeedback = (ScanOutcome & { queued?: false }) | { queued: true; ticket_code: string };

export function ScanResultPanel({ feedback }: { feedback: ScanFeedback | null }) {
  if (!feedback) {
    return (
      <div className="rounded-[20px] border border-dashed border-text-primary/20 p-6 text-center text-sm text-text-primary/70">
        Scan results show here.
      </div>
    );
  }

  const look = LOOK[feedback.queued ? "queued" : feedback.result];

  return (
    <div role="status" aria-live="assertive" className={cn("space-y-2 rounded-[20px] p-6", look.className)}>
      <p className="font-heading text-3xl font-bold sm:text-4xl">{look.title}</p>
      {feedback.queued ? (
        <p className="font-medium">
          {feedback.ticket_code} is stored on this device and will be checked when the connection is back.
        </p>
      ) : (
        <>
          <p className="font-medium">{feedback.message}</p>
          <p className="font-mono text-sm font-semibold">
            {feedback.ticket_code}
            {feedback.holder_name && ` · ${feedback.holder_name}`}
            {feedback.tier_name && ` · ${feedback.tier_name}`}
          </p>
        </>
      )}
    </div>
  );
}
