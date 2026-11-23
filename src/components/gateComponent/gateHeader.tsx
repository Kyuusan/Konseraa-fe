"use client";

import { Bell, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearDemoCookie, DEMO_GATEKEEPER_COOKIE } from "@/__fixtures__/demoState";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/gate", label: "Scan" },
  { href: "/gate/stats", label: "Visitors" },
];

// The gatekeeper's whole app: scan and visitors (agreed scope), plus their own
// notifications, profile and sign out.
export function GateHeader({ name, unread }: { name: string; unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSearchParams().get("session");

  function signOut() {
    clearDemoCookie(DEMO_GATEKEEPER_COOKIE);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-text-primary/10 bg-bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
        <div className="min-w-0">
          <p className="font-logo text-lg leading-none">KONSERA</p>
          <p className="truncate text-xs text-text-primary/70">Gate · {name}</p>
        </div>
        <nav aria-label="Gate" className="flex rounded-full bg-bg-surface p-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={session ? `${link.href}?session=${session}` : link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold sm:px-4 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-pink",
                  active ? "bg-accent-pink text-bg-base" : "text-text-primary/80 hover:text-text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" hoverScale={1} className="relative rounded-full">
            <Link href="/gate/notifications" aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}>
              <Bell aria-hidden="true" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-pink" />}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" hoverScale={1} className="rounded-full">
            <Link href="/gate/profile" aria-label="Profile">
              <User aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" hoverScale={1} onClick={signOut} className="rounded-full">
            <LogOut aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
