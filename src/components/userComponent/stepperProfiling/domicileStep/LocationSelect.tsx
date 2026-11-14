"use client";

import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type LocationOption = { value: string; label: string; icon?: ReactNode };

interface LocationSelectProps {
  id: string;
  label: string;
  placeholder: string;
  options: LocationOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LocationSelect({ id, label, placeholder, options, value, onChange, disabled }: LocationSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className="h-14! w-full rounded-[10px] bg-bg-surface-2 px-4 text-base">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {/* Lets the wheel scroll the list instead of the Lenis-smoothed page. */}
        <SelectContent data-lenis-prevent className="max-h-64">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
