"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Sparkle } from "lucide-react";

/* ─── Velocity / Parallax text ──────────────────────────────── */

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface VelocityRowProps {
  children: string;
  baseVelocity?: number;
  className?: string;
}

function VelocityRow({
  children,
  baseVelocity = -3,
  className = "",
}: VelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap leading-[0.95]">
      <motion.div
        style={{ x }}
        className={`font-heading font-medium uppercase flex whitespace-nowrap flex-nowrap will-change-transform ${className}`}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="block mr-8">
            {children.split("✦").map((part, partIndex) => (
              <Fragment key={partIndex}>
                {partIndex > 0 && (
                  <Sparkle className="mx-[0.3em] inline-block size-[0.7em] fill-current" aria-hidden="true" />
                )}
                {part.trim()}
              </Fragment>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Text reveal helpers ───────────────────────────────────── */

const REST_OPACITY = 0.5;
const REVEAL_SPAN = 0.9;
const WORD_WINDOW = 0.15;

function getWordRange(index: number, count: number) {
  const start = count <= 1 ? 0 : (index / (count - 1)) * REVEAL_SPAN;
  return { start, end: Math.min(1, start + WORD_WINDOW) };
}

function getWordOpacity(
  progress: number,
  { start, end }: { start: number; end: number },
  rest = REST_OPACITY
) {
  if (progress <= start) return rest;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return rest + (1 - rest) * t;
}

function RevealWord({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordRange(index, count);
  const opacity = useTransform(progress, (v) => getWordOpacity(v, range));

  return (
    <motion.span
      aria-hidden="true"
      style={reducedMotion ? undefined : { opacity }}
    >
      {children}
    </motion.span>
  );
}

/* ─── Main section ──────────────────────────────────────────── */

const HEADING_TEXT = "Beyond The Stage";
const PARAGRAPH_TEXT =
  "We bring unforgettable live concert experiences that connect music lovers across the globe. From massive stadium productions to intimate acoustic sessions, every show is crafted so you feel every single beat, not just hear it. Discover world-class headliners, enjoy effortless ticket access, and create lasting memories beneath the glow of the stage lights.";

export function KonseraAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Track the text reveal element as it scrolls up the viewport
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 90%", "end 55%"],
  });

  const paragraphWords = PARAGRAPH_TEXT.split(" ");

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 w-full overflow-hidden"
      style={{ background: "var(--color-bg-base)" }}
    >
      {/* Container that represents the visual 100vh layout */}
      <div className="relative min-h-screen w-full">
      {/* ── Velocity text rows — upper-left diagonal ── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "4rem",
          left: "-2rem",
          width: "120%",
          transform: "rotate(6deg)",
          transformOrigin: "top left",
        }}
      >
        <div className="flex flex-col gap-2">
          <VelocityRow
            baseVelocity={-4}
            className="text-2xl md:text-4xl lg:text-5xl"
          >
            WORLD TOUR 2026 ✦ LIVE EXPERIENCE ✦
          </VelocityRow>

          <VelocityRow
            baseVelocity={3}
            className="text-2xl md:text-4xl lg:text-5xl"
          >
            STADIUM ANTHEMS ✦ GLOBAL STAGES ✦
          </VelocityRow>

          <VelocityRow
            baseVelocity={-2.5}
            className="text-2xl md:text-4xl lg:text-5xl"
          >
            FEEL THE BASS ✦ UNFORGETTABLE NIGHTS ✦
          </VelocityRow>
        </div>
      </div>


      {/* ── Text reveal — bottom-left ── */}
      <div
        ref={textRef}
        className="absolute bottom-16 left-0 z-10 px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-2xl">

          {/* Heading */}
          <h2
            className="text-base md:text-lg font-sans font-bold uppercase mb-2"
            style={{ color: "var(--color-accent-lime)" }}
          >
            {HEADING_TEXT}
          </h2>

          {/* Paragraph — word-by-word scroll reveal */}
          <p
            className="text-base md:text-lg leading-relaxed font-sans"
            style={{ color: "var(--color-text-primary)" }}
            aria-label={PARAGRAPH_TEXT}
          >
            {paragraphWords.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <RevealWord
                  progress={scrollYProgress}
                  index={index}
                  count={paragraphWords.length}
                  reducedMotion={!!reducedMotion}
                >
                  {word}
                </RevealWord>
                {index < paragraphWords.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      </div>

      {/* 
        Spacer to extend the scroll area slightly.
      */}
      <div className="h-[35vh] w-full pointer-events-none"></div>
    </section>
  );
}

export default KonseraAbout;
