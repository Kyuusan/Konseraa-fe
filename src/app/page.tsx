"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { Preloader } from "@/components/ui/Preloader";

import { About } from "@/components/sections/about" ;

export default function Home() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <main className="min-h-screen bg-bg-base text-(--color-text-primary)">
      {!isPreloaderDone && <Preloader onComplete={() => setIsPreloaderDone(true)} />}
      <Hero startAnimation={isPreloaderDone} />
      <About />
    </main>
  );
}
