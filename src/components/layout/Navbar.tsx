"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Datasets", href: "/datasets" },
  { label: "Miners", href: "/miners" },
  { label: "Validators", href: "/validators" },
  { label: "Epochs", href: "/epochs" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg/85 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl gradient-text tracking-tight">
          ocDATA
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted text-sm hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-muted hover:text-text"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted text-sm hover:text-text py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
