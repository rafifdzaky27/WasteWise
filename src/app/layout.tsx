import type { Metadata, Viewport } from "next";
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
  title: "WasteWise — Mengubah Sampah Menjadi Berkah",
  description:
    "Platform ekonomi sirkular berbasis IoT untuk memberdayakan masyarakat desa melalui pengelolaan sampah cerdas, pengomposan terpantau, dan sistem reward komunitas. Didukung oleh BUMDes.",
  keywords: [
    "pengelolaan sampah",
    "ekonomi sirkular",
    "BUMDes",
    "pengomposan",
    "IoT",
    "desa cerdas",
    "pupuk organik",
    "WasteWise",
  ],
  openGraph: {
    title: "WasteWise — Mengubah Sampah Menjadi Berkah",
    description:
      "Platform ekonomi sirkular berbasis IoT untuk memberdayakan masyarakat desa melalui pengelolaan sampah cerdas.",
    url: "https://waste-wise-rosy.vercel.app",
    siteName: "WasteWise",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#016630",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
