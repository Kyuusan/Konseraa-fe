"use client";

import { LogOut, Settings, User } from "lucide-react";
import { BrandLogo } from "../shared/brandLogo";
import { USER_NAV } from "../shared/navigation";
import { ProfileMenu, type ProfileLink } from "../shared/profileMenu";
import { HeadbarActions } from "./headbarActions";
import { HeadbarShell } from "./headbarShell";
import { NavPills } from "./navPills";
import { UserBottomNav } from "./userBottomNav";

const PROFILE_LINKS: ProfileLink[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Log out", href: "/login", icon: LogOut },
];

export function UserHeadbar() {
  return (
    <>
      <HeadbarShell>
        {/* 1fr | auto | 1fr keeps the nav centred on the page, and the side
            columns never shrink below their content, so nothing overlaps. */}
        <div className="grid h-full grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] items-center gap-3">
          <BrandLogo href="/home" className="justify-self-start" />
          <div className="hidden md:block">
            <NavPills items={USER_NAV} />
          </div>
          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            <HeadbarActions />
            <ProfileMenu name="Demo User" email="user@konsera.test" links={PROFILE_LINKS} />
          </div>
        </div>
      </HeadbarShell>
      <UserBottomNav items={USER_NAV} />
    </>
  );
}
