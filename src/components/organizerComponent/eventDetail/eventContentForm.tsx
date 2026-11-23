"use client";

import Image from "next/image";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Textarea } from "@/components/ui/textarea";
import { EventBasicsFormSchema } from "@/types/eventForm";
import type { DocumentFile } from "@/types/organizer";
import { DocumentField } from "../onboarding/documentField";
import { FormField } from "../onboarding/formField";

interface EventContentFormProps {
  bannerUrl: string;
  description: string;
}

// After publishing, only the banner and the description may change (agreed rule).
export function EventContentForm({ bannerUrl, description: initialDescription }: EventContentFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [banner, setBanner] = useState<DocumentFile | null>(null);
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = EventBasicsFormSchema.shape.description.safeParse(description);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    // Stands in for PATCH /events/{id}: nothing is stored.
    setError(undefined);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-[20px] bg-bg-surface p-6">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold">Event page</h2>
        <p className="text-sm text-text-primary/70">Changes show on the public page right away.</p>
      </div>

      <div className="relative aspect-18/7 overflow-hidden rounded-2xl bg-bg-surface-2">
        <Image src={bannerUrl} alt="Current banner" fill sizes="(min-width: 1280px) 24rem, 100vw" className="object-cover" />
      </div>
      <DocumentField
        id="banner"
        label="Replace banner"
        hint="Wide, about 18:7. JPG, PNG or WebP up to 5 MB."
        accept="image"
        value={banner}
        onChange={(file) => {
          setBanner(file);
          setSaved(false);
        }}
      />
      <FormField id="description" label="Description" error={error}>
        <Textarea
          id="description"
          value={description}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            setDescription(event.target.value);
            setSaved(false);
          }}
          rows={8}
        />
      </FormField>

      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-sm text-accent-lime">
          {saved && "Changes saved."}
        </p>
        <Button type="submit" hoverScale={1.02} className="h-11 rounded-full px-6 font-semibold">
          Save changes
        </Button>
      </div>
    </form>
  );
}
