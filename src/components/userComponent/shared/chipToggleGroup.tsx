"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";

type ChipOption = { value: string; label: string };

interface ChipToggleGroupProps {
  label: string;
  options: ChipOption[];
  value: string[];
  onChange: (value: string[]) => void;
  size?: "sm" | "default";
  className?: string;
}

// Multi-select pills. Built on the Animate UI Button rather than its ToggleGroup,
// whose items are forced to flex-1/min-w-0 and collapse to zero width when wrapping.
export function ChipToggleGroup({ label, options, value, onChange, size = "default", className }: ChipToggleGroupProps) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const pressed = value.includes(option.value);
        return (
          <Button
            key={option.value}
            variant="outline"
            hoverScale={1}
            aria-pressed={pressed}
            onClick={() => toggle(option.value)}
            className={cn(
              "rounded-full font-semibold",
              size === "sm" ? "h-8 px-3" : "h-10 px-4",
              pressed &&
                "border-accent-lime bg-accent-lime text-bg-base hover:bg-accent-lime/90 hover:text-bg-base dark:border-accent-lime dark:bg-accent-lime dark:hover:bg-accent-lime/90",
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
