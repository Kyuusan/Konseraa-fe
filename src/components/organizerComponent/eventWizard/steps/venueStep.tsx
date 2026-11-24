"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VENUE_TYPES } from "@/types/event";
import type { EventSectionForm, EventVenueForm } from "@/types/eventForm";
import { DocumentField } from "../../onboarding/documentField";
import { FormField } from "../../onboarding/formField";
import { FormSection } from "../../onboarding/formSection";
import { OptionSelect } from "../../shared/optionSelect";
import { TIMEZONES, VENUE_TYPE_LABELS } from "../wizardValues";
import { AreasEditor } from "./areasEditor";

interface VenueStepProps {
  value: EventVenueForm;
  sections: EventSectionForm[];
  errors: Record<string, string>;
  onChange: (value: EventVenueForm) => void;
  onSectionsChange: (value: EventSectionForm[]) => void;
}

export function VenueStep({ value, sections, errors, onChange, onSectionsChange }: VenueStepProps) {
  const set = <K extends keyof EventVenueForm>(key: K, next: EventVenueForm[K]) => onChange({ ...value, [key]: next });
  const text = (key: "name" | "city" | "capacity") => ({
    id: `venue-${key}`,
    value: value[key],
    "aria-invalid": errors[key] ? true : undefined,
    onChange: (event: { target: { value: string } }) => set(key, event.target.value),
  });

  return (
    <div className="space-y-6">
      <FormSection id="venue-place" title="Venue" description="Where the show happens. Times are shown to fans in the venue's time zone.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="venue-name" label="Venue name" error={errors.name}>
            <Input {...text("name")} placeholder="e.g. Skyline Rooftop" className="h-11" />
          </FormField>
          <FormField id="venue-type" label="Setting" error={errors.type}>
            <OptionSelect
              id="venue-type"
              value={value.type}
              options={VENUE_TYPES.map((type) => ({ value: type, label: VENUE_TYPE_LABELS[type] }))}
              onChange={(next) => set("type", next)}
            />
          </FormField>
          <FormField id="venue-city" label="City" error={errors.city}>
            <Input {...text("city")} placeholder="e.g. Jakarta" className="h-11" />
          </FormField>
          <FormField id="venue-timezone" label="Time zone" error={errors.timezone}>
            <OptionSelect id="venue-timezone" value={value.timezone} options={TIMEZONES} onChange={(next) => set("timezone", next)} />
          </FormField>
        </div>
        <FormField id="venue-address" label="Full address" error={errors.address}>
          <Textarea
            id="venue-address"
            value={value.address}
            onChange={(event) => set("address", event.target.value)}
            aria-invalid={errors.address ? true : undefined}
            placeholder="Street, number, district, postal code"
            rows={3}
          />
        </FormField>
        <FormField
          id="venue-capacity"
          label="Capacity"
          hint="The most people the venue may hold at once, as stated on the permit."
          error={errors.capacity}
        >
          <Input {...text("capacity")} type="number" inputMode="numeric" min={1} className="h-11 sm:max-w-56" />
        </FormField>
      </FormSection>

      <FormSection
        id="venue-areas"
        title="Areas and seat map"
        description="Split the venue into areas, standing or with numbered seats. Each ticket tier points to one, and buyers see them as the seat map. Optional."
      >
        <AreasEditor value={sections} errors={errors} venueCapacity={Number(value.capacity) || 0} onChange={onSectionsChange} />
      </FormSection>

      <FormSection
        id="venue-permit"
        title="Event permit"
        description="Every event is checked on its own. The permit must name this venue, date and capacity."
      >
        <DocumentField
          id="permit"
          label="Crowd permit or venue approval letter"
          hint="PDF up to 5 MB."
          accept="pdf"
          value={value.permit}
          error={errors.permit}
          onChange={(file) => set("permit", file)}
        />
      </FormSection>
    </div>
  );
}
