import { REFUND_REQUESTS } from "@/__fixtures__/refundRequests";
import { RefundReviews } from "@/components/organizerComponent/refunds/refundReviews";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { REFUND_CLOSES_DAYS_BEFORE } from "@/lib/constants";

export default async function Page() {
  await requireApprovedOrganizer();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organizer"
        title="Refunds"
        description={`Buyers can ask for a full refund until ${REFUND_CLOSES_DAYS_BEFORE} days before the show. You decide; approved orders are refunded in full and their tickets go back on sale.`}
      />
      <RefundReviews items={REFUND_REQUESTS} />
    </div>
  );
}
