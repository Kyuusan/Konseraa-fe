"use client";

// Client component: the nav items carry lucide icon components, which can't be
// passed from a server component to the client SidebarNav.
import { ADMIN_FOOTER_NAV, ADMIN_NAV } from "../shared/navigation";
import { SidebarNav } from "./sidebarNav";
import { SidebarPanel } from "./sidebarPanel";

// Desktop/tablet rail below the admin headbar. On mobile the same links live in
// the headbar's drawer.
export function AdminSidebar() {
  return (
    <SidebarPanel
      label="Admin"
      className="top-25 h-[calc(100dvh-124px)]"
      footer={<SidebarNav items={ADMIN_FOOTER_NAV} label="Admin account" />}
    >
      <SidebarNav items={ADMIN_NAV} label="Admin" />
    </SidebarPanel>
  );
}
