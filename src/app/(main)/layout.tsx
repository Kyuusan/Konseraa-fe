import type { ReactNode } from "react";
import { UserHeadbar } from "@/components/layout/headbar/userHeadbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <UserHeadbar />
      {/* Bottom padding on mobile keeps content clear of the floating bottom nav. */}
      <div className="px-3 pt-3 pb-28 sm:px-6 md:pb-10">{children}</div>
    </div>
  );
}
