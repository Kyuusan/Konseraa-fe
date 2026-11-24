"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { OptionSelect } from "@/components/organizerComponent/shared/optionSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { EmptyState } from "@/components/userComponent/shared/emptyState";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime, formatPrice } from "@/lib/format";
import { type AdminPayout, type AdminTransaction, ForceRefundSchema, type PayoutCandidate } from "@/types/admin";
import type { BookingStatus } from "@/types/booking";
import { TransactionsTable } from "../dashboard/moneyTables";
import { ADMIN_TIME_ZONE } from "../dashboard/reviewQueueCard";

const STATUS_FILTERS: { value: string; label: string; statuses: BookingStatus[] | null }[] = [
  { value: "all", label: "Any status", statuses: null },
  { value: "paid", label: "Paid", statuses: ["paid"] },
  { value: "open", label: "Waiting for payment", statuses: ["pending", "awaiting_payment"] },
  { value: "refunded", label: "Refunded", statuses: ["refunded", "partially_refunded"] },
  { value: "closed", label: "Expired or cancelled", statuses: ["expired", "cancelled"] },
];

/** Payouts go out 3 days after the event ends (PRD §9.2). */
const PAYOUT_DELAY_DAYS = 3;
const day = (iso: string) => formatDateTime(iso, ADMIN_TIME_ZONE, { day: "numeric", month: "short", year: "numeric" });

interface FinanceViewProps {
  transactions: AdminTransaction[];
  payouts: AdminPayout[];
  candidates: PayoutCandidate[];
}

