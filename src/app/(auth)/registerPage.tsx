"use client";

import Link from "next/link";
import {
  AuthHeading,
  CheckboxLine,
  FieldBox,
  GoogleButton,
  OrDivider,
  PasswordField,
  SubmitButton,
} from "./authUi";

export default function RegisterPage() {
  return (
    <>
      <AuthHeading title="Create an account" subtitle="From world arenas to local gigs" />
      <GoogleButton />
      <OrDivider />

      <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
        <FieldBox
          name="name"
          label="Name"
          placeholder="Your full name"
          autoComplete="name"
          required
        />
        <FieldBox
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            name="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm"
            ariaLabel="Confirm password"
            placeholder="••••••••"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <CheckboxLine name="acceptTerms" required>
          I agree to the Terms of Service and Privacy Policy
        </CheckboxLine>
        <SubmitButton>Create account</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-accent-lime underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
