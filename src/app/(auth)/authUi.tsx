"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AuthHeading({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <div className="mt-10">
      <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-lg leading-snug text-text-muted">{subtitle}</p>
    </div>
  );
}

export function SocialButtons() {
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2">
      <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
      <SocialButton icon={<AppleIcon />} label="Continue with Apple" />
    </div>
  );
}

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Button
      variant="outline"
      hoverScale={1}
      className="h-12 w-full rounded-full px-4 text-sm font-medium xl:text-base"
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Button>
  );
}

export function OrDivider() {
  return <div className="my-7 text-center text-sm font-medium text-text-muted">or</div>;
}

type FieldBoxProps = Omit<ComponentProps<typeof Input>, "id"> & {
  label: string;
  ariaLabel?: string;
  trailing?: ReactNode;
};

export function FieldBox({ label, ariaLabel, trailing, className, ...inputProps }: FieldBoxProps) {
  const id = useId();

  return (
    <div className="flex h-14 items-center gap-3 rounded-[10px] border border-text-primary/12 bg-bg-surface-2 px-5 transition-colors focus-within:border-accent-pink focus-within:ring-1 focus-within:ring-accent-pink">
      <Input
        {...inputProps}
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent [&::-ms-reveal]:hidden [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_var(--color-bg-surface-2)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text-primary)]",
          className,
        )}
      />
      <Label htmlFor={id} className="shrink-0 text-sm font-medium">
        {label}
      </Label>
      {trailing}
    </div>
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
        <Button
          variant="ghost"
          size="icon-sm"
          hoverScale={1}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="shrink-0 rounded-full hover:text-accent-lime"
        >
          <Icon className="size-5" aria-hidden="true" />
        </Button>
      }
    />
  );
}

interface CheckboxLineProps {
  name: string;
  required?: boolean;
  children: ReactNode;
}

export function CheckboxLine({ name, required, children }: CheckboxLineProps) {
  const id = useId();

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        name={name}
        required={required}
        className="mt-0.5 border-text-primary/50 data-[state=checked]:border-accent-lime data-[state=checked]:bg-accent-lime data-[state=checked]:text-bg-base"
      />
      <Label htmlFor={id} className="text-sm leading-5 font-normal">
        {children}
      </Label>
    </div>
  );
}

export function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      hoverScale={1}
      className="h-12 w-full rounded-full bg-[linear-gradient(90deg,var(--color-accent-lime)_50%,color-mix(in_srgb,var(--color-accent-lime)_80%,var(--color-bg-base))_50%)] bg-size-[200%_100%] bg-right text-base font-semibold text-bg-base transition-[background-position] duration-300 hover:bg-left focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface motion-reduce:transition-none disabled:hover:bg-right"
    >
      {children}
    </Button>
  );
}

// lucide-react has no Google or Apple logos, so these brand marks stay as SVG.
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}

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
