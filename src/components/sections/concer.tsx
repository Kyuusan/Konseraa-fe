"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Ticket } from "lucide-react";

import { Button } from "@/components/ui/buttonAnimate";
import { cn } from "@/lib/utils";

/**
 * Concert Artist Index (ColorList) - driven by the parent <section> scroll area.
 * As the user scrolls through the parent section, the sticky viewport pins while
 * the artist list glides across the focus line, crossfading the darkened +
 * vignetted stage background and updating the bottom-right artist preview card.
 */

type ColorListItem = {
  id: string;
  name: string;
  badge?: string;
  location: string;
  price: string;
  image: string;
  /** Accent highlight colour (optional, defaults to Stagelight tokens). */
  color?: string;
};

type ColorListProps = {
  items?: ColorListItem[];
  /** Repeat the list if needed (default false: bounded to the artist list). */
  infinite?: boolean;
  /** Where the focus line sits, as a fraction of the viewport height. */
  focusLine?: number;
  showPreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  /** Fires when the active row changes. */
  onActiveChange?: (item: ColorListItem, index: number) => void;
  className?: string;
  itemClassName?: string;
};

const DEFAULT_ARTISTS: ColorListItem[] = [
  {
    id: "the-weeknd",
    name: "The Weeknd",
    badge: "After Hours Til Dawn",
    location: "SoFi Stadium · Los Angeles",
    price: "$145",
    color: "#FF3DA6",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "kanye-west",
    name: "Kanye West",
    badge: "Vultures Arena Experience",
    location: "Goyang Stadium · Seoul",
    price: "$180",
    color: "#C6FF3D",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "ariana-grande",
    name: "Ariana Grande",
    badge: "Eternal Sunshine Live",
    location: "The O2 Arena · London",
    price: "$130",
    color: "#FF3DA6",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "coldplay",
    name: "Coldplay",
    badge: "Music of the Spheres",
    location: "Wembley Stadium · London",
    price: "$160",
    color: "#C6FF3D",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "travis-scott",
    name: "Travis Scott",
    badge: "Circus Maximus Tour",
    location: "San Siro · Milan",
    price: "$150",
    color: "#FF3DA6",
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "billie-eilish",
    name: "Billie Eilish",
    badge: "Hit Me Hard and Soft",
    location: "Tokyo Dome · Tokyo",
    price: "$125",
    color: "#C6FF3D",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "bruno-mars",
    name: "Bruno Mars",
    badge: "24K Magic World Live",
    location: "National Stadium · Singapore",
    price: "$175",
    color: "#FF3DA6",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "arctic-monkeys",
    name: "Arctic Monkeys",
    badge: "The Car World Tour",
    location: "Accor Arena · Paris",
    price: "$120",
    color: "#C6FF3D",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1600&auto=format&fit=crop",
  },
];

const SIZES = {
  sm: "md:w-72",
  md: "md:w-80",
  lg: "md:w-96",
};

