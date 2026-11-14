import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GeckoMod",
  description: "Custom crypto trading terminal build on top of CoinGecko API using Nextjs",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
