import type { Metadata } from "next";
import { Geist, Share_Tech_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
    default: "WARDEN — Precision Equipment for BattleTech",
  },
  description:
    "WARDEN develops physical products to enhance the gaming experience in BattleTech Classic, Alpha Strike and AeroTech. Functionality, compatibility, robustness and clarity.",
  keywords: [
    "WARDEN",
    "BattleTech",
    "Alpha Strike",
    "AeroTech",
    "wargame",
    "precision equipment",
    "tabletop accessories",
  ],
  openGraph: {
    type: "website",
    siteName: "WARDEN",
    title: "WARDEN — Precision Equipment for BattleTech",
    description:
      "Physical products designed to enhance your BattleTech Classic, Alpha Strike and AeroTech sessions.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${techMono.variable} dark h-full`}
    >
      <body className="flex min-h-full flex-col bg-warden-carbon text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
