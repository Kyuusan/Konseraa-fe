import { getCheckInStats, getDemoCodes } from "@/__fixtures__/checkIns";
import { GateConsole } from "@/components/gateComponent/gateConsole";
import { resolveGateSession } from "@/components/gateComponent/resolveGateSession";
import { SessionPicker } from "@/components/gateComponent/sessionPicker";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { formatNumber } from "@/lib/format";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const { sessions, session } = await resolveGateSession(param(await searchParams, "session"));
  if (!session) {
    return <EmptyState title="No events assigned" description="Ask the organizer to assign you to an event." />;
  }

  const stats = getCheckInStats(session.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
        <SessionPicker sessions={sessions} value={session.id} basePath="/gate" />
        {stats && (
          <p className="rounded-[20px] bg-bg-surface px-5 py-3 text-sm">
            <span className="font-heading text-2xl font-bold">{formatNumber(stats.checked_in)}</span>
            <span className="text-text-primary/70"> of {formatNumber(stats.tickets_sold)} checked in · {session.venue_name}</span>
          </p>
        )}
      </div>
      <GateConsole
        key={session.id}
        session={session}
        demoCodes={process.env.NODE_ENV === "production" ? null : getDemoCodes(session.id)}
      />
    </div>
  );
}
