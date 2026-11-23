import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface ProfileSummaryProps {
  name: string;
  email: string;
  /** Role labels, e.g. ["Fan", "Organizer"]. */
  roles: string[];
  memberSince?: string;
  aside?: ReactNode;
}

export function ProfileSummary({ name, email, roles, memberSince, aside }: ProfileSummaryProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-bg-surface p-6 sm:p-8">
      <div className="flex min-w-0 items-center gap-5">
        <span className="flex size-18 shrink-0 items-center justify-center rounded-full bg-accent-pink font-heading text-2xl font-bold text-bg-base">
          {initials(name)}
        </span>
        <div className="min-w-0 space-y-1.5">
          <p className="truncate font-heading text-2xl font-bold">{name}</p>
          <p className="truncate text-sm text-text-primary/70">{email}</p>
          <div className="flex flex-wrap items-center gap-2">
            {roles.map((role) => (
              <span key={role} className="rounded-full bg-bg-surface-2 px-3 py-0.5 text-xs font-semibold">
                {role}
              </span>
            ))}
            {memberSince && (
              <span className="text-xs text-text-primary/60">Member since {formatDate(memberSince, "Asia/Jakarta")}</span>
            )}
          </div>
        </div>
      </div>
      {aside}
    </section>
  );
}
