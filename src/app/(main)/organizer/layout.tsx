import type { ReactNode } from "react";
import { OrganizerSidebar } from "@/components/layout/sidebar/organizerSidebar";

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="md:flex md:items-start md:gap-6">
      <OrganizerSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
