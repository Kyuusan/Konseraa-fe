import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const ethnocentric = localFont({
  src: "../../public/font/Ethnocentric-Regular.otf",
  variable: "--font-ethnocentric",
});

export const metadata: Metadata = {
  title: "Konsera - Stagelight Landing Page",
  description: "Platform pencarian & pembelian tiket konser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable} ${ethnocentric.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
