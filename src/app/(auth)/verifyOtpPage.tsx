"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthHeading, SubmitButton } from "./authUi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const SLOT =
  "h-14 flex-1 rounded-[10px] border border-text-primary/12 bg-bg-surface-2 font-heading text-2xl font-semibold first:rounded-l-[10px] first:border-l last:rounded-r-[10px] data-[active=true]:border-accent-pink data-[active=true]:ring-1 data-[active=true]:ring-accent-pink sm:h-16 dark:bg-bg-surface-2";

export default function VerifyOtpPage({ email }: { email?: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const isComplete = code.length === OTP_LENGTH;

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleResend() {
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
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
        onSubmit={(event: SubmitEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (isComplete) router.push("/profiling");
        }}
        className="mt-10 space-y-6"
      >
        <InputOTP
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          value={code}
          onChange={setCode}
          autoFocus
          aria-label="Verification code"
          containerClassName="w-full"
        >
          <InputOTPGroup className="grid w-full grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: OTP_LENGTH }, (_, index) => (
              <InputOTPSlot key={index} index={index} className={SLOT} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <SubmitButton disabled={!isComplete}>Verify</SubmitButton>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-text-muted">
        <p aria-live="polite">
          Didn&apos;t get the code?{" "}
          {secondsLeft > 0 ? (
            <span className="font-medium text-text-primary">Resend in {secondsLeft}s</span>
          ) : (
            <Button variant="link" hoverScale={1} onClick={handleResend} className="h-auto p-0 font-medium text-accent-lime">
              Resend code
            </Button>
          )}
        </p>
        <p>
          Wrong email?{" "}
          <Link href="/register" className="font-medium text-accent-lime underline-offset-4 hover:underline">
            Change it
          </Link>
        </p>
      </div>
    </>
  );
}
