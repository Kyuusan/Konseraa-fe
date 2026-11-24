"use client";

import Link from "next/link";
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
import { cn } from "@/lib/utils";
import {
  type AccountOwner,
  type DocumentFile,
  LEGAL_ENTITY_TYPES,
  type LegalEntityType,
  OrganizerApplicationSchema,
} from "@/types/organizer";
import { DocumentField } from "./documentField";
import { FormField } from "./formField";
import { FormSection } from "./formSection";

const TYPE_LABELS: Record<LegalEntityType, { title: string; body: string }> = {
  individual: { title: "Individual", body: "You organize shows in your own name." },
  company: { title: "Company", body: "A registered business, label or promoter." },
};

interface ApplicationFormProps {
  initial?: DemoApplicationSummary;
  /** The signed-in account: the person in charge (organizers.user_id). */
  owner: AccountOwner;
}

// Asks only for what organizers and organizer_verifications store (backend models).
export function ApplicationForm({ initial, owner }: ApplicationFormProps) {
  const router = useRouter();
  const [entityType, setEntityType] = useState<LegalEntityType>(initial?.legal_entity_type ?? "company");
  const [companyName, setCompanyName] = useState(initial?.company_name ?? "");
  const [idCard, setIdCard] = useState<DocumentFile | null>(null);
  const [businessLicense, setBusinessLicense] = useState<DocumentFile | null>(null);
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = OrganizerApplicationSchema.safeParse({
      legal_entity_type: entityType,
      company_name: companyName,
      id_card: idCard,
      business_license: entityType === "company" ? businessLicense : null,
      declaration,
    });

    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      return;
    }

    // Stands in for creating the organizer and uploading its documents: the demo state moves to "pending".
    const summary: DemoApplicationSummary = {
      company_name: result.data.company_name,
      legal_entity_type: result.data.legal_entity_type,
    };
    writeDemoCookie(DEMO_APPLICATION_COOKIE, JSON.stringify(summary));
    writeDemoCookie(DEMO_STATE_COOKIE, "pending");
    router.push("/organizer");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection id="organizer-heading" title="Organizer" description="How your organizer appears to fans on event pages.">
        <RadioGroup
          value={entityType}
          onValueChange={(value) => {
            const type = LEGAL_ENTITY_TYPES.find((item) => item === value);
            if (type) setEntityType(type);
          }}
          aria-label="Organizer type"
          className="grid gap-3 sm:grid-cols-2"
        >
          {LEGAL_ENTITY_TYPES.map((type) => (
            <Label
              key={type}
              htmlFor={`type-${type}`}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border bg-bg-surface-2 p-4 font-normal",
                entityType === type ? "border-accent-lime" : "border-transparent",
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
        <FormField id="company_name" label="Organizer name" hint="Shown to fans on your event pages." error={errors.company_name}>
          <Input
            id="company_name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            aria-invalid={errors.company_name ? true : undefined}
            placeholder="e.g. Nada Kota Productions"
            className="h-11"
          />
        </FormField>
      </FormSection>

      <FormSection
        id="owner-heading"
        title="Person in charge"
        description="The organizer is tied to your account. You are accountable for its events and payouts."
      >
        <dl className="divide-y divide-text-primary/10 rounded-2xl bg-bg-surface-2 px-4 text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-text-primary/70">Name</dt>
            <dd className="font-medium">{owner.full_name}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-text-primary/70">Email</dt>
            <dd className="font-medium">{owner.email}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-text-primary/70">Phone</dt>
            <dd className="font-medium">{owner.phone ?? "Not set"}</dd>
          </div>
        </dl>
        <p className="text-sm text-text-primary/70">
          Not right?{" "}
          <Link href="/profile" className="font-medium text-accent-lime underline-offset-4 hover:underline">
            Update your profile
          </Link>{" "}
          first. The name must match your ID card.
        </p>
      </FormSection>

      <FormSection id="documents-heading" title="Documents" description="Used only to verify you. Event permits are uploaded later, per event.">
        <div className="grid gap-5 sm:grid-cols-2">
          <DocumentField
            id="id_card"
            label="Your ID card (KTP)"
            hint="JPG, PNG or PDF, up to 5 MB. Make sure your name is readable."
            value={idCard}
            error={errors.id_card}
            onChange={setIdCard}
          />
          {entityType === "company" && (
            <DocumentField
              id="business_license"
              label="NIB or deed of establishment (optional)"
              hint="Helps us verify the company faster."
              value={businessLicense}
              onChange={setBusinessLicense}
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
              I confirm the data and documents are correct and belong to me or my company.
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
