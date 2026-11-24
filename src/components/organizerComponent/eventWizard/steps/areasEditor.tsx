"use client";

import { Switch } from "@/components/animate-ui/components/radix/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionMap } from "@/components/userComponent/shared/sectionMap";
import { formatNumber } from "@/lib/format";
import { type EventSectionForm, MAX_SEATS_PER_ROW, MAX_SECTION_ROWS } from "@/types/eventForm";
import { FormField } from "../../onboarding/formField";
import { AddRowButton, RowCard } from "../rowList";
import { emptySection, layoutFromSections, sectionCapacity } from "../wizardValues";

interface AreasEditorProps {
  value: EventSectionForm[];
  /** Keyed "sections.<index>.<field>". */
  errors: Record<string, string>;
  venueCapacity: number;
  onChange: (value: EventSectionForm[]) => void;
}

// The venue's areas (venue_sections). Seated areas get a seat grid (seats with coords),
// and the seat map buyers see is drawn from these, there is no image upload.
export function AreasEditor({ value, errors, venueCapacity, onChange }: AreasEditorProps) {
  const update = (index: number, patch: Partial<EventSectionForm>) =>
    onChange(value.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  const total = value.reduce((sum, section) => sum + sectionCapacity(section), 0);
  const layout = layoutFromSections(value);

  return (
    <div className="space-y-5">
      {value.map((section, index) => {
        const id = (field: string) => `section-${index}-${field}`;
        const error = (field: string) => errors[`sections.${index}.${field}`];
        const text = (field: "name" | "capacity" | "rows" | "seats_per_row", extra: Record<string, unknown> = {}) => ({
          id: id(field),
          value: section[field],
          "aria-invalid": error(field) ? true : undefined,
          onChange: (event: { target: { value: string } }) => update(index, { [field]: event.target.value }),
          className: "h-11",
          ...extra,
        });
        return (
          <RowCard key={section.key} title={section.name || `Area ${index + 1}`} onRemove={() => onChange(value.filter((_, i) => i !== index))}>
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <FormField id={id("name")} label="Area name" hint="Front of house first, e.g. VIP Standing, then Festival." error={error("name")}>
                <Input {...text("name")} />
              </FormField>
              <div className="flex h-11 items-center gap-3">
                <Switch
                  id={id("seated")}
                  checked={section.is_seated}
                  onCheckedChange={(is_seated) => update(index, { is_seated })}
                />
                <Label htmlFor={id("seated")} className="text-sm">
                  Numbered seats
                </Label>
              </div>
            </div>
            {section.is_seated ? (
              <div className="grid gap-5 sm:grid-cols-3 sm:items-end">
                <FormField id={id("rows")} label="Rows" hint={`Rows A, B, C… (up to ${MAX_SECTION_ROWS}).`} error={error("rows")}>
                  <Input {...text("rows", { type: "number", inputMode: "numeric", min: 1, max: MAX_SECTION_ROWS })} />
                </FormField>
                <FormField id={id("seats_per_row")} label="Seats per row" hint={`Up to ${MAX_SEATS_PER_ROW}.`} error={error("seats_per_row")}>
                  <Input {...text("seats_per_row", { type: "number", inputMode: "numeric", min: 1, max: MAX_SEATS_PER_ROW })} />
                </FormField>
                <p className="pb-3 text-sm text-text-primary/70">= {formatNumber(sectionCapacity(section))} seats</p>
              </div>
            ) : (
              <FormField id={id("capacity")} label="Standing capacity" error={error("capacity")}>
                <Input {...text("capacity", { type: "number", inputMode: "numeric", min: 1, className: "h-11 sm:max-w-56" })} />
              </FormField>
            )}
          </RowCard>
        );
      })}

      <AddRowButton label="Add area" onClick={() => onChange([...value, emptySection()])} />

      {value.length > 0 && (
        <p className={total > venueCapacity && venueCapacity > 0 ? "text-sm text-warning" : "text-sm text-text-primary/70"}>
          Areas hold {formatNumber(total)} of the venue&apos;s {formatNumber(venueCapacity)}.
          {total > venueCapacity && venueCapacity > 0 && " That is more than the venue holds."}
        </p>
      )}

      {layout.sections.length > 0 && (
        <div className="space-y-2 rounded-2xl bg-bg-surface-2 p-4">
          <p className="text-sm font-semibold">Seat map preview</p>
          <SectionMap layout={layout} tiers={[]} />
        </div>
      )}
    </div>
  );
}
