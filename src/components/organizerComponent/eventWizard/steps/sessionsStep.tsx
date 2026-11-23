"use client";

import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/userComponent/shared/datePicker";
import type { EventSessionForm } from "@/types/eventForm";
import { FormField } from "../../onboarding/formField";
import { FormSection } from "../../onboarding/formSection";
import { AddRowButton, RowCard } from "../rowList";
import { emptySession } from "../wizardValues";

interface SessionsStepProps {
  value: EventSessionForm[];
  errors: Record<string, string>;
  timezoneLabel: string;
  onChange: (value: EventSessionForm[]) => void;
}

export function SessionsStep({ value, errors, timezoneLabel, onChange }: SessionsStepProps) {
  const update = (index: number, patch: Partial<EventSessionForm>) =>
    onChange(value.map((session, i) => (i === index ? { ...session, ...patch } : session)));

  return (
    <FormSection
      id="sessions"
      title="Sessions"
      description={`Each session is a separate show with its own date, lineup and ticket stock. Times are in ${timezoneLabel}.`}
    >
      {value.map((session, index) => {
        const id = (field: string) => `session-${index}-${field}`;
        const error = (field: string) => errors[`${index}.${field}`];
        return (
          <RowCard
            key={session.key}
            title={`Session ${index + 1}`}
            onRemove={value.length > 1 ? () => onChange(value.filter((_, i) => i !== index)) : undefined}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id={id("name")} label="Session name" error={error("name")}>
                <Input
                  id={id("name")}
                  value={session.name}
                  onChange={(event) => update(index, { name: event.target.value })}
                  aria-invalid={error("name") ? true : undefined}
                  placeholder="e.g. Day 1 or Main show"
                  className="h-11"
                />
              </FormField>
              <FormField id={id("date")} label="Date" error={error("date")}>
                <DatePicker
                  id={id("date")}
                  value={session.date}
                  onChange={(date) => update(index, { date })}
                  disablePast
                  invalid={Boolean(error("date"))}
                />
              </FormField>
              <FormField id={id("start")} label="Doors open" error={error("start")}>
                <Input
                  id={id("start")}
                  type="time"
                  value={session.start}
                  onChange={(event) => update(index, { start: event.target.value })}
                  aria-invalid={error("start") ? true : undefined}
                  className="h-11"
                />
              </FormField>
              <FormField id={id("end")} label="Ends" error={error("end")}>
                <Input
                  id={id("end")}
                  type="time"
                  value={session.end}
                  onChange={(event) => update(index, { end: event.target.value })}
                  aria-invalid={error("end") ? true : undefined}
                  className="h-11"
                />
              </FormField>
            </div>
            <FormField id={id("lineup")} label="Lineup" hint="Separate artists with commas, headliner first." error={error("lineup")}>
              <Input
                id={id("lineup")}
                value={session.lineup}
                onChange={(event) => update(index, { lineup: event.target.value })}
                aria-invalid={error("lineup") ? true : undefined}
                placeholder="e.g. Hindia, Reality Club, Grrrl Gang"
                className="h-11"
              />
            </FormField>
          </RowCard>
        );
      })}
      {errors[""] && <p className="text-sm text-danger">{errors[""]}</p>}
      <AddRowButton label="Add session" onClick={() => onChange([...value, emptySession()])} />
    </FormSection>
  );
}
