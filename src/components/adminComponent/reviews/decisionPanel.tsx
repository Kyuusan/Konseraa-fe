"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ReviewDecision, ReviewDecisionSchema } from "@/types/admin";

interface DecisionPanelProps {
  /** What the admin confirms before approving. */
  checklist: string[];
  approveLabel: string;
  /** Shown to the organizer with a rejection. */
  rejectHint: string;
  onDecide: (decision: ReviewDecision) => void;
}

// Approve stays locked until every check is ticked; a rejection always needs a reason.
export function DecisionPanel({ checklist, approveLabel, rejectHint, onDecide }: DecisionPanelProps) {
  const [checked, setChecked] = useState<boolean[]>(() => checklist.map(() => false));
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string>();

  const allChecked = checked.every(Boolean);

  function reject() {
    const result = ReviewDecisionSchema.safeParse({ approved: false, rejection_reason: reason });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    onDecide(result.data);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-text-primary/15 p-4">
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-semibold">Before approving, confirm that</legend>
        {checklist.map((item, i) => (
          <div key={item} className="flex items-start gap-3">
            <Checkbox
              id={`check-${i}`}
              checked={checked[i]}
              onCheckedChange={(value) => setChecked((current) => current.map((c, j) => (j === i ? value === true : c)))}
              className="mt-0.5 border-text-primary/50 data-[state=checked]:border-accent-lime data-[state=checked]:bg-accent-lime data-[state=checked]:text-bg-base"
            />
            <Label htmlFor={`check-${i}`} className="text-sm leading-5 font-normal">
              {item}
            </Label>
          </div>
        ))}
      </fieldset>

      {rejecting ? (
        <div className="space-y-3">
          <Label htmlFor="reject-reason" className="text-sm font-semibold">
            Reason for rejection
          </Label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setError(undefined);
            }}
            aria-invalid={error ? true : undefined}
            rows={4}
            placeholder={rejectHint}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" hoverScale={1} onClick={() => setRejecting(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              variant="destructive"
              hoverScale={1}
              onClick={reject}
              className="rounded-full bg-danger font-semibold text-bg-base hover:bg-danger/90 dark:bg-danger"
            >
              Send rejection
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" hoverScale={1} onClick={() => setRejecting(true)} className="rounded-full">
            Reject
          </Button>
          <Button hoverScale={1.02} disabled={!allChecked} onClick={() => onDecide({ approved: true })} className="rounded-full font-semibold">
            {approveLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