export function FinanceView({ transactions: initialTransactions, payouts: initialPayouts, candidates: initialCandidates }: FinanceViewProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [refunding, setRefunding] = useState<AdminTransaction | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundError, setRefundError] = useState<string>();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [payouts, setPayouts] = useState(initialPayouts);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [confirming, setConfirming] = useState<PayoutCandidate | null>(null);

  const statuses = STATUS_FILTERS.find((item) => item.value === status)?.statuses ?? null;
  const query = search.trim().toLowerCase();
  const shownTransactions = transactions.filter(
    (item) =>
      (statuses === null || statuses.includes(item.status)) &&
      (query === "" ||
        [item.booking_code, item.buyer_name, item.event_title, item.organizer_name].some((text) => text.toLowerCase().includes(query))),
  );
  const open = payouts.filter((item) => item.status !== "paid");
  const paid = payouts.filter((item) => item.status === "paid");

  function startRefund(transaction: AdminTransaction) {
    setRefunding(transaction);
    setRefundReason("");
    setRefundError(undefined);
  }

  // Stands in for an admin refund (refunds row, processed_by = admin); lasts until reload.
  function confirmRefund() {
    if (!refunding) return;
    const result = ForceRefundSchema.safeParse({ reason: refundReason });
    if (!result.success) {
      setRefundError(result.error.issues[0]?.message);
      return;
    }
    setTransactions((list) =>
      list.map((item) => (item.booking_code === refunding.booking_code ? { ...item, status: "refunded" } : item)),
    );
    setRefunding(null);
  }

  // Stands in for POST /admin/payouts { organizer_id, event_id }; lasts until reload.
  function schedule(candidate: PayoutCandidate) {
    const scheduledAt = new Date(Date.parse(candidate.event_ended_at) + PAYOUT_DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString();
    setPayouts((list) => [
      {
        id: crypto.randomUUID(),
        organizer_name: candidate.organizer_name,
        event_title: candidate.event_title,
        gross_amount: candidate.gross_amount,
        commission_amount: candidate.commission_amount,
        net_amount: candidate.net_amount,
        status: "scheduled",
        scheduled_at: scheduledAt,
        paid_at: null,
        bank_reference: null,
      },
      ...list,
    ]);
    setCandidates((list) => list.filter((item) => item.event_id !== candidate.event_id));
    setConfirming(null);
  }

  return (
    <Tabs defaultValue="transactions" className="gap-6">
      <TabsList className="h-11 w-fit rounded-full bg-bg-surface p-1">
        <TabsTrigger value="transactions" className="rounded-full px-4">Transactions ({transactions.length})</TabsTrigger>
        <TabsTrigger value="payouts" className="rounded-full px-4">Payouts ({payouts.length})</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value="transactions" className="space-y-5">
          <div className="grid gap-3 rounded-[20px] bg-bg-surface p-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tx-status" className="text-xs font-semibold">Status</Label>
              <OptionSelect id="tx-status" value={status} options={STATUS_FILTERS.map(({ value, label }) => ({ value, label }))} onChange={setStatus} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-search" className="text-xs font-semibold">Search</Label>
              <Input
                id="tx-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Booking code, buyer, event or organizer"
                className="h-11"
              />
            </div>
          </div>
          {shownTransactions.length === 0 ? (
            <EmptyState title="No transactions found" description="Try another status or search." />
          ) : (
            <TransactionsTable transactions={shownTransactions} onRefund={startRefund} />
          )}
        </TabsContent>

        <TabsContent value="payouts" className="space-y-8">
          <section aria-labelledby="ready-heading" className="space-y-3">
            <div>
              <h2 id="ready-heading" className="font-heading text-xl font-semibold">Ready to schedule</h2>
              <p className="text-sm text-text-primary/70">
                Events that ended without a payout. Paid out {PAYOUT_DELAY_DAYS} days after the event, minus the commission.
              </p>
            </div>
            {candidates.length === 0 ? (
              <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">Every finished event has a payout.</p>
            ) : (
              <ul className="space-y-3">
                {candidates.map((candidate) => (
                  <li key={candidate.event_id} className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-bg-surface p-5">
                    <div className="min-w-0">
                      <p className="font-semibold">{candidate.event_title}</p>
                      <p className="text-sm text-text-primary/70">
                        {candidate.organizer_name} · ended {day(candidate.event_ended_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-right text-sm">
                        <span className="block font-heading text-xl font-bold">{formatPrice(candidate.net_amount)}</span>
                        <span className="text-text-primary/70">
                          after {candidate.commission_rate_percent}% commission
                        </span>
                      </p>
                      <Button hoverScale={1.02} onClick={() => setConfirming(candidate)} className="rounded-full font-semibold">
                        Schedule payout
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <PayoutSection id="open-heading" title="Scheduled" payouts={open} empty="No payouts waiting." />
          <PayoutSection id="paid-heading" title="Paid" payouts={paid} empty="No payouts sent yet." />
        </TabsContent>
      </TabsContents>

      <Dialog open={refunding !== null} onOpenChange={(next) => !next && setRefunding(null)}>
        <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-md">
          {refunding && (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="font-heading text-2xl">Refund {refunding.booking_code}?</DialogTitle>
                <DialogDescription className="text-text-primary/70">
                  For force majeure only, such as a cancelled or moved show or a disaster. This skips the 7-day rule and
                  the organizer&apos;s decision: {refunding.buyer_name} gets {formatPrice(refunding.total_amount)} back and the
                  tickets are cancelled.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="force-refund-reason" className="text-sm font-semibold">
                  Reason (kept in the audit log)
                </Label>
                <Textarea
                  id="force-refund-reason"
                  value={refundReason}
                  onChange={(event) => {
                    setRefundReason(event.target.value);
                    setRefundError(undefined);
                  }}
                  aria-invalid={refundError ? true : undefined}
                  rows={3}
                  placeholder="e.g. The venue closed after flooding; the show was cancelled two days before."
                />
                {refundError && <p className="text-sm text-danger">{refundError}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" hoverScale={1} onClick={() => setRefunding(null)} className="rounded-full">
                  Cancel
                </Button>
                <Button hoverScale={1} onClick={confirmRefund} className="rounded-full bg-danger font-semibold text-bg-base hover:bg-danger/90">
                  Refund in full
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirming !== null} onOpenChange={(next) => !next && setConfirming(null)}>
        <DialogContent className="gap-5 rounded-[20px] border-text-primary/10 bg-bg-surface p-6 sm:max-w-md">
          {confirming && (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="font-heading text-2xl">Schedule payout?</DialogTitle>
                <DialogDescription className="text-text-primary/70">
                  {confirming.event_title} by {confirming.organizer_name}
                </DialogDescription>
              </DialogHeader>
              <dl className="divide-y divide-text-primary/10 rounded-2xl bg-bg-surface-2 px-4 text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-text-primary/70">Gross sales</dt>
                  <dd className="font-medium tabular-nums">{formatPrice(confirming.gross_amount)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-text-primary/70">Commission ({confirming.commission_rate_percent}%)</dt>
                  <dd className="font-medium tabular-nums">−{formatPrice(confirming.commission_amount)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-semibold">Organizer receives</dt>
                  <dd className="font-heading text-lg font-bold tabular-nums">{formatPrice(confirming.net_amount)}</dd>
                </div>
              </dl>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" hoverScale={1} onClick={() => setConfirming(null)} className="rounded-full">
                  Cancel
                </Button>
                <Button hoverScale={1.02} onClick={() => schedule(confirming)} className="rounded-full font-semibold">
                  Schedule
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}

function PayoutSection({ id, title, payouts, empty }: { id: string; title: string; payouts: AdminPayout[]; empty: string }) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="font-heading text-xl font-semibold">
        {title}
      </h2>
      {payouts.length === 0 ? (
        <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">{empty}</p>
      ) : (
        <div className="overflow-hidden rounded-[20px] bg-bg-surface">
          <Table className="min-w-220">
            <TableHeader>
              <TableRow>
                <TableHead>Organizer</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Bank reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <p className="font-semibold">{payout.organizer_name}</p>
                    <p className="max-w-56 truncate text-xs text-text-primary/70">{payout.event_title}</p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatPrice(payout.gross_amount)}</TableCell>
                  <TableCell className="text-right tabular-nums text-text-primary/80">{formatPrice(payout.commission_amount)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatPrice(payout.net_amount)}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/80">{day(payout.paid_at ?? payout.scheduled_at)}</TableCell>
                  <TableCell className="font-mono text-xs text-text-primary/70">{payout.bank_reference ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={payout.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
