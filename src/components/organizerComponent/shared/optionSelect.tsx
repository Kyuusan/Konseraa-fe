"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptionSelectProps<T extends string> {
  id: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  invalid?: boolean;
  disabled?: boolean;
}

export function OptionSelect<T extends string>({ id, value, options, onChange, invalid, disabled }: OptionSelectProps<T>) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        const option = options.find((item) => item.value === next);
        if (option) onChange(option.value);
      }}
    >
      <SelectTrigger id={id} aria-invalid={invalid ? true : undefined} className="h-11! w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent data-lenis-prevent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
