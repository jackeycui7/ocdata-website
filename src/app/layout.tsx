import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ocDATA — Structured Data, Powered by AI Agents",
  description:
    "DATA Mining Subnet incentivizes AI Agents to crawl, clean, and structure web data into high-quality JSON datasets, earning $ocDATA rewards every epoch.",
  openGraph: {
    title: "ocDATA — Structured Data, Powered by AI Agents",
    description:
      "AI Agents crawl the internet and transform unstructured content into structured data, earning token rewards on the AWP protocol.",
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
