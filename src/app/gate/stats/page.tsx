import { getCheckInLogs, getCheckInStats } from "@/__fixtures__/checkIns";
import { resolveGateSession } from "@/components/gateComponent/resolveGateSession";
import { SessionPicker } from "@/components/gateComponent/sessionPicker";
import { ScanLogTable, TierAttendanceTable, VisitorSummary } from "@/components/gateComponent/visitorStats";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";
import { EmptyState } from "@/components/userComponent/shared/emptyState";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const { sessions, session } = await resolveGateSession(param(await searchParams, "session"));
  if (!session) {
    return <EmptyState title="No events assigned" description="Ask the organizer to assign you to an event." />;
  }

  const stats = getCheckInStats(session.id);

  return (
    <div className="space-y-6">
      <div className="max-w-xl">
        <SessionPicker sessions={sessions} value={session.id} basePath="/gate/stats" />
      </div>
      {stats ? (
        <>
          <VisitorSummary stats={stats} />
          <section aria-labelledby="tiers-heading" className="space-y-4">
            <SectionHeader id="tiers-heading" title="By ticket tier" />
            <TierAttendanceTable stats={stats} />
          </section>
          <section aria-labelledby="log-heading" className="space-y-4">
            <SectionHeader id="log-heading" title="Latest scans" description="All gates for this session." />
            <ScanLogTable logs={getCheckInLogs(session.id)} timeZone={session.time_zone} />
          </section>
        </>
      ) : (
        <EmptyState title="No visitor data yet" description="Numbers appear once tickets for this session are sold." />
      )}
    </div>
  );
}
