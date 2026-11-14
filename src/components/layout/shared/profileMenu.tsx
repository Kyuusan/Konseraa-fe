"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";

export interface ProfileLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface ProfileMenuProps {
  name: string;
  email: string;
  links: ProfileLink[];
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function ProfileMenu({ name, email, links }: ProfileMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          hoverScale={1}
          aria-label={`Account menu for ${name}`}
          className="h-12 min-w-0 gap-3 rounded-full bg-bg-surface-2 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-bg-surface-2/80 xl:pr-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-pink text-sm font-bold text-bg-base">
            {initials(name)}
          </span>
          <span className="hidden min-w-0 gap-0.5 text-left xl:grid">
            <span className="truncate text-sm font-semibold">{name}</span>
            <span className="truncate text-xs font-normal text-text-muted">{email}</span>
          </span>
          <ChevronDown className="hidden text-text-muted xl:block" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-56 rounded-2xl p-1.5">
        <DropdownMenuLabel className="xl:hidden">
          <span className="block truncate text-sm font-semibold">{name}</span>
          <span className="block truncate text-xs font-normal text-text-muted">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="xl:hidden" />
        {links.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={label} onSelect={() => router.push(href)} className="h-10 rounded-[10px] px-3">
            <Icon aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
