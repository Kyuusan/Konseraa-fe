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
// No overflow clipping, so the hover tooltips can sit outside the rail.
export function SidebarPanel({ label, className, header, footer, children }: SidebarPanelProps) {
  return (
    <aside
      aria-label={label}
      className={cn("sticky z-30 hidden w-14 shrink-0 flex-col items-center gap-3 self-start md:flex", className)}
    >
      {header && <div className={GROUP}>{header}</div>}
      <div className={GROUP}>{children}</div>
      {footer && (
        <>
          <div className="flex-1" />
          <div className={GROUP}>{footer}</div>
        </>
      )}
    </aside>
  );
}
