"use client";

import { Camera, CameraOff } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/animate-ui/components/buttons/button";

type CameraState = "idle" | "starting" | "running" | "error";

/** The same code read again within this window is the same scan, not a second one. */
const REPEAT_MS = 3000;

interface QrScannerProps {
  onScan: (text: string) => void;
  disabled?: boolean;
}

// Camera QR reader on html5-qrcode (rules §2). The library is loaded on demand,
// because it touches `window` and is only needed on this screen.
export function QrScanner({ onScan, disabled }: QrScannerProps) {
  const regionId = `qr-region-${useId().replaceAll(":", "")}`;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef({ text: "", at: 0 });
  const onScanRef = useRef(onScan);
  const [state, setState] = useState<CameraState>("idle");
  const [error, setError] = useState<string>();

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(
    () => () => {
      const scanner = scannerRef.current;
      if (scanner?.isScanning) void scanner.stop().then(() => scanner.clear());
    },
    [],
  );

  async function start() {
    setState("starting");
    setError(undefined);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = scannerRef.current ?? new Html5Qrcode(regionId, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, aspectRatio: 1 },
        (text) => {
          const now = Date.now();
          if (text === lastScanRef.current.text && now - lastScanRef.current.at < REPEAT_MS) return;
          lastScanRef.current = { text, at: now };
          onScanRef.current(text);
        },
        () => {},
      );
      setState("running");
    } catch {
      setState("error");
      setError(
        window.isSecureContext
          ? "The camera could not start. Allow camera access in the browser settings, or type the code below."
          : "The camera only works over HTTPS. Open the gate page over HTTPS, or type the code below.",
      );
    }
  }

  async function stop() {
    const scanner = scannerRef.current;
    if (scanner?.isScanning) {
      await scanner.stop();
      scanner.clear();
    }
    setState("idle");
  }

  const running = state === "running";

  return (
    <div className="space-y-3">
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[20px] bg-bg-surface-2">
        <div id={regionId} className="size-full [&_video]:size-full! [&_video]:object-cover" />

        {/* Target frame */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-[15%]">
          <span className="absolute top-0 left-0 size-10 rounded-tl-2xl border-t-4 border-l-4 border-accent-lime" />
          <span className="absolute top-0 right-0 size-10 rounded-tr-2xl border-t-4 border-r-4 border-accent-lime" />
          <span className="absolute bottom-0 left-0 size-10 rounded-bl-2xl border-b-4 border-l-4 border-accent-lime" />
          <span className="absolute right-0 bottom-0 size-10 rounded-br-2xl border-r-4 border-b-4 border-accent-lime" />
        </div>

        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-text-primary/80">
              {state === "starting" ? "Starting the camera…" : "Point the camera at the QR code on the e-ticket."}
            </p>
            <Button
              hoverScale={1.02}
              onClick={start}
              disabled={disabled || state === "starting"}
              className="h-11 rounded-full px-5 font-semibold"
            >
              <Camera aria-hidden="true" />
              Start camera
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mx-auto max-w-md text-sm text-danger">
          {error}
        </p>
      )}
      {running && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" hoverScale={1} onClick={stop} className="rounded-full">
            <CameraOff aria-hidden="true" />
            Stop camera
          </Button>
        </div>
      )}
    </div>
  );
}
