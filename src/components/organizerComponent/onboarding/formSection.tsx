import type { ReactNode } from "react";

interface FormSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

// Full-width form card: title and guidance on the left, fields on the right (stacked on mobile).
export function FormSection({ id, title, description, children }: FormSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 rounded-[20px] bg-bg-surface p-6 sm:p-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12"
    >
      <div className="space-y-1">
        <h2 id={id} className="font-heading text-xl font-semibold">{title}</h2>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
