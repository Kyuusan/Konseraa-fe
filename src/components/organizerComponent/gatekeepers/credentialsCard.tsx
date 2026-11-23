"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";

/** No 0/O or 1/l/I, so the password can be read out or typed from a screen. */
const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generatePassword(length = 12) {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (byte) => PASSWORD_CHARS[byte % PASSWORD_CHARS.length]).join("");
}

interface CredentialsCardProps {
  name: string;
  email: string;
  password: string;
}

// The password is shown in plain text on purpose (agreed): the organizer has to pass it on.
export function CredentialsCard({ name, email, password }: CredentialsCardProps) {
  const [copied, setCopied] = useState(false);

  function copyAll() {
    const text = `Konsera gate account for ${name}\nSign in: ${window.location.origin}/login\nEmail: ${email}\nPassword: ${password}`;
    void navigator.clipboard?.writeText(text);
    setCopied(true);
  }

  return (
    <div className="space-y-4">
      <dl className="divide-y divide-text-primary/10 rounded-2xl bg-bg-surface-2 px-4 text-sm">
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-text-primary/70">Sign in at</dt>
          <dd className="font-medium">/login</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-text-primary/70">Email</dt>
          <dd className="truncate font-medium">{email}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-text-primary/70">Password</dt>
          <dd className="font-mono text-base font-semibold tracking-wider">{password}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" hoverScale={1} onClick={copyAll} className="rounded-full">
          <Copy aria-hidden="true" />
          Copy sign-in details
        </Button>
        <span role="status" className="text-sm text-accent-lime">
          {copied && "Copied."}
        </span>
      </div>
      <p className="text-xs text-text-primary/70">
        Send this privately to {name}, not in a group chat. They will be asked to set their own password at first
        sign-in.
      </p>
    </div>
  );
}
