"use client";

import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { Input } from "@/components/ui/input";
import { type ProfileDetails, ProfileDetailsSchema } from "@/types/notification";

interface ProfileDetailsFormProps {
  initial: ProfileDetails;
  email: string;
  /** Gatekeeper accounts are managed by their organizer. */
  readOnly?: boolean;
}

export function ProfileDetailsForm({ initial, email, readOnly }: ProfileDetailsFormProps) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const field = (key: keyof ProfileDetails) => ({
    id: `profile-${key}`,
    value: values[key],
    readOnly,
    "aria-invalid": errors[key] ? true : undefined,
    onChange: (event: { target: { value: string } }) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setSaved(false);
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ProfileDetailsSchema.safeParse(values);
    setErrors(result.success ? {} : Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
    // Stands in for PUT /users/me.
    if (result.success) setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="profile-full_name" label="Full name" error={errors.full_name}>
          <Input {...field("full_name")} autoComplete="name" className="h-11" />
        </FormField>
        <FormField id="profile-phone" label="Phone" error={errors.phone}>
          <Input {...field("phone")} type="tel" autoComplete="tel" className="h-11" />
        </FormField>
      </div>
      <FormField id="profile-email" label="Email" hint="Used to sign in. Changing it needs a new verification code.">
        <Input id="profile-email" value={email} readOnly className="h-11 text-text-primary/70" />
      </FormField>
      {readOnly ? (
        <p className="text-sm text-text-primary/70">Your organizer manages these details. Ask them to change anything here.</p>
      ) : (
        <div className="flex items-center justify-end gap-3">
          <p role="status" className="text-sm text-accent-lime">
            {saved && "Saved."}
          </p>
          <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
            Save changes
          </Button>
        </div>
      )}
    </form>
  );
}
