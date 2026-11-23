import type { ReactNode } from "react";
import { getUnreadCount } from "@/__fixtures__/notifications";
import { GateHeader } from "@/components/gateComponent/gateHeader";
import { requireGatekeeper } from "@/components/gateComponent/requireGatekeeper";

export default async function GateLayout({ children }: { children: ReactNode }) {
  const gatekeeper = await requireGatekeeper();

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <GateHeader name={gatekeeper.full_name} unread={getUnreadCount("gatekeeper")} />
      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-6">{children}</main>
    </div>
  );
}
