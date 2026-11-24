"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime } from "@/lib/format";
import type { AdminVerification } from "@/types/admin";
import { DOCUMENT_LABELS } from "@/types/organizer";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";
import { DecisionPanel } from "./decisionPanel";
import { DecisionResult, DocumentChip, FactList, ReviewSection } from "./reviewParts";
import { ReviewQueue } from "./reviewQueue";

// The person in charge is the account owner (organizers.user_id), so the KTP is
// matched against the account name.
const CHECKLIST = [
  "The name on the KTP matches the account owner, and the photo is readable.",
  "The KTP belongs to the account owner, not someone else.",
  "The organizer name looks genuine (and matches the NIB, if attached).",
];

const submitted = (iso: string) =>
  formatDateTime(iso, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

const entityLabel = (item: AdminVerification) => (item.organizer.legal_entity_type === "company" ? "Company" : "Individual");
const waiting = (item: AdminVerification) =>
  item.organizer.verification_status === "pending" || item.organizer.verification_status === "in_review";

export function VerificationReviews({ items, initialOpenId }: { items: AdminVerification[]; initialOpenId?: string }) {
  return (
    <ReviewQueue
      items={items}
      initialOpenId={initialOpenId}
      getId={(item) => item.organizer.id}
      isWaiting={waiting}
      emptyWaiting="No organizer applications are waiting."
      sheetTitle={(item) => item.organizer.company_name}
      sheetDescription={(item) => `Submitted ${submitted(item.submitted_at)}`}
      applyDecision={(item, decision, decidedAt) => {
        const status = decision.approved ? ("approved" as const) : ("rejected" as const);
        const reason = decision.approved ? null : decision.rejection_reason;
        return {
          ...item,
          organizer: { ...item.organizer, verification_status: status },
          // Each organizer_verifications row gets the decision.
          documents: item.documents.map((document) => ({ ...document, status, reviewed_at: decidedAt, rejection_reason: reason })),
          reviewed_at: decidedAt,
          rejection_reason: reason,
        };
      }}
      renderTable={(rows, open) => (
        <div className="overflow-hidden rounded-[20px] bg-bg-surface">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>Organizer</TableHead>
                <TableHead>Account owner</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.organizer.id}>
                  <TableCell>
                    <p className="font-semibold">{item.organizer.company_name}</p>
                    <p className="text-xs text-text-primary/70">{entityLabel(item)}</p>
                  </TableCell>
                  <TableCell className="text-text-primary/80">{item.owner.full_name}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">{submitted(item.submitted_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.organizer.verification_status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" hoverScale={1} onClick={() => open(item.organizer.id)} className="rounded-full">
                      {waiting(item) ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      renderDetail={(item, decide) => (
        <>
          <ReviewSection title="Organizer">
            <FactList facts={[{ label: "Name", value: item.organizer.company_name }, { label: "Type", value: entityLabel(item) }]} />
          </ReviewSection>
          <ReviewSection title="Account owner">
            <FactList
              facts={[
                { label: "Full name", value: item.owner.full_name },
                { label: "Email", value: item.owner.email },
                { label: "Phone", value: item.owner.phone ?? "Not set" },
              ]}
            />
          </ReviewSection>
          <ReviewSection title="Documents">
            <div className="grid gap-3 sm:grid-cols-2">
              {item.documents.map((document) => (
                <DocumentChip key={document.id} label={DOCUMENT_LABELS[document.document_type]} url={document.document_url} />
              ))}
            </div>
          </ReviewSection>
          <ReviewSection title="Decision">
            {waiting(item) ? (
              <DecisionPanel
                key={item.organizer.id}
                checklist={CHECKLIST}
                approveLabel="Approve organizer"
                rejectHint="e.g. The KTP photo is blurry, so the name cannot be read. Upload a clearer photo."
                onDecide={decide}
              />
            ) : (
              <DecisionResult
                status={item.organizer.verification_status === "approved" ? "approved" : "rejected"}
                decidedAt={item.reviewed_at}
                reason={item.rejection_reason}
                approvedNote="Organizer tools are unlocked. They can now create events."
              />
            )}
          </ReviewSection>
        </>
      )}
    />
  );
}
