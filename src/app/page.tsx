"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Hero } from "@/components/sections/Hero";
import { Preloader } from "@/components/ui/Preloader";

import { About } from "@/components/sections/about";
import { KonseraAbout } from "@/components/sections/konseraAbout";
import { ColorList } from "@/components/sections/concer";
import { WhyUs } from "@/components/sections/whyUS";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      {/* The landing navbar belongs to this page only, not to the root layout. */}
      <Navbar />
      {!isPreloaderDone && <Preloader onComplete={() => setIsPreloaderDone(true)} />}
      <div className="relative z-20 bg-bg-base">
        <Hero startAnimation={isPreloaderDone} />
        <About />
        <KonseraAbout />
        <ColorList />
        <WhyUs />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}
