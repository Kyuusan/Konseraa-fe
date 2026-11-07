"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

// WebGL can't read CSS variables, so these mirror the tokens in globals.css.
const SHADER_BASE = "#0B0B0E";
const SHADER_PINK = "#FF3DA6";
const SHADER_LIME = "#C6FF3D";

export function AuthShell({
  panelLine,
  panelHighlight,
  children,
}: {
  panelLine: string;
  panelHighlight: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-bg-base p-3 text-text-primary">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-3 lg:grid-cols-[0.94fr_1.06fr] lg:gap-6">
        <div className="flex items-start rounded-[20px] border border-border bg-bg-surface px-6 py-10 sm:px-10 lg:items-center lg:px-14 lg:py-16 xl:px-20">
          <div className="mx-auto w-full max-w-[520px]">
            <Link
              href="/"
              className="inline-block rounded-sm font-logo text-lg uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
            >
              Konsera
            </Link>
            {children}
          </div>
        </div>

        <div className="relative flex min-h-[320px] overflow-hidden rounded-[20px] bg-bg-surface p-8 sm:p-12 lg:min-h-0">
          <GrainGradient
            speed={reduceMotion ? 0 : 0.6}
            scale={1}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={[SHADER_PINK, SHADER_LIME, SHADER_PINK]}
            colorBack={SHADER_BASE}
            className="absolute inset-0"
          />
          {/* Darkens the bright lime and pink so the light text stays readable. */}
          <div className="absolute inset-0 bg-bg-base/60" aria-hidden="true" />

          <div className="relative z-10 flex w-full flex-col justify-between gap-10">
            <p className="max-w-[620px] font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              {panelLine}
              <br />
              {panelHighlight}
            </p>
            <Link
              href="/"
              className="inline-flex h-12 w-fit items-center rounded-full border border-text-primary/40 bg-bg-base/70 px-6 text-base font-medium outline-none transition-colors hover:border-text-primary focus-visible:ring-2 focus-visible:ring-accent-pink"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
