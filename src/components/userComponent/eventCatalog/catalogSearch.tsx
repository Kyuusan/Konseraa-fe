"use client";

import { Search, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";

const LAYOUT_ID = "catalog-search";
const PILL = "bg-bg-surface-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]";

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

// A search pill that grows into a full-width field (shared layoutId) and shrinks back on close.
export function CatalogSearch({ value, onChange }: CatalogSearchProps) {
  const [open, setOpen] = useState(value !== "");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);

  // Send focus back to the search button once the field closes.
  useEffect(() => {
    if (open) hasOpened.current = true;
    else if (hasOpened.current) buttonRef.current?.focus();
  }, [open]);

  function close() {
    onChange("");
    setOpen(false);
  }

  return (
    // reducedMotion="user" turns the grow/shrink into a plain swap when requested.
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 420, damping: 38 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.div
            key="field"
            layoutId={LAYOUT_ID}
            style={{ borderRadius: 9999 }}
            className={`flex h-12 min-w-0 flex-1 items-center pr-1.5 pl-5 focus-within:ring-2 focus-within:ring-accent-pink ${PILL}`}
          >
            {/* Fades in after the pill has started growing, so the contents don't look stretched. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.18 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <Search className="size-5 shrink-0 text-text-muted" aria-hidden="true" />
              <Input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => event.key === "Escape" && close()}
                autoFocus
                placeholder="Search events, venues, cities"
                aria-label="Search events, venues, cities"
                className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent [&::-webkit-search-cancel-button]:hidden"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                hoverScale={1}
                onClick={close}
                aria-label="Close search"
                className="shrink-0 rounded-full hover:text-accent-lime"
              >
                <X aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <Button
            key="button"
            ref={buttonRef}
            layoutId={LAYOUT_ID}
            style={{ borderRadius: 9999 }}
            variant="ghost"
            size="icon"
            hoverScale={1}
            onClick={() => setOpen(true)}
            aria-label="Search events"
            className={`size-12 shrink-0 rounded-full hover:bg-bg-surface-2/80 [&_svg:not([class*='size-'])]:size-5 ${PILL}`}
          >
            <Search aria-hidden="true" />
          </Button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
