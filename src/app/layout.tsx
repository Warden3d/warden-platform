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
    default: "WARDEN — Equipamiento de precisión para BattleTech",
  },
  description:
    "WARDEN desarrolla productos físicos para mejorar la experiencia de juego en BattleTech Classic, Alpha Strike y AeroTech. Funcionalidad, compatibilidad, robustez y claridad.",
  keywords: [
    "WARDEN",
    "BattleTech",
    "Alpha Strike",
    "AeroTech",
    "wargame",
    "equipamiento de precisión",
    "accesorios de mesa",
  ],
  openGraph: {
    type: "website",
    siteName: "WARDEN",
    title: "WARDEN — Equipamiento de precisión para BattleTech",
    description:
      "Productos físicos diseñados para mejorar tus sesiones de BattleTech Classic, Alpha Strike y AeroTech.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${techMono.variable} dark h-full`}
    >
      <body className="flex min-h-full flex-col bg-warden-carbon text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
