"use client";

import { Expand } from "lucide-react";
import Image from "next/image";
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
  src: string;
  eventTitle: string;
  description?: string;
  /** "card": thumbnail with a button. "inline": the map shown in full, with an expand icon in its corner. */
  variant?: "card" | "inline";
  className?: string;
}

// `unoptimized` keeps SVG maps and local blob previews (from the organizer's upload) working.
export function SeatMapPreview({
  src,
  eventTitle,
  description = "See where each ticket tier is before you choose.",
  variant = "card",
  className,
}: SeatMapPreviewProps) {
  return (
    <Dialog>
      {variant === "inline" ? (
        <figure className={cn("overflow-hidden rounded-[20px] bg-bg-surface", className)}>
          <div className="relative h-[min(65dvh,32rem)] w-full bg-bg-base">
            <Image
              src={src}
              alt={`Seat map for ${eventTitle}`}
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                hoverScale={1.08}
                aria-label="View the seat map larger"
                className="absolute top-3 right-3 rounded-full bg-bg-surface-2/90 backdrop-blur-sm hover:bg-bg-surface-2"
              >
                <Expand aria-hidden="true" />
              </Button>
            </DialogTrigger>
          </div>
          <figcaption className="px-5 py-3 text-sm text-text-primary/70">
            <span className="font-semibold text-text-primary">Seat map.</span> {description}
          </figcaption>
        </figure>
      ) : (
        <div className={cn("flex items-center gap-4 rounded-[20px] bg-bg-surface p-4", className)}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              hoverScale={1.03}
              aria-label="Open the seat map"
              className="relative aspect-4/5 h-auto w-20 shrink-0 overflow-hidden rounded-xl bg-bg-surface-2 p-0 hover:bg-bg-surface-2"
            >
              <Image src={src} alt="" fill unoptimized sizes="80px" className="object-cover" />
            </Button>
          </DialogTrigger>
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

      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-3 rounded-[20px] border-text-primary/10 bg-bg-surface p-3 sm:max-w-3xl sm:p-5">
        <DialogHeader className="pr-10 text-left">
          <DialogTitle className="font-heading text-xl">Seat map · {eventTitle}</DialogTitle>
          <DialogDescription className="text-text-primary/70">Not to scale. Areas follow the ticket tiers.</DialogDescription>
        </DialogHeader>
        <div className="relative h-[min(75dvh,56rem)] w-full overflow-hidden rounded-2xl bg-bg-base">
          <Image src={src} alt={`Seat map for ${eventTitle}`} fill unoptimized sizes="(min-width: 768px) 48rem, 100vw" className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
