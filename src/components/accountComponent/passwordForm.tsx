"use client";

import { Eye, EyeOff } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { Input } from "@/components/ui/input";
import { type PasswordChange, PasswordChangeSchema } from "@/types/notification";

const EMPTY: PasswordChange = { current_password: "", new_password: "", confirm_password: "" };

const FIELDS: { key: keyof PasswordChange; label: string; autoComplete: string }[] = [
  { key: "current_password", label: "Current password", autoComplete: "current-password" },
  { key: "new_password", label: "New password", autoComplete: "new-password" },
  { key: "confirm_password", label: "Repeat new password", autoComplete: "new-password" },
];

export function PasswordForm({ submitLabel = "Update password" }: { submitLabel?: string }) {
  const [values, setValues] = useState(EMPTY);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = PasswordChangeSchema.safeParse(values);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.toReversed().map((issue) => [issue.path.join("."), issue.message])));
      return;
    }
    // Stands in for the password endpoint (not in spec for signed-in users).
    setErrors({});
    setValues(EMPTY);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {FIELDS.map((item) => (
        <FormField key={item.key} id={item.key} label={item.label} error={errors[item.key]}>
          <Input
            id={item.key}
            type={visible ? "text" : "password"}
            value={values[item.key]}
            autoComplete={item.autoComplete}
            aria-invalid={errors[item.key] ? true : undefined}
            onChange={(event) => {
              setValues((current) => ({ ...current, [item.key]: event.target.value }));
              setSaved(false);
            }}
            className="h-11"
          />
        </FormField>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" hoverScale={1} onClick={() => setVisible((value) => !value)} className="rounded-full">
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          {visible ? "Hide passwords" : "Show passwords"}
        </Button>
        <div className="flex items-center gap-3">
          <p role="status" className="text-sm text-accent-lime">
            {saved && "Password updated."}
          </p>
          <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
