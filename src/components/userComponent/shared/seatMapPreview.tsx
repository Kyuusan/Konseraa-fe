"use client";

import { Expand, Map as MapIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { cn } from "@/lib/utils";

interface SeatMapPreviewProps {
  eventTitle: string;
  /** The venue drawn for a column (SectionMap size="compact"); only the inline variant shows it. */
  map?: ReactNode;
  /** The same venue drawn larger for the dialog (SectionMap size="full"). */
  fullMap: ReactNode;
  description?: string;
  /** "card": a short teaser with a button. "inline": the map itself, with an expand icon in its corner. */
  variant?: "card" | "inline";
  className?: string;
}

export function SeatMapPreview({
  eventTitle,
  map,
  fullMap,
  description = "See where each ticket tier is before you choose.",
  variant = "card",
  className,
}: SeatMapPreviewProps) {
  return (
    <Dialog>
      {variant === "inline" ? (
        <div className={cn("relative rounded-[20px] bg-bg-surface p-5", className)}>
          <div className="mb-4 flex items-start justify-between gap-3 pr-10">
            <p className="text-sm">
              <span className="font-semibold">Seat map.</span> <span className="text-text-primary/70">{description}</span>
            </p>
          </div>
          {map}
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              hoverScale={1.08}
              aria-label="View the seat map larger"
              className="absolute top-3 right-3 rounded-full bg-bg-surface-2 hover:bg-bg-surface-2/80"
            >
              <Expand aria-hidden="true" />
            </Button>
          </DialogTrigger>
        </div>
      ) : (
        <div className={cn("flex items-center gap-4 rounded-[20px] bg-bg-surface p-4", className)}>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-bg-surface-2 text-accent-lime">
            <MapIcon className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-2">
            <div>
              <p className="font-heading text-lg font-semibold">Seat map</p>
              <p className="text-sm text-text-primary/70">{description}</p>
            </div>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" hoverScale={1} className="rounded-full">
                <Expand aria-hidden="true" />
                View full map
              </Button>
            </DialogTrigger>
          </div>
        </div>
      )}

      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto rounded-[20px] border-text-primary/10 bg-bg-surface p-4 sm:max-w-3xl sm:p-6">
        <DialogHeader className="pr-10 text-left">
          <DialogTitle className="font-heading text-xl">Seat map · {eventTitle}</DialogTitle>
          <DialogDescription className="text-text-primary/70">Not to scale. Each area lists the tiers that get you in.</DialogDescription>
        </DialogHeader>
        {fullMap}
      </DialogContent>
    </Dialog>
  );
}
