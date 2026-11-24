"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { cn } from "@/lib/utils";

// Thumbnails under a review; one opens full size in a dialog with the others below it.
// `unoptimized` keeps local previews (blob: URLs) of a review just posted working.
export function ReviewPhotos({ photos, author }: { photos: string[]; author: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const current = openIndex === null ? null : photos[openIndex];

  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <li key={photo}>
            <Button
              variant="ghost"
              hoverScale={1.03}
              onClick={() => setOpenIndex(index)}
              aria-label={`Open photo ${index + 1} of ${photos.length} from ${author}`}
              className="relative size-20 overflow-hidden rounded-xl bg-bg-surface-2 p-0 hover:bg-bg-surface-2 sm:size-24"
            >
              <Image src={photo} alt="" fill unoptimized sizes="96px" className="object-cover" />
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="gap-3 rounded-[20px] border-text-primary/10 bg-bg-surface p-3 sm:max-w-3xl sm:p-5">
          <DialogHeader className="pr-10 text-left">
            <DialogTitle className="font-heading text-xl">Photo from {author}</DialogTitle>
            <DialogDescription className="text-text-primary/70">
              {openIndex !== null && `${openIndex + 1} of ${photos.length}`}
            </DialogDescription>
          </DialogHeader>
          {current && (
            <div className="relative h-[min(70dvh,40rem)] w-full overflow-hidden rounded-2xl bg-bg-base">
              <Image src={current} alt={`Photo ${(openIndex ?? 0) + 1} from ${author}'s review`} fill unoptimized className="object-contain" />
            </div>
          )}
          {photos.length > 1 && (
            <div className="flex gap-2">
              {photos.map((photo, index) => (
                <Button
                  key={photo}
                  variant="ghost"
                  hoverScale={1}
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === openIndex}
                  className={cn(
                    "relative size-14 overflow-hidden rounded-lg p-0 opacity-60 hover:opacity-100",
                    index === openIndex && "opacity-100 ring-2 ring-accent-lime",
                  )}
                >
                  <Image src={photo} alt="" fill unoptimized sizes="56px" className="object-cover" />
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
