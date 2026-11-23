"use client";

import { Send } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { FormField } from "@/components/organizerComponent/onboarding/formField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Ticket, TicketTransferSchema } from "@/types/ticket";

interface TransferDialogProps {
  ticket: Ticket;
  ownerEmail: string;
  onTransferred: (toEmail: string) => void;
}

// Stands in for POST /tickets/{id}/transfer. The H-1 lock (423) is checked before this opens.
export function TransferDialog({ ticket, ownerEmail, onTransferred }: TransferDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [error, setError] = useState<string>();

  function handleOpenChange(next: boolean) {
    if (next) {
      setEmail("");
      setUnderstood(false);
      setError(undefined);
    }
    setOpen(next);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = TicketTransferSchema.safeParse({ to_email: email.trim() });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    if (result.data.to_email.toLowerCase() === ownerEmail.toLowerCase()) {
      setError("That's your own email. Enter the other person's email.");
      return;
    }
    setOpen(false);
    onTransferred(result.data.to_email);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" hoverScale={1} className="h-11 w-full rounded-full">
          <Send aria-hidden="true" />
          Transfer ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-2xl">Transfer this ticket</DialogTitle>
          <DialogDescription className="text-text-primary/70">
            {ticket.tier_name} for {ticket.event_title}, {ticket.session_name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField id="transfer-email" label="Recipient's email" hint="They sign in with this email to find the ticket." error={error}>
            <Input
              id="transfer-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(undefined);
              }}
              aria-invalid={error ? true : undefined}
              placeholder="friend@example.com"
              className="h-11"
            />
          </FormField>

          <div className="flex items-start gap-3 rounded-2xl bg-bg-surface-2 p-4">
            <Checkbox
              id="transfer-understood"
              checked={understood}
              onCheckedChange={(value) => setUnderstood(value === true)}
              className="mt-0.5 border-text-primary/50 data-[state=checked]:border-accent-lime data-[state=checked]:bg-accent-lime data-[state=checked]:text-bg-base"
            />
            <Label htmlFor="transfer-understood" className="text-sm leading-5 font-normal">
              I understand this ticket and its QR code stop working for me, and the transfer cannot be undone.
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" hoverScale={1} onClick={() => setOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" hoverScale={1.02} disabled={!understood} className="rounded-full px-5 font-semibold">
              Send ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
