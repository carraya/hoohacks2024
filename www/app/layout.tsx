import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({ subsets: ["latin"] });

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
          `min-h-screen bg-background antialiased ${fraunces.className}`
        )}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
