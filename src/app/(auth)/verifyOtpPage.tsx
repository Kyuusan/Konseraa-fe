"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent, SubmitEvent, KeyboardEvent } from "react";
import { AuthHeading, SubmitButton } from "./authUi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtpPage({ email }: { email?: string }) {
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const isComplete = digits.every(Boolean);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Writes digits starting at `start`, so typing, pasting and SMS/email
  // autofill (which can drop the whole code into one box) all work.
  function fillFrom(start: number, raw: string) {
    const incoming = raw.replace(/\D/g, "").slice(0, OTP_LENGTH - start).split("");
    if (incoming.length === 0) return;
    setDigits((current) => {
      const next = [...current];
      incoming.forEach((digit, offset) => {
        next[start + offset] = digit;
      });
      return next;
    });
    inputs.current[Math.min(start + incoming.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      setDigits((current) => {
        const next = [...current];
        const target = current[index] ? index : Math.max(index - 1, 0);
        next[target] = "";
        inputs.current[target]?.focus();
        return next;
      });
    } else if (event.key === "ArrowLeft") {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight") {
      inputs.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    fillFrom(index, event.clipboardData.getData("text"));
  }

  function handleResend() {
    setDigits(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    inputs.current[0]?.focus();
  }

  return (
    <>
      <AuthHeading
        title="Verify your email"
        subtitle={
          <>
            Enter the {OTP_LENGTH}-digit code we sent to{" "}
            <span className="font-semibold text-text-primary">{email ?? "your email"}</span>
          </>
        }
      />

      <form
        onSubmit={(event: SubmitEvent<HTMLFormElement>) => event.preventDefault()}
        className="mt-10 space-y-6"
      >
        <div role="group" aria-label="Verification code" className="grid grid-cols-6 gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => fillFrom(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onFocus={(event) => event.currentTarget.select()}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
              autoFocus={index === 0}
              className="h-14 w-full min-w-0 rounded-[10px] border border-text-primary/12 bg-bg-surface-2 text-center font-heading text-2xl font-semibold text-text-primary caret-accent-pink outline-none transition-colors focus:border-accent-pink focus:ring-1 focus:ring-accent-pink sm:h-16"
            />
          ))}
        </div>

        <SubmitButton disabled={!isComplete}>Verify</SubmitButton>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-text-muted">
        <p aria-live="polite">
          Didn&apos;t get the code?{" "}
          {secondsLeft > 0 ? (
            <span className="font-medium text-text-primary">Resend in {secondsLeft}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="cursor-pointer rounded-sm font-medium text-accent-lime underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent-pink"
            >
              Resend code
            </button>
          )}
        </p>
        <p>
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-medium text-accent-lime underline-offset-4 hover:underline"
          >
            Change it
          </Link>
        </p>
      </div>
    </>
  );
}
