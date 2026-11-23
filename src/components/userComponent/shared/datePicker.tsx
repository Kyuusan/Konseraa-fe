"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/animate-ui/components/radix/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Same "YYYY-MM-DD" string shape as DateRangePicker.
const toDate = (value: string) => (value ? new Date(`${value}T00:00:00`) : undefined);
const toValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const labelFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Days before today cannot be picked. */
  disablePast?: boolean;
  invalid?: boolean;
  className?: string;
}

export function DatePicker({ id, value, onChange, placeholder = "Pick a date", disablePast, invalid, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  // Read the clock when the popover opens, not while rendering.
  const [today, setToday] = useState<Date>();
  const selected = toDate(value);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setToday(new Date(new Date().setHours(0, 0, 0, 0)));
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          hoverScale={1}
          aria-invalid={invalid ? true : undefined}
          className={cn("h-11 w-full justify-start font-normal", !selected && "text-muted-foreground", className)}
        >
          <CalendarDays aria-hidden="true" />
          {selected ? labelFormatter.format(selected) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-2xl p-2">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          disabled={disablePast && today ? { before: today } : undefined}
          onSelect={(date: Date | undefined) => {
            if (!date) return;
            onChange(toValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
