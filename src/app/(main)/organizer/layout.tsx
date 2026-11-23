import type { ReactNode } from "react";
import { getCurrentOrganizer } from "@/__fixtures__/session";
import { OrganizerSidebar } from "@/components/layout/sidebar/organizerSidebar";
import { DemoStateSwitcher } from "@/components/organizerComponent/demoStateSwitcher";

export default async function OrganizerLayout({ children }: { children: ReactNode }) {
  const data = await getCurrentOrganizer();
  const state = data?.organizer.verification_status ?? "none";
  const switcher = <DemoStateSwitcher state={state} />;

  // The organizer sidebar only exists once the organizer is approved; before
  // that, /organizer is an introduction or the application status.
  if (state !== "approved") {
    return (
      <div>
        {switcher}
        {children}
      </div>
    );
  }

  return (
    <div className="md:flex md:items-start md:gap-6">
      <OrganizerSidebar />
      <div className="min-w-0 flex-1">
        {switcher}
        {children}
      </div>
    </div>
  );
}
