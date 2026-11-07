"use client";

import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // Scroll-linked parallax for ambient orbs and vertical script float (keeps horizontal axis dead-center)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yPinkOrb = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yLimeOrb = useTransform(scrollYProgress, [0, 1], [-60, 90]);
  const scriptParallaxY1 = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const scriptParallaxY2 = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <section
      id="encore"
      ref={sectionRef}
      aria-label="Closing Statement"
      className="relative z-20 flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-b-[2.5rem] border-b border-(--color-border) bg-bg-base py-28 text-(--color-text-primary) shadow-[0_32px_90px_rgba(0,0,0,0.9)] md:rounded-b-[3.5rem] md:py-36"
    >
      {/* ── Dual Ambient Stage Orbs ── */}
      <motion.div
        style={{
          y: reducedMotion ? 0 : yPinkOrb,
          background: "var(--glow-pink)",
        }}
        className="pointer-events-none absolute top-1/4 left-[10%] h-[420px] w-[420px] rounded-full opacity-45 blur-[110px] md:h-[540px] md:w-[540px]"
      />
      <motion.div
        style={{
          y: reducedMotion ? 0 : yLimeOrb,
          background: "var(--glow-lime)",
        }}
        className="pointer-events-none absolute right-[8%] bottom-1/4 h-[400px] w-[400px] rounded-full opacity-40 blur-[110px] md:h-[520px] md:w-[520px]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 text-center md:px-12">
        {/* ── Mixed Typography Statement (Centered Vertically & Horizontally with AOS) ── */}
        <div className="flex w-full flex-col items-center justify-center text-center">
          {/* Line 1: Regular Bold Display + Cursive Script */}
          <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 md:gap-x-7">
            <div className="overflow-hidden py-1">
              <motion.span
                initial={reducedMotion ? false : { y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block font-heading text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] text-(--color-text-primary) sm:text-7xl md:text-8xl lg:text-[7rem]"
              >
                Don&apos;t Miss
              </motion.span>
            </div>

            <motion.span
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, scale: 0.82, rotate: -8, y: 24, filter: "blur(8px)" }
              }
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: -3,
                y: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.9,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ y: reducedMotion ? 0 : scriptParallaxY1 }}
              className="inline-block font-signature text-6xl lowercase leading-none tracking-normal text-(--color-accent-pink) drop-shadow-[0_0_24px_rgba(255,61,166,0.35)] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
            >
              the magic of
            </motion.span>
          </div>

          {/* Line 2: Regular Display + Cursive Script + Bold Display */}
          <div className="mt-1 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:mt-2 md:gap-x-7">
            <div className="overflow-hidden py-1">
              <motion.span
                initial={reducedMotion ? false : { y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{
                  duration: 0.8,
                  delay: 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block font-heading text-5xl font-normal uppercase leading-[0.95] tracking-[-0.04em] text-(--color-text-muted) sm:text-7xl md:text-8xl lg:text-[7rem]"
              >
                Every
              </motion.span>
            </div>

            <motion.span
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, scale: 0.82, rotate: 6, y: 24, filter: "blur(8px)" }
              }
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: -2,
                y: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.95,
                delay: 0.26,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ y: reducedMotion ? 0 : scriptParallaxY2 }}
              className="inline-block px-2 font-signature text-6xl lowercase leading-none tracking-normal text-(--color-accent-lime) drop-shadow-[0_0_28px_rgba(198,255,61,0.32)] sm:text-8xl md:text-9xl lg:text-[8.5rem]"
            >
              unforgettable
            </motion.span>

            <div className="overflow-hidden py-1">
              <motion.span
                initial={reducedMotion ? false : { y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{
                  duration: 0.8,
                  delay: 0.34,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block font-heading text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] text-(--color-text-primary) sm:text-7xl md:text-8xl lg:text-[7rem]"
              >
                Encore.
              </motion.span>
            </div>
          </div>

          {/* Cursive Sign-off Note */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex w-full items-center justify-center gap-4"
          >
            <span className="h-px w-10 bg-linear-to-r from-transparent to-(--color-accent-pink)" />
            <span className="-rotate-2 font-signature text-3xl text-(--color-text-primary)/85 sm:text-4xl">
              See you under the stage lights
            </span>
            <span className="h-px w-10 bg-linear-to-r from-(--color-accent-lime) to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
