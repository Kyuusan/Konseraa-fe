"use client";

import Link from "next/link";
import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ForgotPasswordSchema } from "@/types/auth";
import { AuthHeading, FieldBox, SubmitButton } from "./authUi";

const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ForgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    // Stands in for POST /auth/forgot-password.
    setError(undefined);
    setSentTo(result.data.email);
    setSecondsLeft(RESEND_SECONDS);
  }

  if (sentTo) {
    return (
      <>
        <AuthHeading
          title="Check your inbox"
          subtitle={
            <>
              If an account exists for <span className="font-semibold text-text-primary">{sentTo}</span>, we sent a link to
              set a new password. It works once and expires soon.
            </>
          }
        />

        {process.env.NODE_ENV !== "production" && (
          <div className="mt-8 rounded-2xl border border-dashed border-warning/50 px-4 py-3 text-sm">
            <span className="font-semibold text-warning">Development only: </span>
            <Link
              href={`/reset-password?token=demo-reset-token&email=${encodeURIComponent(sentTo)}`}
              className="font-medium text-accent-lime underline-offset-4 hover:underline"
            >
              open the link from the email
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-2 text-center text-sm text-text-muted">
          <p aria-live="polite">
            Didn&apos;t get it? Check your spam folder or{" "}
            {secondsLeft > 0 ? (
              <span className="font-medium text-text-primary">send again in {secondsLeft}s</span>
            ) : (
              <Button
                variant="link"
                hoverScale={1}
                onClick={() => setSecondsLeft(RESEND_SECONDS)}
                className="h-auto p-0 font-medium text-accent-lime"
              >
                send it again
              </Button>
            )}
          </p>
          <p>
            Wrong email?{" "}
            <Button variant="link" hoverScale={1} onClick={() => setSentTo(null)} className="h-auto p-0 font-medium text-accent-lime">
              Use another one
            </Button>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Forgot your password?" subtitle="Enter your email and we'll send you a link to set a new one." />

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-4">
        <FieldBox
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(undefined);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "email-error" : undefined}
        />
        {error && (
          <p id="email-error" className="text-sm text-danger">
            {error}
          </p>
        )}
        <SubmitButton>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent-lime underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