function ColorList({
  items = DEFAULT_ARTISTS,
  focusLine = 0.42,
  showPreview = true,
  previewSize = "md",
  onActiveChange,
  className,
  itemClassName,
}: ColorListProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rows = React.useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = React.useState(0);
  const [bounds, setBounds] = React.useState({
    startOffset: -36,
    endOffset: -520,
  });
  const reducedMotion = useReducedMotion();

  const onChange = React.useRef(onActiveChange);
  React.useEffect(() => {
    onChange.current = onActiveChange;
  }, [onActiveChange]);

  const total = items.length;
  const current = items[active % total];

  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (current) {
      onChange.current?.(current, active);
    }
  }, [active, current]);

  // Measure the first and last row centers so the list glides accurately across focusLine
  const measureRows = React.useCallback(() => {
    const firstRow = rows.current[0];
    const lastRow = rows.current[total - 1];
    if (!firstRow || !lastRow) return;
    const startOffset = -(firstRow.offsetTop + firstRow.offsetHeight / 2);
    const endOffset = -(lastRow.offsetTop + lastRow.offsetHeight / 2);
    setBounds({ startOffset, endOffset });
  }, [total]);

  React.useEffect(() => {
    measureRows();
    window.addEventListener("resize", measureRows);
    return () => window.removeEventListener("resize", measureRows);
  }, [measureRows]);

  // Track scroll progress directly from the parent <section>
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const listY = useTransform(
    scrollYProgress,
    [0, 1],
    [bounds.startOffset, bounds.endOffset],
  );

  // Update active artist based on parent section scroll progress
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (total <= 1) return;
    const clamped = Math.max(0, Math.min(1, progress));
    const idx = Math.round(clamped * (total - 1));
    setActive((prev) => (prev !== idx ? idx : prev));
  });

  const scrollToRow = (index: number) => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || total <= 1) return;
    const rect = sectionEl.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = sectionEl.offsetHeight - window.innerHeight;
    const targetProgress = index / (total - 1);
    window.scrollTo({
      top: sectionTop + targetProgress * scrollableDistance,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      data-slot="color-list"
      aria-label="Global Concerts"
      style={{ height: `${100 + total * 14}vh` }}
      className={cn(
        "relative z-20 w-full bg-bg-base text-(--color-text-primary) select-none",
        className,
      )}
    >
      {/* ── Sticky Stage Viewport driven by parent <section> scroll ── */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* ── Background Stage Layer (Darkened + Heavy Black Vignette) ── */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-bg-base">
          <AnimatePresence initial={false}>
            {current?.image && (
              <motion.img
                key={current.id}
                src={current.image}
                alt={current.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.34 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
                draggable={false}
              />
            )}
          </AnimatePresence>

          {/* Heavy Radial Black Vignette Shadow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 72% 62% at 50% 45%, rgba(11, 11, 14, 0.15) 0%, rgba(11, 11, 14, 0.82) 65%, #0B0B0E 100%)",
            }}
          />

          {/* Top & Bottom Seamless Stage Fade */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #0B0B0E 0%, rgba(11, 11, 14, 0.3) 18%, rgba(11, 11, 14, 0.3) 82%, #0B0B0E 100%)",
            }}
          />

          {/* Left & Right Deep Vignette Edges */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(11, 11, 14, 0.85) 0%, transparent 32%, transparent 68%, rgba(11, 11, 14, 0.88) 100%)",
            }}
          />
        </div>

        {/* ── Artist List (positioned via parent section scroll progress) ── */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden mask-[linear-gradient(to_bottom,black_0%,black_70%,transparent_88%)] md:mask-none">
          <motion.div
            style={{
              top: `${focusLine * 100}%`,
              y: listY,
            }}
            className="pointer-events-auto relative flex flex-col gap-3 whitespace-nowrap will-change-transform"
          >
            {items.map((item, i) => {
              const on = i === active;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    rows.current[i] = el;
                  }}
                  onClick={() => scrollToRow(i)}
                  data-index={i}
                  data-active={on || undefined}
                  className={cn(
                    "group flex cursor-pointer items-center gap-4 px-6 py-2.5 md:gap-6 md:px-12",
                    itemClassName,
                  )}
                >
                  {/* Active Stage Marker */}
                  <span
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300",
                      on
                        ? "scale-100 bg-(--color-accent-lime) shadow-[0_0_16px_rgba(198,255,61,0.8)]"
                        : "scale-0 bg-transparent",
                    )}
                  />

                  {/* Artist / Band Name */}
                  <span
                    className={cn(
                      "font-heading text-4xl font-normal uppercase tracking-[-0.04em] transition-[transform,color] duration-300 sm:text-5xl md:text-7xl",
                      on
                        ? "translate-x-1 text-(--color-text-primary)"
                        : "text-(--color-text-muted) group-hover:text-(--color-text-primary)",
                    )}
                  >
                    {item.name}
                  </span>

                  {/* Tour / Show Badge */}
                  {item.badge && (
                    <span
                      className={cn(
                        "hidden rounded-full border px-3.5 py-1 font-sans text-xs font-semibold uppercase tracking-wider transition-colors duration-300 sm:inline-flex",
                        on
                          ? "border-(--color-accent-pink)/40 bg-(--color-accent-pink)/15 text-(--color-text-primary)"
                          : "border-(--color-border) bg-white/5 text-(--color-text-muted)",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Artist Card (Mobile: Compact Bottom Dock · Desktop: Bottom-Right Vertical Card) ── */}
        {showPreview && current && (
          <div
            className={cn(
              "pointer-events-auto absolute inset-x-4 bottom-5 z-20 flex flex-row items-center gap-3.5 overflow-hidden rounded-[20px] border border-(--color-border) bg-(--color-bg-surface)/95 p-3 shadow-2xl md:inset-x-auto md:right-12 md:bottom-10 md:flex-col md:items-stretch md:gap-0 md:p-4",
              SIZES[previewSize],
            )}
          >
            {/* 1. Artist Name (Desktop top header) */}
            <h3 className="mb-3 hidden truncate font-heading text-xl font-bold uppercase tracking-tight text-(--color-text-primary) md:block">
              {current.name}
            </h3>

            {/* 2. Single Stage Photo (Mobile: Left thumbnail · Desktop: Full width) */}
            <div className="relative aspect-16/10 w-28 shrink-0 overflow-hidden rounded-xl bg-bg-base sm:w-32 md:w-full">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={current.id}
                  src={current.image}
                  alt={current.name}
                  initial={
                    reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* 3 & 4. Info Block (Mobile: Right column with Name + Location + Price · Desktop: Below photo) */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              {/* Artist Name on Mobile */}
              <h3 className="truncate font-heading text-base font-bold uppercase tracking-tight text-(--color-text-primary) md:hidden">
                {current.name}
              </h3>

              {/* Location */}
              <p className="mt-0.5 truncate font-sans text-xs font-medium tracking-wide text-(--color-text-muted) md:mt-3">
                {current.location}
              </p>

              {/* Ticket Price (Start from) in USD */}
              <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-(--color-border) pt-2 md:mt-2.5 md:pt-2.5">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted) md:text-[11px]">
                  Start from
                </span>
                <span className="font-heading text-base font-normal tracking-tight text-(--color-accent-lime) md:text-lg">
                  {current.price}
                </span>
              </div>

              <Button
                size="sm"
                aria-label={`Buy tickets for ${current.name}`}
                className="mt-2.5 w-full bg-[linear-gradient(90deg,var(--color-accent-lime)_50%,color-mix(in_srgb,var(--color-accent-lime)_80%,var(--color-bg-base))_50%)] bg-size-[200%_100%] bg-right transition-[background-position,transform] duration-300 hover:bg-left hover:brightness-100 motion-reduce:transition-none md:mt-3 md:h-10"
              >
                <Ticket className="size-4" aria-hidden="true" />
                Buy now
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export { ColorList, DEFAULT_ARTISTS };
export type { ColorListItem, ColorListProps };

export default ColorList;
