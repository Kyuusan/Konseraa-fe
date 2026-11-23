"use client";

import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { checkInTicket, normalizeScan } from "@/__fixtures__/checkIns";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Switch } from "@/components/animate-ui/components/radix/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { useNow } from "@/hooks/use-now";
import { useOnline } from "@/hooks/use-online";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CheckInResult } from "@/types/gatekeeper";
import { signalResult } from "./feedbackSignal";
import type { GateSession } from "./gateSessions";
import { QrScanner } from "./qrScanner";
import { type ScanFeedback, ScanResultPanel } from "./scanResultPanel";

type HistoryItem = { id: string; code: string; result: CheckInResult | "queued"; at: string };

interface GateConsoleProps {
  session: GateSession;
  /** Development only: codes that give each result, to try without a phone. */
  demoCodes: { label: string; code: string }[] | null;
}

export function GateConsole({ session, demoCodes }: GateConsoleProps) {
  const now = useNow();
  const online = useOnline();
  const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
  const [admitted, setAdmitted] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [manualCode, setManualCode] = useState("");
  const [ignoreWindow, setIgnoreWindow] = useState(false);

  const opensAt = Date.parse(session.gate_opens_at);
  const closesAt = Date.parse(session.gate_closes_at);
  const gateOpen = now !== null && now >= opensAt && now <= closesAt;
  const canScan = gateOpen || ignoreWindow;
  const time = (iso: string) => formatDateTime(iso, session.time_zone, { hour: "numeric", minute: "2-digit" });
  const record = (code: string, result: HistoryItem["result"]) =>
    setHistory((current) => [{ id: crypto.randomUUID(), code, result, at: new Date().toISOString() }, ...current].slice(0, 8));

  // Stands in for POST /check-ins; offline scans wait in a local queue (PRD §5.5).
  function processScan(raw: string, admittedSoFar = admitted) {
    const code = normalizeScan(raw);
    if (!code || !canScan) return admittedSoFar;

    if (!online) {
      setQueue((current) => (current.includes(code) ? current : [...current, code]));
      setFeedback({ queued: true, ticket_code: code });
      record(code, "queued");
      return admittedSoFar;
    }

    const outcome = checkInTicket(code, session.id, admittedSoFar);
    const next = outcome.result === "success" ? [...admittedSoFar, outcome.ticket_code] : admittedSoFar;
    setAdmitted(next);
    setFeedback(outcome);
    record(outcome.ticket_code, outcome.result);
    signalResult(outcome.result);
    return next;
  }

  function syncQueue() {
    // Each queued code is checked against the codes admitted before it.
    queue.reduce((admittedSoFar, code) => processScan(code, admittedSoFar), admitted);
    setQueue([]);
  }

  function handleManual(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    processScan(manualCode);
    setManualCode("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold",
              online ? "bg-accent-lime/15 text-accent-lime" : "bg-warning/15 text-warning",
            )}
          >
            {online ? <Wifi className="size-4" aria-hidden="true" /> : <WifiOff className="size-4" aria-hidden="true" />}
            {online ? "Online" : "Offline"}
          </span>
          <span className="rounded-full bg-bg-surface px-3 py-1 text-text-primary/80">
            {queue.length} waiting to sync
          </span>
          {online && queue.length > 0 && (
            <Button size="sm" hoverScale={1} onClick={syncQueue} className="rounded-full">
              <RefreshCw aria-hidden="true" />
              Sync now
            </Button>
          )}
        </div>

        {now !== null && !gateOpen && (
          <div className="rounded-[20px] border border-warning/40 bg-warning/10 p-4 text-sm">
            <p className="font-semibold text-warning">Gate closed</p>
            <p className="text-text-primary/80">
              {now < opensAt
                ? `Scanning opens at ${time(session.gate_opens_at)}, 2 hours before the show (${session.when}).`
                : `Scanning closed at ${time(session.gate_closes_at)}, 1 hour after the show started.`}
            </p>
          </div>
        )}

        {demoCodes && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-warning/50 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <Switch id="ignore-window" checked={ignoreWindow} onCheckedChange={setIgnoreWindow} />
              <Label htmlFor="ignore-window" className="font-semibold text-warning">
                Ignore gate hours
              </Label>
            </div>
            <span className="text-text-muted">Development only. Try:</span>
            {demoCodes.map((demo) => (
              <Button
                key={demo.label}
                variant="outline"
                size="sm"
                hoverScale={1}
                disabled={!canScan}
                onClick={() => processScan(demo.code)}
                className="rounded-full"
              >
                {demo.label}
              </Button>
            ))}
          </div>
        )}

        <QrScanner onScan={(text) => processScan(text)} disabled={!canScan} />

        <form onSubmit={handleManual} className="mx-auto flex max-w-md gap-2">
          <Label htmlFor="manual-code" className="sr-only">
            Ticket code
          </Label>
          <Input
            id="manual-code"
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            placeholder="Or type the code, e.g. KNS-NA-30103"
            autoComplete="off"
            className="h-11 font-mono uppercase"
            disabled={!canScan}
          />
          <Button type="submit" hoverScale={1} disabled={!canScan || !manualCode.trim()} className="h-11 rounded-full px-5 font-semibold">
            Check
          </Button>
        </form>
      </div>

      <div className="space-y-5">
        <ScanResultPanel feedback={feedback} />
        <section aria-labelledby="history-heading" className="space-y-3 rounded-[20px] bg-bg-surface p-5">
          <h2 id="history-heading" className="font-semibold">
            Scanned on this device
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-text-primary/70">Nothing yet.</p>
          ) : (
            <ul className="divide-y divide-text-primary/10">
              {history.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-mono font-semibold">{item.code}</span>
                    <span className="text-xs text-text-primary/70">{time(item.at)}</span>
                  </span>
                  {item.result === "queued" ? (
                    <span className="text-xs font-semibold text-text-primary/70">Waiting to sync</span>
                  ) : (
                    <StatusBadge status={item.result} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
