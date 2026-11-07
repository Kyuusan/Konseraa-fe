"use client";

// Client component: the nav items carry lucide icon components, which can't be
// passed from a server component to the client SidebarNav/SidebarChips.
import { ORGANIZER_FOOTER_NAV, ORGANIZER_NAV } from "../shared/navigation";
import { SidebarChips } from "./sidebarChips";
import { SidebarNav } from "./sidebarNav";
import { SidebarPanel } from "./sidebarPanel";

// Part of the organizer pages only: it sits below the user headbar (84px tall from sm up).
export function OrganizerSidebar() {
  return (
    <>
      <SidebarPanel
        label="Organizer"
        className="top-25 h-[calc(100dvh-124px)]"
        footer={<SidebarNav items={ORGANIZER_FOOTER_NAV} label="Organizer account" />}
      >
        <SidebarNav items={ORGANIZER_NAV} label="Organizer" />
      </SidebarPanel>
      <SidebarChips items={ORGANIZER_NAV} label="Organizer" />
    </>
  );
}
