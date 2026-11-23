import {
  getAdminOverview,
  PAYOUTS_DUE,
  PENDING_EVENT_REVIEWS,
  PENDING_VERIFICATIONS,
  RECENT_TRANSACTIONS,
} from "@/__fixtures__/admin";
import { PayoutsDueList, TransactionsTable } from "@/components/adminComponent/dashboard/moneyTables";
import { OverviewKpis } from "@/components/adminComponent/dashboard/overviewKpis";
import { ReviewQueueCard } from "@/components/adminComponent/dashboard/reviewQueueCard";
import { EventReviewTable, VerificationTable } from "@/components/adminComponent/dashboard/reviewTables";
import { SalesChart } from "@/components/organizerComponent/dashboard/salesChart";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

const oldest = (items: { submitted_at: string }[]) => items.map((item) => item.submitted_at).toSorted()[0];

export default function Page() {
  const overview = getAdminOverview();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Platform overview" description="Sales across Konsera and what is waiting for a decision." />

      <OverviewKpis overview={overview} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <SalesChart data={overview.gross_by_month} />
        <div className="space-y-6">
          <ReviewQueueCard
            queues={[
              {
                label: "Event reviews",
                count: PENDING_EVENT_REVIEWS.length,
                oldest: oldest(PENDING_EVENT_REVIEWS),
                href: "/admin/events",
              },
              {
                label: "Organizer verifications",
                count: PENDING_VERIFICATIONS.length,
                oldest: oldest(PENDING_VERIFICATIONS),
                href: "/admin/verifications",
              },
            ]}
          />
        </div>
      </div>

      <section aria-labelledby="event-reviews-heading" className="space-y-4 pt-4">
        <SectionHeader
          id="event-reviews-heading"
          title="Event reviews"
          description="Check the details and the permit. Approved events go live right away."
          href="/admin/events"
        />
        <EventReviewTable reviews={PENDING_EVENT_REVIEWS} />
      </section>

      <div className="grid gap-6 pt-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="verifications-heading" className="min-w-0 space-y-4">
          <SectionHeader
            id="verifications-heading"
            title="Organizer verifications"
            description="Match the person in charge with their ID card before approving."
            href="/admin/verifications"
          />
          <VerificationTable verifications={PENDING_VERIFICATIONS} />
        </section>
        <div className="xl:pt-15">
          <PayoutsDueList payouts={PAYOUTS_DUE} />
        </div>
      </div>

      <section aria-labelledby="transactions-heading" className="space-y-4 pt-4">
        <SectionHeader
          id="transactions-heading"
          title="Recent transactions"
          description="Latest bookings across all organizers."
          href="/admin/transactions"
        />
        <TransactionsTable transactions={RECENT_TRANSACTIONS} />
      </section>
    </div>
  );
}
