import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const ADMIN_TIME_ZONE = "Asia/Jakarta";

interface Queue {
  label: string;
  count: number;
  /** Submission time of the oldest item still waiting. */
  oldest: string | undefined;
  href: string;
}

// The two review queues an admin works through every day.
export function ReviewQueueCard({ queues }: { queues: Queue[] }) {
  return (
    <section aria-labelledby="queue-heading" className="space-y-3">
      <h2 id="queue-heading" className="text-sm font-semibold">
        Waiting for review
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {queues.map((queue, i) => (
          <Link
            key={queue.href}
            href={queue.href}
            className={cn(
              "block rounded-[20px] p-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
              i === 0 ? "bg-accent-pink text-bg-base hover:bg-accent-pink/90" : "bg-bg-surface hover:bg-bg-surface-2",
            )}
          >
            <p className="text-sm font-semibold">{queue.label}</p>
            <p className="mt-2 font-heading text-4xl font-bold">{queue.count}</p>
            <p className={cn("mt-1 text-xs", i === 0 ? "text-bg-base/80" : "text-text-primary/70")}>
              {queue.oldest
                ? `Oldest since ${formatDateTime(queue.oldest, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}`
                : "All caught up"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
