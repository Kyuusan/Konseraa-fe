"use client";

import { Plus, Shuffle } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Input } from "@/components/ui/input";
import { ChipToggleGroup } from "@/components/userComponent/shared/chipToggleGroup";
import { type Gatekeeper, type GatekeeperForm, GatekeeperFormSchema } from "@/types/gatekeeper";
import { FormField } from "../onboarding/formField";
import { CredentialsCard, generatePassword } from "./credentialsCard";

interface AddGatekeeperDialogProps {
  organizerId: string;
  events: { id: string; title: string }[];
  takenEmails: string[];
  onCreate: (gatekeeper: Gatekeeper) => void;
}

const emptyForm = (): GatekeeperForm => ({ full_name: "", email: "", event_ids: [], password: generatePassword() });

export function AddGatekeeperDialog({ organizerId, events, takenEmails, onCreate }: AddGatekeeperDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<GatekeeperForm>({ full_name: "", email: "", event_ids: [], password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ name: string; email: string; password: string } | null>(null);

  const set = <K extends keyof GatekeeperForm>(key: K, value: GatekeeperForm[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  function handleOpenChange(next: boolean) {
    // Every time the dialog opens it starts clean, with a fresh password.
    if (next) {
      setValues(emptyForm());
      setErrors({});
      setCreated(null);
    }
    setOpen(next);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = GatekeeperFormSchema.safeParse(values);
    const next: Record<string, string> = result.success
      ? {}
      : Object.fromEntries(result.error.issues.toReversed().map((issue) => [issue.path.join("."), issue.message]));
    if (result.success && takenEmails.includes(result.data.email.toLowerCase())) {
      next.email = "This email already has a gatekeeper account.";
    }
    setErrors(next);
    if (!result.success || Object.keys(next).length > 0) return;

    // Stands in for creating the account on the backend.
    onCreate({
      id: crypto.randomUUID(),
      organizer_id: organizerId,
      full_name: result.data.full_name,
      email: result.data.email,
      status: "active",
      event_ids: result.data.event_ids,
      last_active_at: null,
      created_at: new Date().toISOString(),
    });
    setCreated({ name: result.data.full_name, email: result.data.email, password: result.data.password });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
          <Plus aria-hidden="true" />
          Add gatekeeper
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-2xl">{created ? "Account created" : "Add gatekeeper"}</DialogTitle>
          <DialogDescription className="text-text-primary/70">
            {created
              ? `${created.name} can now sign in and scan tickets for the events you assigned.`
              : "They sign in at the normal login page and only see the scanner and visitor count."}
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <>
            <CredentialsCard {...created} />
            <Button hoverScale={1} onClick={() => setOpen(false)} className="h-11 rounded-full font-semibold">
              Done
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField id="gk-name" label="Full name" error={errors.full_name}>
              <Input
                id="gk-name"
                value={values.full_name}
                onChange={(event) => set("full_name", event.target.value)}
                aria-invalid={errors.full_name ? true : undefined}
                className="h-11"
              />
            </FormField>
            <FormField id="gk-email" label="Email" hint="Used to sign in." error={errors.email}>
              <Input
                id="gk-email"
                type="email"
                value={values.email}
                onChange={(event) => set("email", event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                autoComplete="off"
                className="h-11"
              />
            </FormField>
            <div className="space-y-2">
              <p className="text-sm font-medium">Events they can scan</p>
              <ChipToggleGroup
                label="Events they can scan"
                size="sm"
                options={events.map((event) => ({ value: event.id, label: event.title }))}
                value={values.event_ids}
                onChange={(ids) => set("event_ids", ids)}
              />
              {errors.event_ids && <p className="text-sm text-danger">{errors.event_ids}</p>}
            </div>
            <FormField id="gk-password" label="Temporary password" hint="Shown in full so you can pass it on." error={errors.password}>
              <div className="flex gap-2">
                <Input
                  id="gk-password"
                  value={values.password}
                  onChange={(event) => set("password", event.target.value)}
                  aria-invalid={errors.password ? true : undefined}
                  autoComplete="off"
                  className="h-11 font-mono tracking-wider"
                />
                <Button
                  type="button"
                  variant="outline"
                  hoverScale={1}
                  onClick={() => set("password", generatePassword())}
                  className="h-11 shrink-0 rounded-full px-4"
                >
                  <Shuffle aria-hidden="true" />
                  New
                </Button>
              </div>
            </FormField>
            <Button type="submit" hoverScale={1.02} className="h-11 w-full rounded-full font-semibold">
              Create account
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
