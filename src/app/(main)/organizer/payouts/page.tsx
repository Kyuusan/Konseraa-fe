import { getPayoutSummary, PAYOUT_ACCOUNT, PAYOUTS } from "@/__fixtures__/payouts";
import { PayoutSummary } from "@/components/organizerComponent/payouts/payoutSummary";
import { PayoutTable } from "@/components/organizerComponent/payouts/payoutTable";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  await requireApprovedOrganizer();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organizer"
        title="Payouts"
        description="Ticket sales are paid out 3 days after each event ends, minus the platform fee agreed for that event."
      />
      <PayoutSummary summary={getPayoutSummary()} account={PAYOUT_ACCOUNT} />
      <section aria-labelledby="payouts-heading" className="space-y-4">
        <SectionHeader id="payouts-heading" title="Payouts per event" description="Newest first." />
        <PayoutTable payouts={PAYOUTS} />
      </section>
    </div>
  );
}
