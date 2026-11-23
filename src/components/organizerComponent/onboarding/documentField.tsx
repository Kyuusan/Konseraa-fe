"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { DocumentFile } from "@/types/organizer";
import { FormField } from "./formField";

/** Assumed limits (not in the PRD): up to 5 MB per file. */
const MAX_BYTES = 5 * 1024 * 1024;

const ACCEPTS = {
  image: { types: "image/jpeg,image/png,image/webp", message: "Use a JPG, PNG or WebP image." },
  pdf: { types: "application/pdf", message: "Use a PDF file." },
  "image-or-pdf": { types: "image/jpeg,image/png,application/pdf", message: "Use a JPG, PNG or PDF file." },
} as const;

interface DocumentFieldProps {
  id: string;
  label: string;
  hint: string;
  value: DocumentFile | null;
  error?: string;
  accept?: keyof typeof ACCEPTS;
  onChange: (file: DocumentFile | null) => void;
  /** Receives the picked file itself, e.g. for a local preview. */
  onFileSelect?: (file: File | null) => void;
}

// Keeps only the file's metadata: there is no upload endpoint yet.
export function DocumentField({
  id,
  label,
  hint,
  value,
  error,
  accept = "image-or-pdf",
  onChange,
  onFileSelect,
}: DocumentFieldProps) {
  const [fileError, setFileError] = useState<string>();
  const allowed = ACCEPTS[accept];
  const reject = (message?: string) => {
    setFileError(message);
    onChange(null);
    onFileSelect?.(null);
  };

  return (
    <FormField id={id} label={label} hint={value ? `Selected: ${value.name}` : hint} error={fileError ?? error}>
      <Input
        id={id}
        type="file"
        accept={allowed.types}
        aria-invalid={fileError || error ? true : undefined}
        className="h-12 cursor-pointer py-2.5 file:mr-3 file:rounded-full file:bg-bg-surface-2 file:px-3 file:text-text-primary"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return reject();
          if (!allowed.types.split(",").includes(file.type)) return reject(allowed.message);
          if (file.size > MAX_BYTES) return reject("The file is larger than 5 MB.");
          setFileError(undefined);
          onChange({ name: file.name, size: file.size, mime_type: file.type });
          onFileSelect?.(file);
        }}
      />
    </FormField>
  );
}
