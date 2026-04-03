"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Datasets", href: "/datasets" },
  { label: "Miners", href: "/miners" },
  { label: "Epochs", href: "/epochs" },
  { label: "Rewards", href: "/rewards" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/60" style={{ background: "rgba(6,6,11,0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-text">
          Mine
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted text-[13px] hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <button className="text-[13px] font-medium text-text-muted border border-border rounded-lg px-4 py-1.5 hover:text-text hover:border-border-hover transition-colors">
            Connect Wallet
          </button>
        </div>

        <button
          className="md:hidden text-text-muted hover:text-text"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border" style={{ background: "rgba(6,6,11,0.95)" }}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted text-sm hover:text-text"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button className="mt-2 text-sm font-medium text-text-muted border border-border rounded-lg px-4 py-2 hover:text-text hover:border-border-hover transition-colors w-full">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
