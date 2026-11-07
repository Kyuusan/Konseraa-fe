"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "../shared/brandLogo";
import { USER_NAV } from "../shared/navigation";
import { ProfileMenu, type ProfileLink } from "../shared/profileMenu";
import { HeadbarActions } from "./headbarActions";
import { HeadbarShell } from "./headbarShell";
import { NavPills } from "./navPills";
import { SearchBar } from "./searchBar";
import { UserBottomNav } from "./userBottomNav";

const PROFILE_LINKS: ProfileLink[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Log out", href: "/login", icon: LogOut },
];

const FADE = { duration: 0.15 };

export function UserHeadbar() {
  const [searching, setSearching] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const hasSearched = useRef(false);

  // Send focus back to the search button once the field closes.
  useEffect(() => {
    if (searching) hasSearched.current = true;
    else if (hasSearched.current) searchButtonRef.current?.focus();
  }, [searching]);

  return (
    <>
      <HeadbarShell>
        {/* reducedMotion="user" turns the grow/shrink into a plain swap when requested. */}
        <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 420, damping: 38 }}>
            <AnimatePresence initial={false}>
              {searching ? (
                <motion.div key="search" className="absolute inset-0">
                  <SearchBar onClose={() => setSearching(false)} />
                </motion.div>
              ) : (
                // 1fr | auto | 1fr keeps the nav centred on the page, and the side
                // columns never shrink below their content, so nothing overlaps.
                <motion.div
                  key="bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: FADE }}
                  exit={{ opacity: 0, transition: FADE }}
                  className="absolute inset-0 grid grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] items-center gap-3"
                >
                  <BrandLogo href="/home" className="justify-self-start" />
                  <div className="hidden md:block">
                    <NavPills items={USER_NAV} />
                  </div>
                  <div className="col-start-3 flex items-center gap-2 justify-self-end">
                    <HeadbarActions
                      onSearch={() => setSearching(true)}
                      searchButtonRef={searchButtonRef}
                    />
                    <ProfileMenu name="Demo User" email="user@konsera.test" links={PROFILE_LINKS} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </MotionConfig>
      </HeadbarShell>
      <UserBottomNav items={USER_NAV} />
    </>
  );
}
