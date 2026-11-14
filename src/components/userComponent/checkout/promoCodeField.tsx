"use client";

import { useId, useState, type SubmitEvent } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromoCodeFieldProps {
  applied?: string;
  error: string | null;
  onApply: (code: string | undefined) => void;
}

export function PromoCodeField({ applied, error, onApply }: PromoCodeFieldProps) {
  const [value, setValue] = useState(applied ?? "");
  const messageId = useId();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = value.trim();
    onApply(code === "" ? undefined : code);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="promo-code" className="text-xs font-semibold tracking-widest text-text-muted uppercase">
        Promo code
      </Label>
      <div className="flex gap-2">
        <Input
          id="promo-code"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter a code"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className="h-11 uppercase placeholder:normal-case"
        />
        <Button type="submit" variant="outline" hoverScale={1} className="h-11 rounded-full px-5">
          Apply
        </Button>
      </div>
      <p id={messageId} aria-live="polite" className="min-h-5 text-sm">
        {error ? (
          <span className="text-danger">{error}</span>
        ) : applied ? (
          <span className="text-accent-lime">Code {applied.toUpperCase()} applied.</span>
        ) : null}
      </p>
    </form>
  );
}
