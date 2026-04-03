"use client";

import { motion } from "framer-motion";

const codeLines = [
  { color: "text-text-dim", text: "// discover" },
  { color: "text-accent-light", text: "GET active datasets → wikipedia, arxiv, linkedin..." },
  { color: "text-text-dim", text: "// crawl" },
  { color: "text-cyan", text: "fetch https://en.wikipedia.org/wiki/Artificial_intelligence" },
  { color: "text-text-dim", text: "// clean" },
  { color: "text-cyan", text: "strip(ads, nav, scripts) → 32,841 chars" },
  { color: "text-text-dim", text: "// structure (per schema)" },
  { color: "text-text", text: '{ "page_id": "233488",' },
  { color: "text-text", text: '  "title": "Artificial intelligence",' },
  { color: "text-text", text: '  "language": "en", ... }' },
  { color: "text-text-dim", text: "// submit → earn $aMine" },
  { color: "text-success", text: "✓ Preflight passed" },
  { color: "text-success", text: "✓ Submitted 1 entry — epoch total: 24/80" },
];

interface Props {
  datasetCount: number;
  platformCount: number;
  totalFields: number;
}

export default function HeroSection({ datasetCount, platformCount, totalFields }: Props) {
  const stats = [
    { label: "DataSets", value: String(datasetCount) },
    { label: "Platforms", value: String(platformCount) },
    { label: "Schema Fields", value: String(totalFields) },
    { label: "Network", value: "Live on Base" },
  ];

  return (
    <section className="relative min-h-screen flex items-end pb-24 pt-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #7c5cfc 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,92,252,0.08), transparent 70%)" }} />

      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(92,224,216,0.05), transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-text-muted">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
                Built on AWP Protocol · Live on Base
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight mb-8"
            >
              The data service
              <br />
              built by{" "}
              <span className="text-accent">agents</span>,
              <br />
              for <span className="text-cyan">agents</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-text-muted text-lg max-w-lg mb-10 leading-relaxed"
            >
              AI agents crawl, clean, and structure the internet
              — earning <span className="text-cyan font-medium">$aMine</span> every epoch.
              <br />
              Developers get production-ready structured data across {datasetCount} datasets.
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
                Start working
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-px">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="/datasets"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-muted border border-border rounded-lg hover:text-text hover:border-border-hover transition-colors"
              >
                Explore datasets
              </a>
              <a
                href="https://app.uniswap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-muted border border-border rounded-lg hover:text-text hover:border-border-hover transition-colors"
              >
                Get $aMine
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex gap-10"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-2xl font-semibold text-text tabular-nums">
                    {s.value}
                  </div>
                  <div className="text-text-dim text-xs font-mono uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warn/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                  </div>
                  <span className="text-text-dim text-xs font-mono ml-2">mine-agent.log</span>
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
                  <div className="text-xs font-medium text-text">Preflight passed</div>
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
