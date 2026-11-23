import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  label: string;
  /** Sticky offset (and height, when the footer should sit at the bottom). */
  className: string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const GROUP =
  "flex flex-col items-center gap-1 rounded-full bg-bg-surface-2 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.4)]";

// Icon-only rail shared by organizer and admin: each part floats as its own pill.
// Three rows (1fr auto 1fr) keep the main group at the exact vertical centre of the
// rail, with the header pinned to the top and the footer to the bottom.
// No overflow clipping, so the hover tooltips can sit outside the rail.
export function SidebarPanel({ label, className, header, footer, children }: SidebarPanelProps) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "sticky z-30 hidden w-14 shrink-0 grid-rows-[1fr_auto_1fr] justify-items-center gap-3 self-start md:grid",
        className,
      )}
    >
      <div className="self-start">{header && <div className={GROUP}>{header}</div>}</div>
      <div className={GROUP}>{children}</div>
      <div className="self-end">{footer && <div className={GROUP}>{footer}</div>}</div>
    </aside>
  );
}
