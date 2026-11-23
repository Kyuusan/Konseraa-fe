import { FileText } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime } from "@/lib/format";
import type { DocumentFile } from "@/types/organizer";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";

const fileSize = (bytes: number) =>
  bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;

/** An uploaded document. Opening it needs file storage, which the demo does not have. */
export function DocumentChip({ label, file }: { label: string; file: DocumentFile | null }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-bg-surface-2 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-surface text-text-primary/80">
        <FileText className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-widest text-text-primary/70 uppercase">{label}</p>
        {file ? (
          <>
            <p className="truncate text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-text-primary/70">
              {fileSize(file.size)} · {file.mime_type === "application/pdf" ? "PDF" : "Image"}
            </p>
          </>
        ) : (
          <p className="text-sm text-text-primary/70">Not provided</p>
        )}
      </div>
    </div>
  );
}

export function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-widest text-text-primary/70 uppercase">{title}</h3>
      {children}
    </section>
  );
}

export function FactList({ facts }: { facts: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-text-primary/10 rounded-2xl bg-bg-surface-2 px-4 text-sm">
      {facts.map((fact) => (
        <div key={fact.label} className="flex justify-between gap-4 py-3">
          <dt className="shrink-0 text-text-primary/70">{fact.label}</dt>
          <dd className="min-w-0 text-right font-medium">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** What was decided, for items that are no longer waiting. */
export function DecisionResult({
  status,
  decidedAt,
  reason,
  approvedNote,
}: {
  status: "approved" | "rejected";
  decidedAt: string | null;
  reason: string | null;
  approvedNote: string;
}) {
  return (
    <div
      className={
        status === "approved"
          ? "space-y-2 rounded-2xl border border-accent-lime/40 bg-accent-lime/10 p-4"
          : "space-y-2 rounded-2xl border border-danger/40 bg-danger/10 p-4"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        {decidedAt && (
          <span className="text-xs text-text-primary/70">
            {formatDateTime(decidedAt, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
          </span>
        )}
      </div>
      <p className="text-sm">{status === "approved" ? approvedNote : reason}</p>
    </div>
  );
}
