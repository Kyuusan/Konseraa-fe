import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Organizer, OrganizerVerification } from "@/types/organizer";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { Perforation } from "@/components/userComponent/shared/perforation";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { TicketCard } from "@/components/userComponent/shared/ticketCard";

const TIME_ZONE = "Asia/Jakarta";

const TITLES: Record<Organizer["verification_status"], string> = {
  pending: "Application received",
  in_review: "Your application is being reviewed",
  approved: "You're verified",
  rejected: "Your application needs changes",
};

interface ApplicationStatusProps {
  organizer: Organizer;
  verification: OrganizerVerification;
}

export function ApplicationStatus({ organizer, verification }: ApplicationStatusProps) {
  const status = verification.status;
  const steps = [
    { label: "Submitted", done: true, detail: formatDateTime(verification.submitted_at, TIME_ZONE) },
    { label: "In review", done: status !== "pending", detail: status === "pending" ? "Waiting for an admin" : "Picked up by an admin" },
    {
      label: status === "rejected" ? "Changes requested" : "Decision",
      done: status === "approved" || status === "rejected",
      detail: verification.reviewed_at ? formatDateTime(verification.reviewed_at, TIME_ZONE) : "Not decided yet",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organizer verification"
        title={TITLES[status]}
        description={
          status === "rejected"
            ? "Fix the points below and submit again. Your previous data is kept."
            : "Organizer tools unlock as soon as an admin approves your application. You'll get a notification."
        }
        actions={
          status === "rejected" ? (
            <ButtonLink href="/organizer/apply" hoverScale={1.02} className="h-12 rounded-full px-6 text-base font-semibold">
              Fix and resubmit
            </ButtonLink>
          ) : undefined
        }
      />

      {verification.rejection_reason && (
        <div role="alert" className="rounded-[20px] border border-danger/40 bg-danger/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-danger uppercase">Reason from the reviewer</p>
          <p className="mt-2">{verification.rejection_reason}</p>
        </div>
      )}

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step) => (
          <li key={step.label} className={cn("rounded-[20px] border bg-bg-surface p-5", step.done ? "border-accent-lime/40" : "border-transparent")}>
            <p className={cn("font-heading text-lg font-semibold", !step.done && "text-text-muted")}>{step.label}</p>
            <p className="text-sm text-text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>

      <TicketCard className="max-w-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3 p-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">
              {organizer.organizer_type === "company" ? "Company" : "Individual"}
            </p>
            <p className="font-heading text-2xl font-bold">{organizer.company_name}</p>
            <p className="text-sm text-text-muted">{organizer.address}, {organizer.city}</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <Perforation />
        <dl className="grid gap-4 p-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Person in charge</dt>
            <dd className="mt-1 font-semibold">{verification.person_in_charge.full_name}</dd>
            <dd className="text-text-muted">{verification.person_in_charge.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Documents</dt>
            <dd className="mt-1">ID card (KTP): {verification.id_card.name}</dd>
            {verification.business_document && <dd>Business document: {verification.business_document.name}</dd>}
          </div>
        </dl>
      </TicketCard>
    </div>
  );
}
