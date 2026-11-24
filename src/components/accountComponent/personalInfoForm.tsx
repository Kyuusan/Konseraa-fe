"use client";

import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { OptionSelect } from "@/components/organizerComponent/shared/optionSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/userComponent/shared/datePicker";
import { GENDERS, type PersonalInfo, PersonalInfoSchema } from "@/types/user";

const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  female: "Female",
  male: "Male",
  unspecified: "Prefer not to say",
};

interface PersonalInfoFormProps {
  initial: PersonalInfo;
  /** Latest year offered for the date of birth. */
  currentYear: number;
}

// The optional user_profiles fields. Stands in for PUT /users/me; all can stay empty.
export function PersonalInfoForm({ initial, currentYear }: PersonalInfoFormProps) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const text = (key: "city" | "province" | "postal_code" | "country") => ({
    id: `info-${key}`,
    value: values[key],
    "aria-invalid": errors[key] ? true : undefined,
    onChange: (event: { target: { value: string } }) => set(key, event.target.value),
    className: "h-11",
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = PersonalInfoSchema.safeParse(values);
    setErrors(result.success ? {} : Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
    if (result.success) setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="info-dob" label="Date of birth (optional)" error={errors.date_of_birth}>
          <DatePicker
            id="info-dob"
            value={values.date_of_birth}
            onChange={(date) => set("date_of_birth", date)}
            placeholder="Pick your birthday"
            disableFuture
            yearPicker={{ from: currentYear - 100, to: currentYear }}
          />
        </FormField>
        <FormField id="info-gender" label="Gender (optional)">
          <OptionSelect
            id="info-gender"
            value={values.gender}
            options={GENDERS.map((gender) => ({ value: gender, label: GENDER_LABELS[gender] }))}
            onChange={(gender) => set("gender", gender)}
          />
        </FormField>
      </div>
      <FormField id="info-address" label="Address (optional)" error={errors.address_line}>
        <Textarea
          id="info-address"
          value={values.address_line}
          onChange={(event) => set("address_line", event.target.value)}
          aria-invalid={errors.address_line ? true : undefined}
          rows={2}
          placeholder="Street, number, district"
        />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="info-city" label="City" error={errors.city}>
          <Input {...text("city")} autoComplete="address-level2" />
        </FormField>
        <FormField id="info-province" label="Province" error={errors.province}>
          <Input {...text("province")} autoComplete="address-level1" />
        </FormField>
        <FormField id="info-postal_code" label="Postal code" error={errors.postal_code}>
          <Input {...text("postal_code")} inputMode="numeric" maxLength={5} autoComplete="postal-code" />
        </FormField>
        <FormField id="info-country" label="Country" error={errors.country}>
          <Input {...text("country")} autoComplete="country-name" />
        </FormField>
      </div>
      <div className="flex items-center justify-end gap-3">
        <p role="status" className="text-sm text-accent-lime">
          {saved && "Saved."}
        </p>
        <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
          Save personal info
        </Button>
      </div>
    </form>
  );
}
