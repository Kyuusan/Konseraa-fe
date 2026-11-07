"use client";

import React, { useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/ui/buttonAnimate";

interface HeroProps {
  startAnimation?: boolean;
}

export const Hero = ({ startAnimation = true }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ambient glow animation (always running)
      gsap.to(".ambient-glow", {
        x: "random(-50, 50)",
        y: "random(-50, 50)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Entrance animations (only when startAnimation is true)
      if (startAnimation) {
        gsap.fromTo(".hero-text", 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.2
          }
        );
        
        gsap.fromTo(".hero-sub", 
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [startAnimation]);

  return (
    <section id="home" ref={containerRef} className="relative z-20 min-h-screen flex flex-col justify-center pt-32 pb-0 overflow-hidden bg-bg-base">
      
      {/* Ambient Glows */}
      <div className="ambient-glow absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-(--glow-pink) blur-[80px] -z-10 opacity-30 mix-blend-screen pointer-events-none"></div>
      <div className="ambient-glow absolute bottom-[30%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-(--glow-lime) blur-[100px] -z-10 opacity-30 mix-blend-screen pointer-events-none"></div>

      {/* Top Content mimicking the image layout */}
      <div className="w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 md:mt-0 hero-sub opacity-0">
        <div className="md:col-start-8 md:col-span-4 flex flex-col gap-2">
          <p className="text-(--color-text-muted) text-xs font-semibold tracking-widest uppercase">
            Global Concert Ticketing
          </p>
          <p className="text-(--color-text-primary) text-sm md:text-base max-w-sm uppercase leading-relaxed font-medium">
            From sold-out world stadium tours to intimate local gigs. Experience every live moment under the lights.
          </p>
        </div>
      </div>

      {/* Giant Typography mimicking the image layout */}
      <div className="w-full px-6 md:px-12 flex flex-col justify-center mt-16 md:mt-24 pb-20">
        <h1 className="font-heading leading-[0.9] tracking-tight flex flex-col">
          <div className="hero-text text-[16vw] md:text-[12vw] font-bold text-(--color-text-primary) opacity-0 w-fit">
            Witness
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
            <div className="hero-text text-[14vw] md:text-[10vw] font-light text-(--color-text-muted) italic ml-[8vw] md:ml-[15vw] opacity-0 w-fit">
              Global
            </div>
            <div className="hero-text text-[14vw] md:text-[12vw] font-bold text-transparent bg-clip-text bg-linear-to-r from-(--color-accent-pink) to-(--color-accent-lime) ml-[12vw] md:ml-0 opacity-0 w-fit pb-[0.2em] mb-[-0.2em]">
              Stages
            </div>
          </div>
        </h1>
        
        {/* Buttons from design.md */}
        <div className="hero-text flex flex-row gap-2 md:gap-4 mt-8 md:mt-16 ml-[5vw] md:ml-[25vw] mr-[5vw] md:mr-0 opacity-0">
          <Button
            variant="default"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            Find Tickets
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            View Line-up
          </Button>
        </div>
      </div>

    </section>
  );
};

export default Hero;
