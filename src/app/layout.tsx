import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: "WasteWise — Turning Trash into Treasures",
  description:
    "A circular economy platform empowering local communities through intelligent waste management, IoT-powered composting, and community rewards. Powered by BUMDes.",
  keywords: [
    "waste management",
    "circular economy",
    "BUMDes",
    "composting",
    "IoT",
    "smart village",
    "organic fertilizer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
