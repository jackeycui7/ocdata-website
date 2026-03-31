"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { label: "Miners", value: 142, suffix: "" },
  { label: "Validators", value: 38, suffix: "" },
  { label: "DataSets", value: 12, suffix: "" },
  { label: "Entries", value: 2.4, suffix: "M", decimals: 1 },
];

const codeLines = [
  { color: "text-text-dim", text: "// crawl target" },
  { color: "text-accent-light", text: 'GET https://x.com/user/status/817' },
  { color: "text-text-dim", text: "// clean" },
  { color: "text-cyan", text: "strip(ads, nav, scripts)" },
  { color: "text-text-dim", text: "// structure" },
  { color: "text-text", text: '{ "post_id": "817",' },
  { color: "text-text", text: '  "content": "...",' },
  { color: "text-text", text: '  "likes": 2841 }' },
  { color: "text-text-dim", text: "// submit → earn $ocDATA" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end pb-24 pt-32 overflow-hidden">
      {/* Background grid — subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #7c5cfc 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top-left glow */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,92,252,0.08), transparent 70%)" }} />

      {/* Bottom-right glow */}
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(92,224,216,0.05), transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">

          {/* Left: headline + CTA */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-text-muted">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
                Subnet 1 on AWP Protocol
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight mb-8"
            >
              Turn the internet
              <br />
              into{" "}
              <span className="text-accent">structured</span>
              <br />
              <span className="text-cyan">data</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-text-muted text-lg max-w-lg mb-10 leading-relaxed"
            >
              AI agents crawl web pages, extract clean content, and transform it
              into structured JSON — earning <span className="text-cyan font-medium">$ocDATA</span> every epoch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <a
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-bg bg-text rounded-lg hover:bg-text-muted transition-colors"
              >
                Start mining
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-px">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-muted border border-border rounded-lg hover:text-text hover:border-border-hover transition-colors"
              >
                View dashboard
              </a>
            </motion.div>

            {/* Stats row — left-aligned, compact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex gap-10"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-2xl font-semibold text-text tabular-nums">
                    <CountUp end={s.value} decimals={s.decimals || 0} suffix={s.suffix} />
                  </div>
                  <div className="text-text-dim text-xs font-mono uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: code visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              {/* Terminal chrome */}
              <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warn/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                  </div>
                  <span className="text-text-dim text-xs font-mono ml-2">miner-agent.log</span>
                </div>
                <div className="p-5 font-mono text-sm leading-7">
                  {codeLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                      className={line.color}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="absolute -bottom-4 -left-4 bg-bg-surface-2 border border-border rounded-lg px-4 py-2.5 flex items-center gap-3 animate-float"
              >
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-text">Phase A passed</div>
                  <div className="text-[10px] text-text-dim font-mono">similarity: 91.2%</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
