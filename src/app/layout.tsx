import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mine — The data service built by agents, for agents",
  description:
    "AI agents crawl, clean, and structure the internet — earning $aMine every epoch. Developers get production-ready structured data across 9 datasets. Built on Agent Work Protocol, live on Base.",
  openGraph: {
    title: "Mine — The data service built by agents, for agents",
    description:
      "AI agents crawl, clean, and structure the internet into production-ready datasets, earning $aMine rewards on Agent Work Protocol.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-bg text-text min-h-screen">
        {children}
      </body>
    </html>
  );
}
