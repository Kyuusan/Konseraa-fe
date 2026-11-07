/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useEffect, useState } from 'react';
import PixelSwap from '../ui/pixelSwapImage';
import ScrollExpand from '../ui/scrollExpand';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const sequenceRefs = useRef<(HTMLImageElement | null)[]>([]);

  const sequenceImages = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop", // Band performing
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop", // Stage lights
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop", // Party people
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trigger PixelSwap
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 60%", // Triggers when top of the section is 40% from bottom
        onEnter: () => setIsActive(true),
      });

      // Animate Image Sequence while scrolling the container
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const total = sequenceImages.length;
          const activeIndex = Math.min(total - 1, Math.floor(p * total));
          sequenceRefs.current.forEach((img, i) => {
            if (img) img.style.opacity = i === activeIndex ? '1' : '0';
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [sequenceImages.length]);

  return (
    <section id="stage" ref={containerRef} className="relative z-20 w-full py-16 bg-bg-base">
        {/* The Scroll Expand Container */}
        <div className="w-full relative">
          <ScrollExpand 
            title="FEEL THE ENERGY" 
            scrollHint="Scroll down to expand"
            startWidth={40}
            startHeight={50}
            startRadius={24}
            endWidth={95}
            endHeight={85}
            endRadius={32}
            mediaZoom={1.35}
            scrollDistance={1.2}
            holdDistance={0.35}
            smoothing={0.4}
            overlayScrim={0.45}
            enabled
            useWindowScroll={true}
            mediaComponent={
              <PixelSwap
                active={isActive}
                firstContent={
                  <div className="w-full h-full bg-[#111] flex items-center justify-center">
                    <span className="text-text-primary font-bold uppercase tracking-widest text-sm">Preparing Stage...</span>
                  </div>
                }
                secondContent={
                  <div className="w-full h-full relative bg-[#222] overflow-hidden">
                    {sequenceImages.map((src, index) => (
                      <img
                        key={index}
                        ref={(el) => {
                          sequenceRefs.current[index] = el;
                        }}
                        src={src}
                        alt={`Concert ${index}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: index === 0 ? 1 : 0 }}
                        draggable={false}
                      />
                    ))}
                  </div>
                }
                pixelSize={64}
                gap={0}
                pixelRadius={0}
                pixelSpin={0}
                pixelScale={0.35}
                duration={1400}
                pixelDuration={450}
                pattern="random"
                randomness={0}
                fade
                className="w-full h-full"
              />
            }
          >
            <div className="text-white text-center z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-3xl md:text-8xl font-heading font-black uppercase tracking-wide mb-4 text-white">
                UNFORGETTABLE NIGHTS
              </h3>
             
            </div>
          </ScrollExpand>
        </div>
    </section>
  );
};

export default About;