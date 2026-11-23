"use client";

import { LoaderCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useRemaining } from "@/hooks/use-now";
import { UNPAID_ORDER_EXPIRY_MINUTES } from "@/lib/constants";
import type { Payment, PaymentMethod } from "@/types/booking";
import { CancelOrderDialog } from "../orders/cancelOrderDialog";
import { ButtonLink } from "../shared/buttonLink";
import { Countdown } from "../shared/countdown";
import { EmptyState } from "../shared/emptyState";
import { VaInstructions } from "./vaInstructions";

/** How often GET /bookings/{id}/payment-status is asked (PRD §13.5: automatic polling). */
const POLL_MS = 5000;
/** Pause on the "received" message before opening the success page. */
const REDIRECT_MS = 1500;

const clock = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });

interface PaymentInstructionsProps {
  bookingCode: string;
  payment: Payment;
  method: PaymentMethod;
  retryHref: string;
  successHref: string;
}

export function PaymentInstructions({ bookingCode, payment, method, retryHref, successHref }: PaymentInstructionsProps) {
  const router = useRouter();
  const remaining = useRemaining(payment.expires_at);
  const [status, setStatus] = useState<"pending" | "success" | "cancelled">("pending");
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [simulated, setSimulated] = useState(false);
  // Demo only: what the payment provider's webhook would have recorded on the server.
  const paidRef = useRef(false);

  // Stands in for GET /bookings/{id}/payment-status.
  const checkStatus = useCallback(() => {
    setChecking(true);
    setTimeout(() => {
      setLastChecked(Date.now());
      setChecking(false);
      if (paidRef.current) setStatus("success");
    }, 600);
  }, []);

  const expired = remaining === 0;

  useEffect(() => {
    if (status !== "pending" || expired) return;
    const timer = setInterval(checkStatus, POLL_MS);
    return () => clearInterval(timer);
  }, [checkStatus, status, expired]);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => router.push(successHref), REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [status, router, successHref]);

  if (status === "cancelled") {
    return (
      <EmptyState
        title="Order cancelled"
        description="The tickets held for you were released. Don't pay with the old payment code."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/orders" variant="outline" className="rounded-full">
              My orders
            </ButtonLink>
            <ButtonLink href={retryHref} className="rounded-full">
              Choose tickets again
            </ButtonLink>
          </div>
        }
      />
    );
  }

  if (status === "success") {
    return (
      <div role="status" className="space-y-3 rounded-[20px] bg-accent-lime p-6 text-bg-base">
        <p className="font-heading text-3xl font-bold">Payment received</p>
        <p className="flex items-center gap-2 font-medium">
          <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
          Opening your booking…
        </p>
      </div>
    );
  }

  if (expired) {
    return (
      <EmptyState
        title="This order has expired"
        description={`It wasn't paid within ${UNPAID_ORDER_EXPIRY_MINUTES / 60} hour, so it was cancelled automatically and the tickets were released.`}
        action={
          <ButtonLink href={retryHref} className="rounded-full">
            Choose tickets again
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-2xl bg-bg-surface px-5 py-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-semibold" aria-live="polite">
            {checking ? (
              <>
                <LoaderCircle className="size-4 text-accent-pink motion-safe:animate-spin" aria-hidden="true" />
                Checking payment…
              </>
            ) : (
              <>
                <span aria-hidden="true" className="size-2 rounded-full bg-accent-pink motion-safe:animate-pulse" />
                Waiting for payment
              </>
            )}
          </span>
          <span className="text-text-primary/70">
            Pay within <Countdown until={payment.expires_at} />
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-primary/70">
          <span>
            We check every {POLL_MS / 1000} seconds and move on as soon as it arrives
            {lastChecked !== null && ` · last checked ${clock.format(lastChecked)}`}.
          </span>
          <Button variant="ghost" size="sm" hoverScale={1} onClick={checkStatus} disabled={checking} className="h-8 rounded-full">
            <RefreshCw aria-hidden="true" />
            Check now
          </Button>
        </div>
      </div>

      <div className="rounded-[20px] bg-bg-surface p-6">
        {payment.va_number ? (
          <VaInstructions vaNumber={payment.va_number} bankName={method.name} amount={payment.amount} />
        ) : payment.qr_string ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {/* QR stays dark-on-light with a quiet zone and nothing on top (rules §9.6). */}
            <div className="rounded-2xl bg-text-primary p-5 text-bg-base">
              <QRCode value={payment.qr_string} size={208} fgColor="currentColor" bgColor="transparent" />
            </div>
            <p className="text-sm text-text-muted">Scan with any banking or e-wallet app that supports QRIS.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              You&apos;ll finish paying on the {method.name} page, then come back here automatically.
            </p>
            <Button asChild hoverScale={1.02} className="h-12 rounded-full px-6 text-base font-semibold">
              <a href={payment.payment_url} rel="noopener noreferrer">
                Continue to {method.name}
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          Orders not paid within {UNPAID_ORDER_EXPIRY_MINUTES / 60} hour expire automatically. Once the payment is confirmed,
          your e-tickets appear under Tickets.
        </p>
        <CancelOrderDialog bookingCode={bookingCode} onCancelled={() => setStatus("cancelled")} />
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-warning/50 px-4 py-3 text-sm">
          <Button
            variant="outline"
            size="sm"
            hoverScale={1}
            disabled={simulated}
            onClick={() => {
              paidRef.current = true;
              setSimulated(true);
            }}
            className="rounded-full"
          >
            Simulate payment received
          </Button>
          <span className="text-text-muted">
            {simulated
              ? "Done. The next automatic check picks it up."
              : "Development only, stands in for the payment provider's webhook."}
          </span>
        </div>
      )}
    </div>
  );
}
