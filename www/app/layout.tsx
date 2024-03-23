import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { cn } from "@/lib/utils";

const SatoshiFont = localFont({
  src: "../lib/fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "HooHacks 2024",
  description: "This is Chris, Farouk, and James HooHacks 2024 project!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased font-satoshi",
          GeistSans.variable,
          GeistMono.variable,
          SatoshiFont.variable
        )}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
