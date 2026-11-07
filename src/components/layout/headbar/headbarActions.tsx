"use client";

import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import type { Ref } from "react";
import { SEARCH_LAYOUT_ID } from "./searchBar";

const ICON_BUTTON =
  "relative flex size-9 cursor-pointer items-center justify-center rounded-full text-text-primary outline-none transition-colors hover:bg-text-primary/8 focus-visible:ring-2 focus-visible:ring-accent-pink";

interface HeadbarActionsProps {
  /** Leave out to hide the search button (admin headbar). */
  onSearch?: () => void;
  searchButtonRef?: Ref<HTMLButtonElement>;
}

export function HeadbarActions({ onSearch, searchButtonRef }: HeadbarActionsProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-1 rounded-full bg-bg-surface-2 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
      {onSearch && (
        // Shares a layoutId with the search field, so it grows into it and shrinks back.
        <motion.button
          ref={searchButtonRef}
          layoutId={SEARCH_LAYOUT_ID}
          style={{ borderRadius: 9999 }}
          type="button"
          onClick={onSearch}
          aria-label="Search"
          className={ICON_BUTTON}
        >
          <Search className="size-5" aria-hidden="true" />
        </motion.button>
      )}
      <button type="button" aria-label="Notifications" className={ICON_BUTTON}>
        <Bell className="size-5" aria-hidden="true" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-pink" />
      </button>
    </div>
  );
}
