"use client";

import { useState } from "react";
import { DecisionPanel } from "@/components/adminComponent/reviews/decisionPanel";
import { DecisionResult, FactList, ReviewSection } from "@/components/adminComponent/reviews/reviewParts";
import { ReviewQueue } from "@/components/adminComponent/reviews/reviewQueue";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDate, formatDateTime, formatPrice, formatTime } from "@/lib/format";
import { REFUND_REASON_LABELS, REFUND_REASONS, type RefundRequest } from "@/types/refund";
import { OptionSelect } from "../shared/optionSelect";

const CHECKLIST = [
  "The buyer's reason is acceptable under this event's refund policy.",
  "I agree to return the full amount, fees included.",
];

const DAY = 24 * 60 * 60 * 1000;
const requested = (item: RefundRequest) =>
  formatDateTime(item.requested_at, item.venue_timezone, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const daysBefore = (item: RefundRequest) => Math.floor((Date.parse(item.session_start_at) - Date.parse(item.requested_at)) / DAY);

const ALL = "all";
const unique = (values: string[]) => [...new Set(values)];

interface Filters {
  event: string;
  session: string;
  reason: string;
  search: string;
}

const NO_FILTERS: Filters = { event: ALL, session: ALL, reason: ALL, search: "" };

function matches(item: RefundRequest, filters: Filters) {
  const query = filters.search.trim().toLowerCase();
  return (
    (filters.event === ALL || item.event_title === filters.event) &&
    (filters.session === ALL || item.session_name === filters.session) &&
    (filters.reason === ALL || item.reason === filters.reason) &&
    (query === "" || [item.buyer_name, item.buyer_email, item.booking_code].some((text) => text.toLowerCase().includes(query)))
  );
}

function RefundFilters({ items, filters, onChange }: { items: RefundRequest[]; filters: Filters; onChange: (filters: Filters) => void }) {
  const events = unique(items.map((item) => item.event_title));
  const sessions = unique(items.filter((item) => item.event_title === filters.event).map((item) => item.session_name));
  const active = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);

  return (
    <div className="space-y-3 rounded-[20px] bg-bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="refund-event" className="text-xs font-semibold">Event</Label>
          <OptionSelect
            id="refund-event"
            value={filters.event}
            options={[{ value: ALL, label: "All events" }, ...events.map((title) => ({ value: title, label: title }))]}
            // A session only makes sense inside its event, so it resets with it.
            onChange={(event) => onChange({ ...filters, event, session: ALL })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="refund-session" className="text-xs font-semibold">Session</Label>
          <OptionSelect
            id="refund-session"
            value={filters.session}
            disabled={filters.event === ALL}
            options={[
              { value: ALL, label: filters.event === ALL ? "Pick an event first" : "All sessions" },
              ...sessions.map((name) => ({ value: name, label: name })),
            ]}
            onChange={(session) => onChange({ ...filters, session })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="refund-reason" className="text-xs font-semibold">Reason</Label>
          <OptionSelect
            id="refund-reason"
            value={filters.reason}
            options={[
              { value: ALL, label: "Any reason" },
              ...REFUND_REASONS.map((reason) => ({ value: reason, label: REFUND_REASON_LABELS[reason] })),
            ]}
            onChange={(reason) => onChange({ ...filters, reason })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="refund-search" className="text-xs font-semibold">Search</Label>
          <Input
            id="refund-search"
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Buyer, email or booking code"
            className="h-11"
          />
        </div>
      </div>
      {active && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" hoverScale={1} onClick={() => onChange(NO_FILTERS)} className="rounded-full">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

// Reuses the admin review queue: the organizer decides refunds on their own events (agreed rule).
export function RefundReviews({ items }: { items: RefundRequest[] }) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);

  return (
    <ReviewQueue
      items={items}
      toolbar={<RefundFilters items={items} filters={filters} onChange={setFilters} />}
      filter={(item) => matches(item, filters)}
      getId={(item) => item.id}
      isWaiting={(item) => item.status === "requested"}
      emptyWaiting="No refund requests are waiting."
      sheetTitle={(item) => `Refund ${item.booking_code}`}
      sheetDescription={(item) => `${item.buyer_name} · requested ${requested(item)}`}
      applyDecision={(item, decision, decidedAt) => ({
        ...item,
        status: decision.approved ? ("approved" as const) : ("rejected" as const),
        rejection_reason: decision.approved ? null : decision.rejection_reason,
        decided_at: decidedAt,
      })}
      renderTable={(rows, open) => (
        <div className="rounded-[20px] bg-bg-surface px-2 py-1">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-px">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-semibold">{item.buyer_name}</p>
                    <p className="font-mono text-xs text-text-primary/70">{item.booking_code}</p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-56 truncate">{item.event_title}</p>
                    <p className="text-xs text-text-primary/70">
                      {item.session_name} · {item.tier_summary}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatPrice(item.amount)}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-primary/70">
                    {requested(item)}
                    <span className="block text-xs">{daysBefore(item)} days before the show</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" hoverScale={1} onClick={() => open(item.id)} className="rounded-full">
                      {item.status === "requested" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      renderDetail={(item, decide) => (
        <>
          <ReviewSection title="Order">
            <FactList
              facts={[
                { label: "Buyer", value: `${item.buyer_name} (${item.buyer_email})` },
                { label: "Event", value: item.event_title },
                {
                  label: "Session",
                  value: `${item.session_name} · ${formatDate(item.session_start_at, item.venue_timezone)} · ${formatTime(item.session_start_at, item.venue_timezone)}`,
                },
                { label: "Tickets", value: item.tier_summary },
                { label: "Refund amount", value: formatPrice(item.amount) },
              ]}
            />
          </ReviewSection>
          <ReviewSection title="Reason">
            <div className="space-y-1 rounded-2xl bg-bg-surface-2 p-4 text-sm">
              <p className="font-semibold">{REFUND_REASON_LABELS[item.reason]}</p>
              {item.note && <p className="whitespace-pre-line text-text-primary/80">{item.note}</p>}
              <p className="text-xs text-text-primary/60">Requested {daysBefore(item)} days before the show</p>
            </div>
          </ReviewSection>
          <ReviewSection title="Decision">
            {item.status === "requested" ? (
              <DecisionPanel
                key={item.id}
                checklist={CHECKLIST}
                approveLabel={`Approve ${formatPrice(item.amount)} refund`}
                rejectHint="e.g. Buying elsewhere is not covered by this event's refund policy."
                onDecide={decide}
              />
            ) : (
              <DecisionResult
                status={item.status}
                decidedAt={item.decided_at}
                reason={item.rejection_reason}
                approvedNote="Refunded in full. The tickets were cancelled and their seats went back on sale."
              />
            )}
          </ReviewSection>
        </>
      )}
    />
  );
}
