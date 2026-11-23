"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import { clearDemoCookie, DEMO_GATEKEEPER_COOKIE, writeDemoCookie } from "@/__fixtures__/demoState";
import { findGatekeeperByEmail } from "@/__fixtures__/gatekeepers";
import {
  AuthHeading,
  CheckboxLine,
  FieldBox,
  SocialButtons,
  OrDivider,
  PasswordField,
  SubmitButton,
} from "./authUi";

export default function LoginPage() {
  const router = useRouter();

  // Demo only: one login for every role. The real API returns the roles; here a
  // gatekeeper fixture email opens the gate area and anything else the customer app.
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const identifier = String(new FormData(event.currentTarget).get("identifier") ?? "");
    const gatekeeper = findGatekeeperByEmail(identifier);
    if (gatekeeper?.status === "active") {
      writeDemoCookie(DEMO_GATEKEEPER_COOKIE, gatekeeper.id);
      router.push("/gate");
    } else {
      clearDemoCookie(DEMO_GATEKEEPER_COOKIE);
      router.push("/home");
    }
    router.refresh();
  }

  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Your next show is waiting" />
      <SocialButtons />
      <OrDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldBox
          name="identifier"
          label="Email or phone"
          placeholder="you@example.com"
          autoComplete="username"
          required
        />
        <PasswordField
          name="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between gap-3">
          <CheckboxLine name="remember">Remember me</CheckboxLine>
          <Link href="/forgot-password" className="shrink-0 text-sm font-medium text-accent-lime underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>
        <SubmitButton>Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-accent-lime underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
