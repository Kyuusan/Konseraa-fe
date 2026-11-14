"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { formatPrice } from "@/lib/format";

interface VaInstructionsProps {
  vaNumber: string;
  bankName: string;
  amount: number;
}

export function VaInstructions({ vaNumber, bankName, amount }: VaInstructionsProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">{bankName} number</p>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-heading text-2xl font-bold tracking-wider tabular-nums sm:text-3xl">{vaNumber}</p>
          <Button variant="outline" size="sm" hoverScale={1} onClick={copy} className="rounded-full" aria-live="polite">
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-text-muted marker:text-text-primary">
        <li>Open your {bankName.replace(" Virtual Account", "")} mobile or internet banking app.</li>
        <li>Choose transfer to virtual account and enter the number above.</li>
        <li>
          Pay exactly <span className="font-semibold text-text-primary">{formatPrice(amount)}</span>. Your tickets are
          issued as soon as the payment is confirmed.
        </li>
      </ol>
    </div>
  );
}
