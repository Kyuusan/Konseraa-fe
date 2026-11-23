import { formatDateTime, formatPrice } from "@/lib/format";
import type { PayoutAccount, PayoutSummary as Summary } from "@/types/payout";

const TIME_ZONE = "Asia/Jakarta";

export function PayoutSummary({ summary, account }: { summary: Summary; account: PayoutAccount }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-[20px] bg-bg-surface p-5">
        <p className="text-sm font-semibold">Coming up</p>
        <p className="mt-3 font-heading text-3xl font-bold">{formatPrice(summary.upcoming_total)}</p>
        <p className="mt-1 text-xs text-text-primary/70">
          {summary.next_payout_at
            ? `Next payout ${formatDateTime(summary.next_payout_at, TIME_ZONE, { day: "numeric", month: "short", year: "numeric" })}`
            : "Nothing scheduled"}
        </p>
      </div>
      <div className="rounded-[20px] bg-bg-surface p-5">
        <p className="text-sm font-semibold">Paid out</p>
        <p className="mt-3 font-heading text-3xl font-bold">{formatPrice(summary.paid_total)}</p>
        <p className="mt-1 text-xs text-text-primary/70">All time</p>
      </div>
      <div className="rounded-[20px] bg-bg-surface p-5">
        <p className="text-sm font-semibold">Platform fees</p>
        <p className="mt-3 font-heading text-3xl font-bold">{formatPrice(summary.fees_total)}</p>
        <p className="mt-1 text-xs text-text-primary/70">Deducted from gross sales</p>
      </div>
      <div className="rounded-[20px] border border-text-primary/15 p-5">
        <p className="text-sm font-semibold">Paid to</p>
        <p className="mt-3 font-heading text-2xl font-bold">
          {account.bank_name} •••• {account.account_number_last4}
        </p>
        <p className="mt-1 text-xs text-text-primary/70">{account.account_holder}</p>
      </div>
    </div>
  );
}
