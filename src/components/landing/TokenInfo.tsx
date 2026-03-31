"use client";

import { motion } from "framer-motion";

const tokenData = [
  { label: "Price", value: "$0.0234", mono: true },
  { label: "24h Volume", value: "$128K", mono: true },
  { label: "Epoch Emission", value: "500,000", mono: true },
  { label: "Chain", value: "BSC", mono: false },
];

export default function TokenInfo() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border border-border rounded-lg overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: token identity */}
          <div className="lg:col-span-5 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Token</span>
            <h2 className="text-3xl font-bold mt-3 mb-3 tracking-tight">
              <span className="text-accent">$oc</span>DATA
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              ERC-20 on BNB Smart Chain. Minted by the SubnetContract each epoch
              and distributed to miners, validators, and the subnet owner.
            </p>
            <a
              href="https://pancakeswap.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Trade on PancakeSwap
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Right: stats grid */}
          <div className="lg:col-span-7 grid grid-cols-2 divide-x divide-y divide-border">
            {tokenData.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                className="p-6 lg:p-8"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">
                  {item.label}
                </div>
                <div className={`text-2xl font-semibold tabular-nums ${item.mono ? "font-mono" : ""}`}>
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
