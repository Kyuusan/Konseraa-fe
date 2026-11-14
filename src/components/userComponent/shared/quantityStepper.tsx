"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

export function QuantityStepper({ value, max, onChange, label }: QuantityStepperProps) {
  return (
    <div role="group" aria-label={`${label} quantity`} className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        hoverScale={1}
        onClick={() => onChange(value - 1)}
        disabled={value <= 0}
        aria-label={`Remove one ${label} ticket`}
      >
        <Minus />
      </Button>
      <output aria-live="polite" className="w-5 text-center font-heading text-lg font-semibold tabular-nums">
        {value}
      </output>
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        hoverScale={1}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Add one ${label} ticket`}
      >
        <Plus />
      </Button>
    </div>
  );
}
