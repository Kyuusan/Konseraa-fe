"use client";

import { useState } from "react";
import { AuthHeading, FieldBox, PasswordField, SubmitButton } from "@/app/(auth)/authUi";

export default function Page() {
  const [showForgotInfo, setShowForgotInfo] = useState(false);

  return (
    <>
      <AuthHeading title="Admin sign in" subtitle="For Konsera staff only" />

      <form onSubmit={(event) => event.preventDefault()} className="mt-10 space-y-4">
        <FieldBox
          name="email"
          type="email"
          label="Email"
          placeholder="admin@example.com"
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
        <SubmitButton>Sign in</SubmitButton>
      </form>

      <div className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={() => setShowForgotInfo(true)}
          className="cursor-pointer rounded-sm font-medium text-accent-lime underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent-pink"
        >
          Forgot password?
        </button>
        {showForgotInfo && (
          <p role="status" className="mt-2 text-text-primary">
            Contact the Super Admin to reset your password.
          </p>
        )}
      </div>
    </>
  );
}
