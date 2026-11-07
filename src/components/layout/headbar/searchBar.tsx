"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import { useState } from "react";

export const SEARCH_LAYOUT_ID = "headbar-search";

// Replaces the whole headbar row while open, so it can never overlap the logo or nav.
export function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex h-12 items-center gap-2">
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.18 }}
        type="button"
        onClick={onClose}
        aria-label="Close search"
        className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-surface-2 text-text-primary shadow-[0_8px_24px_rgba(0,0,0,0.35)] outline-none hover:bg-bg-surface-2/80 focus-visible:ring-2 focus-visible:ring-accent-pink"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </motion.button>

      <motion.label
        layoutId={SEARCH_LAYOUT_ID}
        style={{ borderRadius: 9999 }}
        className="flex h-12 min-w-0 flex-1 items-center bg-bg-surface-2 px-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] focus-within:ring-2 focus-within:ring-accent-pink"
      >
        {/* Fades in after the pill has started growing, so the contents don't look stretched. */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.18 } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Search className="size-5 shrink-0 text-text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && onClose()}
            autoFocus
            placeholder="Search concerts, artists, venues"
            aria-label="Search concerts, artists, venues"
            className="min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="shrink-0 cursor-pointer rounded-sm text-text-primary outline-none hover:text-accent-lime focus-visible:ring-2 focus-visible:ring-accent-pink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </motion.span>
      </motion.label>
    </div>
  );
}
