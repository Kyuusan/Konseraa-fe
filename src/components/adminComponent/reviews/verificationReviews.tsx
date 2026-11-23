"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime } from "@/lib/format";
import type { AdminVerification } from "@/types/admin";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";
import { DecisionPanel } from "./decisionPanel";
import { DecisionResult, DocumentChip, FactList, ReviewSection } from "./reviewParts";
import { ReviewQueue } from "./reviewQueue";

const CHECKLIST = [
  "The name and NIK match the KTP photo, and the photo is readable.",
  "The KTP belongs to the person in charge, not someone else.",
  "The organizer name and address look genuine (and match the NIB, if attached).",
];

const submitted = (iso: string) =>
  formatDateTime(iso, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/** NIK is personal data: masked until the admin needs to compare it. */
function MaskedNik({ nik }: { nik: string }) {
  const [shown, setShown] = useState(false);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono">{shown ? nik : `${nik.slice(0, 4)} •••• •••• ${nik.slice(-4)}`}</span>
      <Button
        variant="ghost"
        size="icon"
        hoverScale={1}
        onClick={() => setShown((value) => !value)}
        aria-label={shown ? "Hide NIK" : "Show NIK"}
        className="size-7 rounded-full"
      >
        {shown ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </Button>
    </span>
  );
}

export function VerificationReviews({ items, initialOpenId }: { items: AdminVerification[]; initialOpenId?: string }) {
  return (
    <ReviewQueue
      items={items}
      initialOpenId={initialOpenId}
      getId={(item) => item.organizer.id}
      isWaiting={(item) => item.verification.status === "pending" || item.verification.status === "in_review"}
      emptyWaiting="No organizer applications are waiting."
      sheetTitle={(item) => item.organizer.company_name}
      sheetDescription={(item) => `Submitted ${submitted(item.verification.submitted_at)}`}
      applyDecision={(item, decision, decidedAt) => {
        const status = decision.approved ? ("approved" as const) : ("rejected" as const);
        return {
          organizer: { ...item.organizer, verification_status: status },
          verification: {
            ...item.verification,
            status,
            reviewed_at: decidedAt,
            rejection_reason: decision.approved ? null : decision.rejection_reason,
          },
        };
      }}
      renderTable={(rows, open) => (
        <div className="rounded-[20px] bg-bg-surface px-2 py-1">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>Organizer</TableHead>
                <TableHead>Person in charge</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ organizer, verification }) => (
                <TableRow key={organizer.id}>
                  <TableCell>
                    <p className="font-semibold">{organizer.company_name}</p>
                    <p className="text-xs text-text-primary/70">
                      {organizer.organizer_type === "company" ? "Company" : "Individual"} · {organizer.city}
                    </p>
                  </TableCell>
                  <TableCell className="text-text-primary/80">{verification.person_in_charge.full_name}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">{submitted(verification.submitted_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={verification.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" hoverScale={1} onClick={() => open(organizer.id)} className="rounded-full">
                      {verification.status === "pending" || verification.status === "in_review" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      renderDetail={({ organizer, verification }, decide) => {
        const pic = verification.person_in_charge;
        const decided = verification.status === "approved" || verification.status === "rejected";
        return (
          <>
            <ReviewSection title="Organizer">
              <FactList
                facts={[
                  { label: "Type", value: organizer.organizer_type === "company" ? "Company" : "Individual" },
                  { label: "City", value: organizer.city },
                  { label: "Address", value: organizer.address },
                ]}
              />
            </ReviewSection>
            <ReviewSection title="Person in charge">
              <FactList
                facts={[
                  { label: "Full name", value: pic.full_name },
                  { label: "NIK", value: <MaskedNik nik={pic.nik} /> },
                  { label: "Phone", value: pic.phone },
                  { label: "Email", value: pic.email },
                ]}
              />
            </ReviewSection>
            <ReviewSection title="Documents">
              <div className="grid gap-3 sm:grid-cols-2">
                <DocumentChip label="KTP" file={verification.id_card} />
                {organizer.organizer_type === "company" && <DocumentChip label="NIB or deed" file={verification.business_document} />}
              </div>
            </ReviewSection>
            <ReviewSection title="Decision">
              {decided ? (
                <DecisionResult
                  status={verification.status === "approved" ? "approved" : "rejected"}
                  decidedAt={verification.reviewed_at}
                  reason={verification.rejection_reason}
                  approvedNote="Organizer tools are unlocked. They can now create events."
                />
              ) : (
                <DecisionPanel
                  key={organizer.id}
                  checklist={CHECKLIST}
                  approveLabel="Approve organizer"
                  rejectHint="e.g. The KTP photo is blurry, so the NIK cannot be read. Upload a clearer photo."
                  onDecide={decide}
                />
              )}
            </ReviewSection>
          </>
        );
      }}
    />
  );
}
