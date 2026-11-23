"use client";

import { useState } from "react";
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

interface CancelOrderDialogProps {
  bookingCode: string;
  onCancelled: () => void;
  triggerClassName?: string;
}

// Stands in for POST /bookings/{id}/cancel (in spec). Only for orders not paid yet.
export function CancelOrderDialog({ bookingCode, onCancelled, triggerClassName }: CancelOrderDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" hoverScale={1} className={cn("rounded-full", triggerClassName)}>
          Cancel order
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-2xl">Cancel {bookingCode}?</DialogTitle>
          <DialogDescription className="text-text-primary/70">
            The tickets held for you are released and the payment code stops working. Don&apos;t pay for this order after
            cancelling it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" hoverScale={1} onClick={() => setOpen(false)} className="rounded-full">
            Keep order
          </Button>
          <Button
            variant="destructive"
            hoverScale={1}
            onClick={() => {
              setOpen(false);
              onCancelled();
            }}
            className="rounded-full bg-danger font-semibold text-bg-base hover:bg-danger/90 dark:bg-danger"
          >
            Cancel order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
