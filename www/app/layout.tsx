import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rabbithole",
  description: "Democratizing and structuring the world's data",
};

const SatoshiFont = localFont({
  src: "../lib/fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

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
          `min-h-screen bg-background antialiased font-satoshi`,
          SatoshiFont.variable
        )}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
