import type { Metadata } from "next";
import { Allura, Manrope, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const allura = Allura({
  weight: "400",
  variable: "--font-signature",
  subsets: ["latin"],
});

const ethnocentric = localFont({
  src: "../../public/font/Ethnocentric-Regular.otf",
  variable: "--font-ethnocentric",
});

export const metadata: Metadata = {
  title: "Konsera - Stagelight Landing Page",
  description: "Global concert discovery and ticketing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable} ${ethnocentric.variable} ${allura.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
