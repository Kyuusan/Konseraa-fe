"use client";

import { Shuffle } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { DateRangePicker } from "@/components/userComponent/shared/dateRangePicker";
import { formatPrice } from "@/lib/format";
import { DISCOUNT_TYPES, type DiscountType, type PromoForm as PromoFormValues, PromoFormSchema } from "@/types/promo";
import { FormField } from "../onboarding/formField";
import { FormSection } from "../onboarding/formSection";
import { OptionSelect } from "../shared/optionSelect";
import { formatDiscount } from "./promoFormat";

export interface PromoEventOption {
  id: string;
  title: string;
  /** Cheapest tier: a fixed discount may not be larger. */
  min_price: number;
}

const DISCOUNT_LABELS: Record<DiscountType, string> = {
  percentage: "Percentage",
  fixed: "Fixed amount (USD)",
};

// No 0/O or 1/I, so codes are easy to read out loud.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randomCode = () => Array.from({ length: 8 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

interface PromoFormProps {
  events: PromoEventOption[];
  takenCodes: string[];
}

export function PromoForm({ events, takenCodes }: PromoFormProps) {
  const [values, setValues] = useState<PromoFormValues>({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    event_id: "all",
    usage_limit: "",
    per_user_limit: "1",
    starts_on: "",
    ends_on: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ code: string; discount: string } | null>(null);

  const set = <K extends keyof PromoFormValues>(key: K, value: PromoFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const text = (key: "code" | "discount_value" | "usage_limit" | "per_user_limit") => ({
    id: key,
    value: values[key],
    "aria-invalid": errors[key] ? true : undefined,
    onChange: (event: { target: { value: string } }) => set(key, event.target.value),
  });

  const scope = values.event_id === "all" ? events : events.filter((event) => event.id === values.event_id);
  const lowestPrice = scope.length > 0 ? Math.min(...scope.map((event) => event.min_price)) : 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = PromoFormSchema.safeParse(values);
    const next: Record<string, string> = result.success
      ? {}
      : Object.fromEntries(result.error.issues.toReversed().map((issue) => [issue.path.join("."), issue.message]));

    if (result.success) {
      if (takenCodes.includes(result.data.code)) next.code = "You already have a code with this name.";
      if (result.data.discount_type === "fixed" && result.data.discount_value > lowestPrice) {
        next.discount_value = `Cannot be more than the cheapest ticket (${formatPrice(lowestPrice)}).`;
      }
    }

    setErrors(next);
    if (!result.success || Object.keys(next).length > 0) return;
    // Stands in for creating the code on the backend: nothing is stored.
    setCreated({ code: result.data.code, discount: formatDiscount(result.data) });
  }

  if (created) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-[20px] bg-bg-surface p-6 sm:p-10">
        <p className="rounded-full border border-dashed border-accent-lime px-5 py-2 font-mono text-2xl font-bold tracking-widest text-accent-lime">
          {created.code}
        </p>
        <div className="max-w-xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Promo code created</h2>
          <p className="text-text-primary/70">
            Buyers get {created.discount} when they enter this code at checkout, from the start date until it ends or
            runs out.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/organizer/promos" hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
            Back to promo codes
          </ButtonLink>
          <Button
            variant="outline"
            hoverScale={1}
            onClick={() => {
              setCreated(null);
              setValues((current) => ({ ...current, code: "" }));
            }}
            className="h-11 rounded-full px-5"
          >
            Create another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection id="promo-code" title="Code and discount" description="Buyers type the code at checkout. Codes are not case-sensitive.">
        <FormField id="code" label="Code" hint="4 to 16 letters or numbers." error={errors.code}>
          <div className="flex gap-2">
            <Input {...text("code")} maxLength={16} placeholder="e.g. NEON15" className="h-11 font-mono uppercase tracking-wider" />
            <Button
              type="button"
              variant="outline"
              hoverScale={1}
              onClick={() => set("code", randomCode())}
              className="h-11 shrink-0 rounded-full px-4"
            >
              <Shuffle aria-hidden="true" />
              Generate
            </Button>
          </div>
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="discount_type" label="Discount type">
            <OptionSelect
              id="discount_type"
              value={values.discount_type}
              options={DISCOUNT_TYPES.map((type) => ({ value: type, label: DISCOUNT_LABELS[type] }))}
              onChange={(type) => set("discount_type", type)}
            />
          </FormField>
          <FormField
            id="discount_value"
            label={values.discount_type === "percentage" ? "Discount (%)" : "Discount (USD)"}
            hint={values.discount_type === "percentage" ? "1 to 100." : `Up to ${formatPrice(lowestPrice)}, the cheapest ticket.`}
            error={errors.discount_value}
          >
            <Input
              {...text("discount_value")}
              type="number"
              inputMode="decimal"
              min={0}
              max={values.discount_type === "percentage" ? 100 : lowestPrice}
              className="h-11"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection id="promo-scope" title="Where it applies" description="One event, or every event you sell on Konsera.">
        <FormField id="event_id" label="Event" error={errors.event_id}>
          <OptionSelect
            id="event_id"
            value={values.event_id}
            options={[{ value: "all", label: "All my events" }, ...events.map((event) => ({ value: event.id, label: event.title }))]}
            onChange={(id) => set("event_id", id)}
          />
        </FormField>
      </FormSection>

      <FormSection id="promo-limits" title="Limits" description="The code stops working when the total limit is reached.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="usage_limit" label="Total uses" error={errors.usage_limit}>
            <Input {...text("usage_limit")} type="number" inputMode="numeric" min={1} placeholder="e.g. 200" className="h-11" />
          </FormField>
          <FormField id="per_user_limit" label="Uses per account" error={errors.per_user_limit}>
            <Input {...text("per_user_limit")} type="number" inputMode="numeric" min={1} className="h-11" />
          </FormField>
        </div>
      </FormSection>

      <FormSection id="promo-dates" title="Valid dates" description="Starts at 00:00 and ends at 23:59 Jakarta time (WIB).">
        <FormField id="promo-range" label="From – to" error={errors.starts_on ?? errors.ends_on}>
          <DateRangePicker
            id="promo-range"
            from={values.starts_on}
            to={values.ends_on}
            placeholder="Pick the start and end dates"
            onChange={(range) => setValues((current) => ({ ...current, starts_on: range.from, ends_on: range.to }))}
          />
        </FormField>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" hoverScale={1.02} className="h-12 rounded-full px-8 text-base font-semibold">
          Create promo code
        </Button>
      </div>
    </form>
  );
}
