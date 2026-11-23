import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentGatekeeper } from "@/__fixtures__/session";
import { UserHeadbar } from "@/components/layout/headbar/userHeadbar";

export default async function MainLayout({ children }: { children: ReactNode }) {
  // Gatekeeper accounts only get the gate pages (agreed scope).
  if (await getCurrentGatekeeper()) redirect("/gate");

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <UserHeadbar />
      {/* Bottom padding on mobile keeps content clear of the floating bottom nav. */}
      <div className="px-3 pt-3 pb-28 sm:px-6 md:pb-10">{children}</div>
    </div>
  );
}
