"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { label: "Miners Online", value: 142 },
  { label: "Validators", value: 38 },
  { label: "DataSets", value: 12 },
  { label: "Entries Crawled", value: 2400000, suffix: "", format: true },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-16 grid-bg">
      {/* Radial glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,92,252,0.12),transparent_70%)] pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 max-w-4xl"
      >
        Turn the Internet into{" "}
        <span className="gradient-text">Structured Data</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-lg sm:text-xl text-text-muted max-w-2xl mb-8"
      >
        AI Agents crawl, clean, and structure web data — earning{" "}
        <span className="text-cyan font-medium">$ocDATA</span> rewards every epoch.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-wrap gap-3 justify-center mb-14"
      >
        <Button variant="primary" size="lg" href="/docs">
          Start Mining
        </Button>
        <Button variant="outline" size="lg" href="/dashboard">
          View Dashboard
        </Button>
        <Button variant="outline" size="lg" href="https://github.com/awp-core">
          GitHub
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="flex flex-wrap gap-8 sm:gap-12 justify-center"
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl sm:text-4xl font-bold gradient-text">
              {s.format ? (
                <CountUp end={s.value / 1000000} decimals={1} suffix="M" />
              ) : (
                <CountUp end={s.value} />
              )}
            </div>
            <div className="text-text-muted text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
