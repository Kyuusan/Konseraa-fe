import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-text-primary/15 px-6 py-14 text-center">
      <p className="font-heading text-xl font-semibold">{title}</p>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
