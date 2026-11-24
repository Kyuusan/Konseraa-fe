"use client";

import { Input } from "@/components/ui/input";
import { SectionMap } from "@/components/userComponent/shared/sectionMap";
import { MAX_TICKETS_PER_TRANSACTION, TIER_TYPE_LABELS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { TICKET_TIER_TYPES } from "@/types/event";
import type { EventSectionForm, EventTierForm } from "@/types/eventForm";
import { FormField } from "../../onboarding/formField";
import { FormSection } from "../../onboarding/formSection";
import { OptionSelect } from "../../shared/optionSelect";
import { AddRowButton, RowCard } from "../rowList";
import { emptyTier, layoutFromSections, mapTiersFromForm } from "../wizardValues";

const TIER_OPTIONS = TICKET_TIER_TYPES.map((type) => ({ value: type, label: TIER_TYPE_LABELS[type] }));
const NO_AREA = "none";

interface TicketsStepProps {
  value: EventTierForm[];
  errors: Record<string, string>;
  capacity: number;
  /** Areas from the venue step; each tier can point to one (ticket_tiers.venue_section_id). */
  sections: EventSectionForm[];
  onChange: (value: EventTierForm[]) => void;
}

export function TicketsStep({ value, errors, capacity, sections, onChange }: TicketsStepProps) {
  const update = (index: number, patch: Partial<EventTierForm>) =>
    onChange(value.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  const totalQuota = value.reduce((sum, tier) => sum + (Number(tier.quota) || 0), 0);
  const layout = layoutFromSections(sections);
  const areaOptions = [
    { value: NO_AREA, label: "No specific area" },
    ...layout.sections.map((section) => ({ value: section.id, label: section.name })),
  ];

  return (
    <div className="space-y-6">
      <FormSection id="tickets" title="Ticket tiers" description="Prices are in USD. Each tier's quota is available in every session.">
        {value.map((tier, index) => {
          const id = (field: string) => `tier-${index}-${field}`;
          const error = (field: string) => errors[`${index}.${field}`];
          const number = (field: "price" | "quota" | "max_per_transaction") => ({
            id: id(field),
            type: "number",
            value: tier[field],
            "aria-invalid": error(field) ? true : undefined,
            onChange: (event: { target: { value: string } }) => update(index, { [field]: event.target.value }),
            className: "h-11",
          });
          // An area removed in the venue step no longer counts.
          const area = layout.sections.some((section) => section.id === tier.section_key) ? tier.section_key : NO_AREA;
          return (
            <RowCard
              key={tier.key}
              title={tier.name || `Tier ${index + 1}`}
              onRemove={value.length > 1 ? () => onChange(value.filter((_, i) => i !== index)) : undefined}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id={id("name")} label="Tier name" hint="What buyers see, e.g. Festival or VIP Deck." error={error("name")}>
                  <Input
                    id={id("name")}
                    value={tier.name}
                    onChange={(event) => update(index, { name: event.target.value })}
                    aria-invalid={error("name") ? true : undefined}
                    className="h-11"
                  />
                </FormField>
                <FormField id={id("tier_type")} label="Type" error={error("tier_type")}>
                  <OptionSelect
                    id={id("tier_type")}
                    value={tier.tier_type}
                    options={TIER_OPTIONS}
                    onChange={(tier_type) => update(index, { tier_type })}
                  />
                </FormField>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <FormField id={id("price")} label="Price (USD)" error={error("price")}>
                  <Input {...number("price")} inputMode="decimal" min={0} step="0.5" />
                </FormField>
                <FormField id={id("quota")} label="Quota per session" error={error("quota")}>
                  <Input {...number("quota")} inputMode="numeric" min={1} />
                </FormField>
                <FormField
                  id={id("max_per_transaction")}
                  label="Max per order"
                  hint={`1 to ${MAX_TICKETS_PER_TRANSACTION}.`}
                  error={error("max_per_transaction")}
                >
                  <Input {...number("max_per_transaction")} inputMode="numeric" min={1} max={MAX_TICKETS_PER_TRANSACTION} />
                </FormField>
              </div>
              {layout.sections.length > 0 && (
                <FormField id={id("area")} label="Area" hint="Where this ticket gets you in, as shown on the seat map.">
                  <OptionSelect
                    id={id("area")}
                    value={area}
                    options={areaOptions}
                    onChange={(key) => update(index, { section_key: key === NO_AREA ? "" : key })}
                  />
                </FormField>
              )}
            </RowCard>
          );
        })}
        {errors[""] && <p className="text-sm text-danger">{errors[""]}</p>}
        <AddRowButton label="Add tier" onClick={() => onChange([...value, emptyTier()])} />
        <p className={totalQuota > capacity ? "text-sm text-warning" : "text-sm text-text-primary/70"}>
          {formatNumber(totalQuota)} tickets per session for a venue capacity of {formatNumber(capacity)}.
          {totalQuota > capacity && " That is more than the venue holds."}
        </p>
      </FormSection>

      {layout.sections.length > 0 && (
        <FormSection id="tickets-map" title="Seat map" description="How buyers will see your areas and tiers. Add or change areas in the Venue step.">
          <SectionMap layout={layout} tiers={mapTiersFromForm(value)} />
        </FormSection>
      )}
    </div>
  );
}
