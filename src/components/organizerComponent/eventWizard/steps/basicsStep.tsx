"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipToggleGroup } from "@/components/userComponent/shared/chipToggleGroup";
import type { EventBasicsForm } from "@/types/eventForm";
import { DocumentField } from "../../onboarding/documentField";
import { FormField } from "../../onboarding/formField";
import { FormSection } from "../../onboarding/formSection";

interface BasicsStepProps {
  value: EventBasicsForm;
  errors: Record<string, string>;
  categories: string[];
  onChange: (value: EventBasicsForm) => void;
}

export function BasicsStep({ value, errors, categories, onChange }: BasicsStepProps) {
  const set = <K extends keyof EventBasicsForm>(key: K, next: EventBasicsForm[K]) => onChange({ ...value, [key]: next });

  return (
    <div className="space-y-6">
      <FormSection id="basics-about" title="About the event" description="What fans read first on the event page.">
        <FormField id="title" label="Event title" error={errors.title}>
          <Input
            id="title"
            value={value.title}
            onChange={(event) => set("title", event.target.value)}
            aria-invalid={errors.title ? true : undefined}
            placeholder="e.g. Rooftop Sessions Vol. 3"
            className="h-11"
          />
        </FormField>
        <FormField
          id="description"
          label="Description"
          hint="Who is playing, what to expect, age limits and anything fans should bring."
          error={errors.description}
        >
          <Textarea
            id="description"
            value={value.description}
            onChange={(event) => set("description", event.target.value)}
            aria-invalid={errors.description ? true : undefined}
            rows={6}
          />
        </FormField>
        <div className="space-y-2">
          <p className="text-sm font-medium">Categories</p>
          <ChipToggleGroup
            label="Categories"
            size="sm"
            options={categories.map((category) => ({ value: category, label: category }))}
            value={value.categories}
            onChange={(next) => set("categories", next)}
          />
          {errors.categories && <p className="text-sm text-danger">{errors.categories}</p>}
        </div>
      </FormSection>

      <FormSection
        id="basics-artwork"
        title="Artwork"
        description="The poster is used on cards and tickets. The banner sits at the top of the event page."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <DocumentField
            id="poster"
            label="Poster"
            hint="Portrait, 4:5. JPG, PNG or WebP up to 5 MB."
            accept="image"
            value={value.poster}
            error={errors.poster}
            onChange={(file) => set("poster", file)}
          />
          <DocumentField
            id="banner"
            label="Banner"
            hint="Wide, about 18:7. JPG, PNG or WebP up to 5 MB."
            accept="image"
            value={value.banner}
            error={errors.banner}
            onChange={(file) => set("banner", file)}
          />
        </div>
      </FormSection>
    </div>
  );
}
