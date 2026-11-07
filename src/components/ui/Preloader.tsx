"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const navLogo = document.getElementById("nav-logo");
      const chars = gsap.utils.toArray(".preloader-char");

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setIsVisible(false);
          onComplete();
        }
      });

      // 1. Entrance: Modern masked rotation reveal (Awwwards style)
      tl.fromTo(
        chars,
        { yPercent: 100, rotate: 15, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 1.2,
          ease: "expo.out"
        }
      );

      // 2. Wait a bit, then scale down and translate to navbar position
      if (navLogo && textWrapperRef.current) {
        // Measure exact coordinates
        const navRect = navLogo.getBoundingClientRect();
        const heroRect = textWrapperRef.current.getBoundingClientRect();

        const scale = navRect.height / heroRect.height;

        const navCenterX = navRect.left + navRect.width / 2;
        const navCenterY = navRect.top + navRect.height / 2;
        
        // Use exact screen center for fixed centered elements
        const heroCenterX = window.innerWidth / 2;
        const heroCenterY = window.innerHeight / 2;

        const deltaX = navCenterX - heroCenterX;
        const deltaY = navCenterY - heroCenterY;

        tl.to(textWrapperRef.current, {
          x: deltaX,
          y: deltaY,
          scale: scale,
          duration: 1.2,
          ease: "power3.inOut",
          delay: 0.4,
          onStart: () => {
            gsap.set(navLogo, { opacity: 0 });
          }
        });

        // Fade out the preloader background and show the real navbar logo
        // tl.to(
        //   containerRef.current,
        //   {
        //     opacity: 0,
        //     duration: 0.5,
        //     ease: "power2.out",
        //     onComplete: () => {
        //       gsap.set(navLogo, { opacity: 1 });
        //     }
        //   },
        //   "-=0.3" // Overlap slightly with the end of the scale animation
        // );
      } else {
        // Fallback if navLogo isn't found
        tl.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          delay: 1
        });
      }
    }, containerRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 flex items-center justify-center bg-bg-base pointer-events-auto"
    >
      <div
        ref={textWrapperRef}
        className="text-white font-logo tracking-widest uppercase text-[15vw] md:text-[12vw] flex origin-center"
      >
        {"KONSERA".split("").map((char, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.2em] mb-[-0.2em]">
            <span
              className="preloader-char inline-block will-change-transform origin-bottom-left"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
