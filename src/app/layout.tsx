import type { Metadata } from "next";
import { Geist, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const techMono = Share_Tech_Mono({
  variable: "--font-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: "%s | WARDEN",
    default: "WARDEN — Precision Equipment",
  },
  description:
    "WARDEN develops physical products to enhance the BattleTech Classic, Alpha Strike, and AeroTech gaming experience. Functionality, compatibility, robustness, and clarity.",
  keywords: [
    "WARDEN",
    "BattleTech",
    "Alpha Strike",
    "AeroTech",
    "tabletop gaming",
    "precision equipment",
  ],
  openGraph: {
    type: "website",
    siteName: "WARDEN",
    title: "WARDEN — Precision Equipment for BattleTech",
    description:
      "Physical products designed to enhance your BattleTech Classic, Alpha Strike, and AeroTech sessions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${techMono.variable} dark h-full`}
    >
      <body className="flex min-h-full flex-col bg-warden-carbon text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
