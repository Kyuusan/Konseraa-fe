"use client";

import Link from "next/link";
import QRCode from "react-qr-code";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useRemaining } from "@/hooks/use-now";
import type { Payment, PaymentMethod } from "@/types/booking";
import { Countdown } from "../shared/countdown";
import { EmptyState } from "../shared/emptyState";
import { VaInstructions } from "./vaInstructions";

interface PaymentInstructionsProps {
  payment: Payment;
  method: PaymentMethod;
  retryHref: string;
  successHref: string;
}

export function PaymentInstructions({ payment, method, retryHref, successHref }: PaymentInstructionsProps) {
  const remaining = useRemaining(payment.expires_at);

  if (remaining === 0) {
    return (
      <EmptyState
        title="The payment window has closed"
        description="This booking expired before it was paid, so the tickets were released."
        action={
          <Button asChild hoverScale={1} className="rounded-full">
            <Link href={retryHref}>Choose tickets again</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-bg-surface px-5 py-4 text-sm">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent-pink motion-safe:animate-pulse" />
          Waiting for payment
        </span>
        <span className="text-text-muted">
          Pay within <Countdown until={payment.expires_at} />
        </span>
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

      <p className="text-sm text-text-muted">Once the payment is confirmed, your e-tickets appear under Tickets.</p>

      {process.env.NODE_ENV !== "production" && (
        <p className="text-sm">
          <Link href={successHref} className="font-medium text-accent-lime underline-offset-4 hover:underline">
            Simulate a confirmed payment
          </Link>{" "}
          <span className="text-text-muted">(development only, until the payment webhook exists)</span>
        </p>
      )}
    </div>
  );
}
