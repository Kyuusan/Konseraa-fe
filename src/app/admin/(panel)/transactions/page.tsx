import { ADMIN_PAYOUTS, getFinanceSummary, PAYOUT_CANDIDATES, TRANSACTIONS } from "@/__fixtures__/adminFinance";
import { FinanceSummary } from "@/components/adminComponent/finance/financeSummary";
import { FinanceView } from "@/components/adminComponent/finance/financeView";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Transactions"
        description="Bookings across every organizer, the commission Konsera keeps, and the payouts that go back to organizers."
      />
      <FinanceSummary summary={getFinanceSummary()} />
      <FinanceView transactions={TRANSACTIONS} payouts={ADMIN_PAYOUTS} candidates={PAYOUT_CANDIDATES} />
    </div>
  );
}
