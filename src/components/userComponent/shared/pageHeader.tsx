import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pt-4">
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
