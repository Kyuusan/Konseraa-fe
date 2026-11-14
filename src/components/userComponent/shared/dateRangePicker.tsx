"use client";

import type { DateRange } from "react-day-picker";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/animate-ui/components/radix/popover";
import { Calendar } from "@/components/ui/calendar";

// Works in "YYYY-MM-DD" strings, the same shape as the API's date_from / date_to.
const toDate = (value: string) => (value ? new Date(`${value}T00:00:00`) : undefined);
const toValue = (date: Date | undefined) =>
  date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

const labelFormatter = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" });

interface DateRangePickerProps {
  id?: string;
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}

export function DateRangePicker({ id, from, to, onChange }: DateRangePickerProps) {
  const start = toDate(from);
  const end = toDate(to);
  const label = start
    ? `${labelFormatter.format(start)}${end ? ` – ${labelFormatter.format(end)}` : ""}`
    : "Any date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          hoverScale={1}
          className={start ? "w-full justify-start" : "w-full justify-start text-muted-foreground"}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-2xl p-2">
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={{ from: start, to: end }}
          onSelect={(range: DateRange | undefined) => onChange({ from: toValue(range?.from), to: toValue(range?.to) })}
        />
        {start && (
          <Button
            variant="ghost"
            size="sm"
            hoverScale={1}
            className="w-full rounded-full"
            onClick={() => onChange({ from: "", to: "" })}
          >
            Clear dates
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
