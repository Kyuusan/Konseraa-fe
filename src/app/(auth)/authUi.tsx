"use client";

import { Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-10">
      <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-lg leading-snug text-text-muted">{subtitle}</p>
    </div>
  );
}

export function GoogleButton() {
  return (
    <button
      type="button"
      className="mt-10 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-text-primary/20 text-base font-medium outline-none transition-colors hover:bg-bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent-pink"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}

export function OrDivider() {
  return <div className="my-7 text-center text-sm font-medium text-text-muted">or</div>;
}

type FieldBoxProps = ComponentProps<"input"> & {
  label: string;
  ariaLabel?: string;
  trailing?: ReactNode;
};

export function FieldBox({ label, ariaLabel, trailing, ...inputProps }: FieldBoxProps) {
  return (
    <label className="flex h-14 items-center gap-3 rounded-[10px] border border-text-primary/12 bg-bg-surface-2 px-5 transition-colors focus-within:border-accent-pink focus-within:ring-1 focus-within:ring-accent-pink">
      <input
        {...inputProps}
        aria-label={ariaLabel ?? label}
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-text-muted [&::-ms-reveal]:hidden [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_var(--color-bg-surface-2)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text-primary)]"
      />
      <span className="shrink-0 text-sm font-medium text-text-primary" aria-hidden="true">
        {label}
      </span>
      {trailing}
    </label>
  );
}

export function PasswordField(props: Omit<FieldBoxProps, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <FieldBox
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="shrink-0 cursor-pointer rounded-sm text-text-primary outline-none transition-colors hover:text-accent-lime focus-visible:ring-2 focus-visible:ring-accent-pink"
        >
          <Icon className="size-5" aria-hidden="true" />
        </button>
      }
    />
  );
}

export function CheckboxLine({
  children,
  ...inputProps
}: ComponentProps<"input"> & { children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-5 text-text-primary">
      <span className="relative mt-0.5 size-4 shrink-0">
        <input
          {...inputProps}
          type="checkbox"
          className="peer size-full appearance-none rounded-[3px] border border-text-primary/50 bg-bg-surface-2 outline-none checked:border-accent-lime checked:bg-accent-lime focus-visible:ring-2 focus-visible:ring-accent-pink"
        />
        <Check
          className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-bg-base peer-checked:block"
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
      <span>{children}</span>
    </label>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(90deg,var(--color-accent-lime)_50%,color-mix(in_srgb,var(--color-accent-lime)_80%,var(--color-bg-base))_50%)] bg-size-[200%_100%] bg-right text-base font-semibold text-bg-base outline-none transition-[background-position] duration-300 hover:bg-left focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface motion-reduce:transition-none"
    >
      {children}
    </button>
  );
}

// lucide-react has no Google logo, so this one brand mark stays as its own SVG.
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}
