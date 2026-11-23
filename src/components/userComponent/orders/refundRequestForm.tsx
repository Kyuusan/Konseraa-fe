"use client";

import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/animate-ui/components/radix/radio-group";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  REFUND_REASON_LABELS,
  REFUND_REASONS,
  type RefundReason,
  type RefundRequestForm as RefundRequestValues,
  RefundRequestFormSchema,
} from "@/types/refund";
import { ButtonLink } from "../shared/buttonLink";

interface RefundRequestFormProps {
  amount: number;
  ticketCount: number;
}

// Stands in for a refund request endpoint (not in spec). The organizer decides.
export function RefundRequestForm({ amount, ticketCount }: RefundRequestFormProps) {
  const [values, setValues] = useState<Omit<RefundRequestValues, "acknowledged"> & { acknowledged: boolean }>({
    reason: "cannot_attend",
    note: "",
    acknowledged: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = RefundRequestFormSchema.safeParse(values);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      return;
    }
    setErrors({});
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4 rounded-[20px] bg-bg-surface p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-semibold">Refund requested</h2>
        <p className="text-text-primary/80">
          The organizer reviews your request. If they approve it, {formatPrice(amount)} goes back to the way you paid. We
          will notify you either way.
        </p>
        <p className="text-sm text-text-primary/70">Your tickets are on hold and can&apos;t be used or transferred in the meantime.</p>
        <ButtonLink href="/orders" hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
          Back to my orders
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-[20px] bg-bg-surface p-6 sm:p-8">
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-semibold">Why do you want a refund?</legend>
        <RadioGroup
          value={values.reason}
          onValueChange={(value) => {
            const reason = REFUND_REASONS.find((item) => item === value);
            if (reason) setValues((current) => ({ ...current, reason }));
          }}
          className="grid gap-2"
        >
          {REFUND_REASONS.map((reason: RefundReason) => (
            <Label
              key={reason}
              htmlFor={`reason-${reason}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border bg-bg-surface-2 p-4 font-normal",
                values.reason === reason ? "border-accent-lime" : "border-transparent",
              )}
            >
              <RadioGroupItem id={`reason-${reason}`} value={reason} />
              {REFUND_REASON_LABELS[reason]}
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <FormField
        id="refund-note"
        label={values.reason === "other" ? "What happened?" : "Anything the organizer should know? (optional)"}
        error={errors.note}
      >
        <Textarea
          id="refund-note"
          value={values.note}
          onChange={(event) => setValues((current) => ({ ...current, note: event.target.value }))}
          aria-invalid={errors.note ? true : undefined}
          rows={3}
          maxLength={500}
        />
      </FormField>

      <div className="space-y-2">
        <div className="flex items-start gap-3 rounded-2xl bg-bg-surface-2 p-4">
          <Checkbox
            id="refund-ack"
            checked={values.acknowledged}
            onCheckedChange={(checked) => setValues((current) => ({ ...current, acknowledged: checked === true }))}
            className="mt-0.5 border-text-primary/50 data-[state=checked]:border-accent-lime data-[state=checked]:bg-accent-lime data-[state=checked]:text-bg-base"
          />
          <Label htmlFor="refund-ack" className="text-sm leading-5 font-normal">
            I understand that all {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"} in this order go on hold now and are
            cancelled if the refund is approved.
          </Label>
        </div>
        {errors.acknowledged && <p className="text-sm text-danger">{errors.acknowledged}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <ButtonLink href="/orders" variant="ghost" className="rounded-full">
          Cancel
        </ButtonLink>
        <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
          Request {formatPrice(amount)} refund
        </Button>
      </div>
    </form>
  );
}
