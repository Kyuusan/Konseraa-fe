"use client";

import { LogOut, Menu, User } from "lucide-react";
import { useCallback, useState } from "react";
import { BrandLogo } from "../shared/brandLogo";
import { ADMIN_FOOTER_NAV, ADMIN_NAV, type NavItem } from "../shared/navigation";
import { ProfileMenu, type ProfileLink } from "../shared/profileMenu";
import { MobileDrawer } from "../sidebar/mobileDrawer";
import { SidebarNav } from "../sidebar/sidebarNav";
import { HeadbarActions } from "./headbarActions";
import { HeadbarShell } from "./headbarShell";

const PROFILE_LINKS: ProfileLink[] = [
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Log out", href: "/admin/login", icon: LogOut },
];

// On mobile the admin rail moves into this drawer, so it lists everything with labels.
const DRAWER_FOOTER_NAV: NavItem[] = [{ label: "Profile", href: "/admin/profile", icon: User }, ...ADMIN_FOOTER_NAV];

// Admin headbar: logo, notifications and account only (no nav list, no search).
export function AdminHeadbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <HeadbarShell>
        <div className="flex h-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open admin menu"
              aria-expanded={drawerOpen}
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-surface-2 text-text-primary shadow-[0_8px_24px_rgba(0,0,0,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-accent-pink md:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <BrandLogo href="/admin/dashboard" tag="Admin" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <HeadbarActions />
            <ProfileMenu name="Super Admin" email="superadmin@konsera.test" links={PROFILE_LINKS} />
          </div>
        </div>
      </HeadbarShell>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} label="Admin menu">
        <SidebarNav items={ADMIN_NAV} label="Admin" variant="full" onNavigate={closeDrawer} />
        <div className="mt-auto">
          <SidebarNav
            items={DRAWER_FOOTER_NAV}
            label="Admin account"
            variant="full"
            onNavigate={closeDrawer}
          />
        </div>
      </MobileDrawer>
    </>
  );
}
