"use client";

import { useState } from "react";
import { AuthHeading, FieldBox, PasswordField, SubmitButton } from "@/app/(auth)/authUi";
import { Button } from "@/components/animate-ui/components/buttons/button";

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
        <Button
          variant="link"
          hoverScale={1}
          onClick={() => setShowForgotInfo(true)}
          className="h-auto p-0 font-medium text-accent-lime"
        >
          Forgot password?
        </Button>
        {showForgotInfo && (
          <p role="status" className="mt-2 text-text-primary">
            Contact the Super Admin to reset your password.
          </p>
        )}
      </div>
    </>
  );
}
