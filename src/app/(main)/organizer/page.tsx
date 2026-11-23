import { getOrganizerDashboard, getOrganizerEvents, RECENT_SALES } from "@/__fixtures__/organizerEvents";
import { getCurrentOrganizer } from "@/__fixtures__/session";
import { AttentionList } from "@/components/organizerComponent/dashboard/attentionList";
import { KpiGrid } from "@/components/organizerComponent/dashboard/kpiGrid";
import { NextShowCard } from "@/components/organizerComponent/dashboard/nextShowCard";
import { RecentSalesTable } from "@/components/organizerComponent/dashboard/recentSalesTable";
import { SalesChart } from "@/components/organizerComponent/dashboard/salesChart";
import { StatusStrip } from "@/components/organizerComponent/dashboard/statusStrip";
import { groupEventsByStatus } from "@/components/organizerComponent/events/statusFilters";
import { ApplicationStatus } from "@/components/organizerComponent/onboarding/applicationStatus";
import { OrganizerIntro } from "@/components/organizerComponent/onboarding/organizerIntro";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

const NEEDS_ATTENTION = ["draft", "pending_review", "rejected"];

export default async function Page() {
  const data = await getCurrentOrganizer();
  if (!data) return <OrganizerIntro />;

  if (data.organizer.verification_status !== "approved") {
    return <ApplicationStatus organizer={data.organizer} verification={data.verification} />;
  }

  const stats = getOrganizerDashboard();
  const events = getOrganizerEvents();
  const nextShow = events
    .filter((event) => event.status === "published")
    .toSorted((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at))[0];
  const attention = events.filter((event) => NEEDS_ATTENTION.includes(event.status));
  const statusTiles = groupEventsByStatus(events)
    .filter((group) => group.value !== "all")
    .map((group) => ({ value: group.value, label: group.label, count: group.events.length }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organizer dashboard"
        title={`Welcome back, ${data.organizer.company_name}`}
        description="Here's how your shows are selling."
        actions={
          <ButtonLink href="/organizer/events/new" hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
            Create event
          </ButtonLink>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <KpiGrid
            grossRevenue={stats.gross_revenue}
            ticketsSold={stats.tickets_sold}
            monthGross={stats.month_gross}
            monthChangePercent={stats.month_change_percent}
          />
          <SalesChart data={stats.sales_by_month} />
          <StatusStrip tiles={statusTiles} />
        </div>

        <div className="space-y-6">
          <NextShowCard event={nextShow} />
          <section aria-labelledby="attention-heading" className="space-y-3">
            <h2 id="attention-heading" className="text-sm font-semibold text-text-primary">Needs attention</h2>
            <AttentionList events={attention} />
          </section>
        </div>
      </div>

      <section aria-labelledby="sales-heading" className="space-y-4 pt-4">
        <SectionHeader id="sales-heading" title="Recent sales" description="Latest paid bookings across your events." />
        <RecentSalesTable sales={RECENT_SALES} />
      </section>
    </div>
  );
}
