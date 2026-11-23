"use client";

import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { ResetPasswordSchema } from "@/types/auth";
import { AuthHeading, PasswordField, SubmitButton } from "./authUi";

const linkClass = "font-medium text-accent-lime underline-offset-4 hover:underline";

export default function ResetPasswordPage({ token, email }: { token?: string; email?: string }) {
  const [values, setValues] = useState({ new_password: "", confirm_password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  // Without a token the link was opened incompletely; the backend also rejects used or expired ones.
  if (!token) {
    return (
      <>
        <AuthHeading title="This link doesn't work" subtitle="It may have expired or already been used. Ask for a new one." />
        <p className="mt-10 text-center text-sm text-text-muted">
          <Link href="/forgot-password" className={linkClass}>
            Send a new reset link
          </Link>
        </p>
      </>
    );
  }

  if (done) {
    return (
      <>
        <AuthHeading title="Password updated" subtitle="Sign in with your new password. You were signed out on your other devices." />
        <Link
          href="/login"
          className="mt-10 flex h-12 w-full items-center justify-center rounded-full bg-accent-lime text-base font-semibold text-bg-base outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
        >
          Sign in
        </Link>
      </>
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ResetPasswordSchema.safeParse({ token, ...values });
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.toReversed().map((issue) => [issue.path.join("."), issue.message])));
      return;
    }
    // Stands in for POST /auth/reset-password { token, new_password }.
    setErrors({});
    setDone(true);
  }

  const field = (key: keyof typeof values) => ({
    name: key,
    value: values[key],
    autoComplete: "new-password",
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    onChange: (event: { target: { value: string } }) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: "" }));
    },
  });

  return (
    <>
      <AuthHeading
        title="Set a new password"
        subtitle={
          email ? (
            <>
              For <span className="font-semibold text-text-primary">{email}</span>. Use at least 8 characters.
            </>
          ) : (
            "Use at least 8 characters."
          )
        }
      />

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-4">
        <PasswordField {...field("new_password")} label="New password" placeholder="••••••••" />
        {errors.new_password && (
          <p id="new_password-error" className="text-sm text-danger">
            {errors.new_password}
          </p>
        )}
        <PasswordField {...field("confirm_password")} label="Repeat password" placeholder="••••••••" />
        {errors.confirm_password && (
          <p id="confirm_password-error" className="text-sm text-danger">
            {errors.confirm_password}
          </p>
        )}
        <SubmitButton>Update password</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link href="/login" className={linkClass}>
          Back to sign in
        </Link>
      </p>
    </>
  );
}
