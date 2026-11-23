"use client";

import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import {
  DEMO_APPLICATION_COOKIE,
  DEMO_STATE_COOKIE,
  type DemoApplicationSummary,
  writeDemoCookie,
} from "@/__fixtures__/demoState";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/animate-ui/components/radix/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type DocumentFile,
  ORGANIZER_TYPES,
  OrganizerApplicationSchema,
  type OrganizerType,
  type PersonInCharge,
} from "@/types/organizer";
import { DocumentField } from "./documentField";
import { FormField } from "./formField";
import { FormSection } from "./formSection";

const TYPE_LABELS: Record<OrganizerType, { title: string; body: string }> = {
  individual: { title: "Individual", body: "You organize shows in your own name." },
  company: { title: "Company", body: "A registered business, label or promoter." },
};


export function ApplicationForm({ initial }: { initial?: DemoApplicationSummary }) {
  const router = useRouter();
  const [organizerType, setOrganizerType] = useState<OrganizerType>(initial?.organizer_type ?? "company");
  const [fields, setFields] = useState({
    company_name: initial?.company_name ?? "",
    city: initial?.city ?? "",
    address: initial?.address ?? "",
  });
  const [pic, setPic] = useState<PersonInCharge>({
    full_name: initial?.pic_name ?? "",
    nik: "",
    phone: "",
    email: initial?.pic_email ?? "",
  });
  const [idCard, setIdCard] = useState<DocumentFile | null>(null);
  const [businessDocument, setBusinessDocument] = useState<DocumentFile | null>(null);
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (name: keyof typeof fields) => ({
    id: name,
    value: fields[name],
    "aria-invalid": errors[name] ? true : undefined,
    onChange: (event: { target: { value: string } }) => setFields((current) => ({ ...current, [name]: event.target.value })),
  });
  const picField = (name: keyof PersonInCharge) => ({
    id: `pic-${name}`,
    value: pic[name],
    "aria-invalid": errors[`person_in_charge.${name}`] ? true : undefined,
    onChange: (event: { target: { value: string } }) => setPic((current) => ({ ...current, [name]: event.target.value })),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = OrganizerApplicationSchema.safeParse({
      organizer_type: organizerType,
      ...fields,
      person_in_charge: pic,
      id_card: idCard,
      business_document: organizerType === "company" ? businessDocument : null,
      declaration,
    });

    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      return;
    }

    // Stands in for submitting to the backend: the demo state moves to "pending".
    const summary: DemoApplicationSummary = {
      company_name: result.data.company_name,
      organizer_type: result.data.organizer_type,
      city: result.data.city,
      address: result.data.address,
      pic_name: result.data.person_in_charge.full_name,
      pic_email: result.data.person_in_charge.email,
    };
    writeDemoCookie(DEMO_APPLICATION_COOKIE, JSON.stringify(summary));
    writeDemoCookie(DEMO_STATE_COOKIE, "pending");
    router.push("/organizer");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection id="organizer-heading" title="Organizer" description="How your organizer appears to fans and where it is based.">
        <RadioGroup
          value={organizerType}
          onValueChange={(value) => {
            const type = ORGANIZER_TYPES.find((item) => item === value);
            if (type) setOrganizerType(type);
          }}
          aria-label="Organizer type"
          className="grid gap-3 sm:grid-cols-2"
        >
          {ORGANIZER_TYPES.map((type) => (
            <Label
              key={type}
              htmlFor={`type-${type}`}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border bg-bg-surface-2 p-4 font-normal",
                organizerType === type ? "border-accent-lime" : "border-transparent",
              )}
            >
              <RadioGroupItem id={`type-${type}`} value={type} className="mt-0.5" />
              <span>
                <span className="block font-semibold">{TYPE_LABELS[type].title}</span>
                <span className="block text-sm text-text-muted">{TYPE_LABELS[type].body}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="company_name" label="Organizer name" hint="Shown to fans on your event pages." error={errors.company_name}>
            <Input {...field("company_name")} placeholder="e.g. Nada Kota Productions" className="h-11" />
          </FormField>
          <FormField id="city" label="City" error={errors.city}>
            <Input {...field("city")} placeholder="e.g. Jakarta" className="h-11" />
          </FormField>
        </div>
        <FormField id="address" label="Full address" error={errors.address}>
          <Textarea {...field("address")} placeholder="Street, number, district, postal code" rows={3} />
        </FormField>
      </FormSection>

      <FormSection
        id="pic-heading"
        title="Person in charge"
        description="The person accountable for events and payouts. The data must match the ID card."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="pic-full_name" label="Full name" error={errors["person_in_charge.full_name"]}>
            <Input {...picField("full_name")} autoComplete="name" className="h-11" />
          </FormField>
          <FormField id="pic-nik" label="NIK" hint="16 digits, as printed on the KTP." error={errors["person_in_charge.nik"]}>
            <Input {...picField("nik")} inputMode="numeric" maxLength={16} className="h-11" />
          </FormField>
          <FormField id="pic-phone" label="Phone" error={errors["person_in_charge.phone"]}>
            <Input {...picField("phone")} type="tel" autoComplete="tel" placeholder="+62…" className="h-11" />
          </FormField>
          <FormField id="pic-email" label="Email" error={errors["person_in_charge.email"]}>
            <Input {...picField("email")} type="email" autoComplete="email" className="h-11" />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        id="documents-heading"
        title="Documents"
        description="Used only to verify you. Event permits are uploaded later, per event."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <DocumentField
            id="id_card"
            label="ID card (KTP) of the person in charge"
            hint="JPG, PNG or PDF, up to 5 MB. Make sure the NIK is readable."
            value={idCard}
            error={errors.id_card}
            onChange={setIdCard}
          />
          {organizerType === "company" && (
            <DocumentField
              id="business_document"
              label="NIB or deed of establishment (optional)"
              hint="Helps us verify the company faster."
              value={businessDocument}
              onChange={setBusinessDocument}
            />
          )}
        </div>
      </FormSection>

      <div className="flex flex-col gap-5 rounded-[20px] bg-bg-surface p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="declaration"
              checked={declaration}
              onCheckedChange={(checked) => setDeclaration(checked === true)}
              className="mt-0.5 border-text-primary/50 data-[state=checked]:border-accent-lime data-[state=checked]:bg-accent-lime data-[state=checked]:text-bg-base"
            />
            <Label htmlFor="declaration" className="text-sm leading-5 font-normal">
              I confirm the data and documents are correct and belong to the person in charge.
            </Label>
          </div>
          {errors.declaration && <p className="text-sm text-danger">{errors.declaration}</p>}
        </div>
        <Button type="submit" hoverScale={1.02} className="h-12 shrink-0 rounded-full px-8 text-base font-semibold">
          Submit for verification
        </Button>
      </div>
    </form>
  );
}
