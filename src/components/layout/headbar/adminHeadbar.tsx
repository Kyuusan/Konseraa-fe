"use client";

import { LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/components/radix/sheet";
import { BrandLogo } from "../shared/brandLogo";
import { ADMIN_FOOTER_NAV, ADMIN_NAV, type NavItem } from "../shared/navigation";
import { ProfileMenu, type ProfileLink } from "../shared/profileMenu";
import { SidebarNav } from "../sidebar/sidebarNav";
import { HeadbarActions } from "./headbarActions";
import { HeadbarShell } from "./headbarShell";

const PROFILE_LINKS: ProfileLink[] = [
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Log out", href: "/admin/login", icon: LogOut },
];

// On mobile the admin rail moves into this sheet, so it lists everything with labels.
const DRAWER_FOOTER_NAV: NavItem[] = [{ label: "Profile", href: "/admin/profile", icon: User }, ...ADMIN_FOOTER_NAV];

// Admin headbar: logo, notifications and account only (no nav list, no search).
export function AdminHeadbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <HeadbarShell>
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                hoverScale={1}
                aria-label="Open admin menu"
                className="size-12 shrink-0 rounded-full bg-bg-surface-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-bg-surface-2/80 md:hidden [&_svg:not([class*='size-'])]:size-5"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" data-lenis-prevent className="flex flex-col gap-4 overflow-y-auto bg-bg-surface-2 p-4">
              <SheetHeader className="p-0">
                <SheetTitle className="font-heading">Admin menu</SheetTitle>
                <SheetDescription className="sr-only">Admin pages and account links.</SheetDescription>
              </SheetHeader>
              <SidebarNav items={ADMIN_NAV} label="Admin" variant="full" onNavigate={closeMenu} />
              <div className="mt-auto">
                <SidebarNav items={DRAWER_FOOTER_NAV} label="Admin account" variant="full" onNavigate={closeMenu} />
              </div>
            </SheetContent>
          </Sheet>
          <BrandLogo href="/admin/dashboard" tag="Admin" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <HeadbarActions />
          <ProfileMenu name="Super Admin" email="superadmin@konsera.test" links={PROFILE_LINKS} />
        </div>
      </div>
    </HeadbarShell>
  );
}
