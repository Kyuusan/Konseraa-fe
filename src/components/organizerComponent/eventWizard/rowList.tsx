"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";

interface RowCardProps {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}

/** One repeatable row (a session or a ticket tier). Rows can be removed while more than one is left. */
export function RowCard({ title, onRemove, children }: RowCardProps) {
  return (
    <div className="space-y-5 rounded-2xl bg-bg-surface-2 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        {onRemove && (
          <Button variant="ghost" size="sm" hoverScale={1} onClick={onRemove} className="rounded-full text-text-primary/70">
            <Trash2 aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

export function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="outline" hoverScale={1} onClick={onClick} className="h-11 w-full rounded-full border-dashed">
      <Plus aria-hidden="true" />
      {label}
    </Button>
  );
}
