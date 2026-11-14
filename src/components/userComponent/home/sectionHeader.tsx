import Link from "next/link";

interface SectionHeaderProps {
  id: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({ id, title, description, href, linkLabel = "See all" }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h2 id={id} className="font-heading text-2xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-text-muted">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-accent-lime underline-offset-4 hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
