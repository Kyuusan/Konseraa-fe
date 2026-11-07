/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

const SECTION_HEIGHT = 1500;

const SCHEDULE_ITEMS = [
  {
    title: "The Weeknd · After Hours Til Dawn",
    date: "Nov 14th",
    location: "Los Angeles",
  },
  {
    title: "Coldplay · Music of the Spheres",
    date: "Nov 22nd",
    location: "London",
  },
  {
    title: "Travis Scott · Circus Maximus",
    date: "Dec 5th",
    location: "Milan",
  },
  {
    title: "Billie Eilish · Hit Me Hard and Soft",
    date: "Dec 18th",
    location: "Tokyo",
  },
  {
    title: "Ariana Grande · Eternal Sunshine Live",
    date: "Jan 9th",
    location: "London",
  },
  {
    title: "Kanye West · Vultures Arena Experience",
    date: "Jan 24th",
    location: "Seoul",
  },
  {
    title: "Bruno Mars · 24K Magic World Live",
    date: "Feb 12th",
    location: "Singapore",
  },
];

export const SmoothScrollHero = () => {
  return (
    <section id="why-us" className="relative z-20 bg-bg-base text-(--color-text-primary)">
      <Hero />
    </section>
  );
};

export const GalleryWhy = SmoothScrollHero;

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full bg-bg-base"
    >
      <CenterImage containerRef={containerRef} />

      <ParallaxImages />

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-96 bg-linear-to-b from-bg-base/0 to-bg-base" />
    </div>
  );
};

const CenterImage = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const clip1 = useTransform(scrollYProgress, [0, 0.72], [25, 0]);
  const clip2 = useTransform(scrollYProgress, [0, 0.72], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollYProgress,
    [0, 1],
    ["170%", "100%"],
  );
  const opacity = useTransform(scrollYProgress, [0.72, 1], [1, 0]);

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath: reducedMotion ? undefined : clipPath,
        backgroundSize: reducedMotion ? "cover" : backgroundSize,
        opacity,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

const ParallaxImages = () => {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop"
        alt="Stage laser lights over concert crowd"
        start={-200}
        end={200}
        className="w-1/3 rounded-2xl border border-(--color-border) shadow-2xl"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1400&auto=format&fit=crop"
        alt="Mainstage stadium pyrotechnics"
        start={200}
        end={-250}
        className="mx-auto w-2/3 rounded-2xl border border-(--color-border) shadow-2xl"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop"
        alt="Front row live concert experience"
        start={-200}
        end={200}
        className="ml-auto w-1/3 rounded-2xl border border-(--color-border) shadow-2xl"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop"
        alt="Arena spotlight performance"
        start={0}
        end={-500}
        className="ml-24 w-5/12 rounded-2xl border border-(--color-border) shadow-2xl"
      />
    </div>
  );
};

interface ParallaxImgProps {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}

const ParallaxImg = ({ className, alt, src, start, end }: ParallaxImgProps) => {
  const ref = useRef<HTMLImageElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};



export default SmoothScrollHero;