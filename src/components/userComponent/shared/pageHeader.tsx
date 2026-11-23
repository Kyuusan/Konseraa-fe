import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  /** "end" (default): actions sit at the bottom of the text block. "center": level with the title. */
  actionsAlign?: "end" | "center";
}

export function PageHeader({ eyebrow, title, description, actions, actionsAlign = "end" }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-wrap justify-between gap-4 pt-4", actionsAlign === "end" ? "items-end" : "items-center")}>
      <div className="max-w-2xl space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">{eyebrow}</p>
        )}
        <h1 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="text-text-muted">{description}</p>}
      </div>
      {actions}
    </header>
  );
}
