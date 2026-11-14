"use client";

import { Fragment } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/animate-ui/components/radix/radio-group";
import { cn } from "@/lib/utils";
import { PAYMENT_METHOD_CATEGORIES, type PaymentMethod, type PaymentMethodCategory } from "@/types/booking";

const CATEGORY_LABELS: Record<PaymentMethodCategory, string> = {
  virtual_account: "Virtual account",
  ewallet: "E-wallet",
  credit_card: "Card",
  qris: "QRIS",
  paylater: "Pay later",
};

interface PaymentMethodPickerProps {
  methods: PaymentMethod[];
  value: string;
  onChange: (code: string) => void;
}

export function PaymentMethodPicker({ methods, value, onChange }: PaymentMethodPickerProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} aria-label="Payment method" className="gap-5">
      {PAYMENT_METHOD_CATEGORIES.map((category) => {
        const options = methods.filter((method) => method.category === category);
        if (options.length === 0) return null;
        return (
          <Fragment key={category}>
            <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">{CATEGORY_LABELS[category]}</p>
            <div className="-mt-3 grid gap-2 sm:grid-cols-2">
              {options.map((method) => (
                <label
                  key={method.id}
                  htmlFor={`method-${method.code}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border bg-bg-surface px-4 py-3.5 text-sm font-medium transition-colors",
                    value === method.code ? "border-accent-lime" : "border-transparent hover:border-text-primary/15",
                  )}
                >
                  <RadioGroupItem id={`method-${method.code}`} value={method.code} />
                  {method.name}
                </label>
              ))}
            </div>
          </Fragment>
        );
      })}
    </RadioGroup>
  );
}
