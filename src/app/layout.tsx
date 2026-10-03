import "./globals.css";
import type { Viewport } from "next";
import localFont from "next/font/local";
import { metadata as appMetadata } from "./metadata";
import Shell from "@/components/Shell";

const aspekta = localFont({
  src: [
    { path: "../../public/fonts/Aspekta-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Aspekta-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Aspekta-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Aspekta-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-aspekta",
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
    <html lang="en" className={`h-full ${aspekta.variable}`} suppressHydrationWarning>
      <body className="h-full w-full bg-bg text-stone-900 antialiased font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
