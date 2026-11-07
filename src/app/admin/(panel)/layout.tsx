import type { ReactNode } from "react";
import { AdminHeadbar } from "@/components/layout/headbar/adminHeadbar";
import { AdminSidebar } from "@/components/layout/sidebar/adminSidebar";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <AdminHeadbar />
      <div className="px-3 pt-3 pb-10 sm:px-6 md:flex md:items-start md:gap-6">
        <AdminSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
