import "./globals.css";
import type { Viewport } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { metadata as appMetadata } from "./metadata";
import Shell from "@/components/Shell";

const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter", display: "swap" });

const serif = localFont({
  src: "../../public/fonts/LibreCaslonCondensed-400.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-serif",
  display: "swap",
});

export const metadata = appMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#faf9f7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`h-full ${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <body className="relative h-full w-full bg-bg text-stone-900 antialiased font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
