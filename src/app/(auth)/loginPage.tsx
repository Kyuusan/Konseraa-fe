"use client";

import Link from "next/link";
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
  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Your next show is waiting" />
      <SocialButtons />
      <OrDivider />

      <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
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
        <CheckboxLine name="remember">Remember me</CheckboxLine>
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
