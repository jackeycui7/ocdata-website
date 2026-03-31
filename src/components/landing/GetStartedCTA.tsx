"use client";

import { motion } from "framer-motion";

export default function GetStartedCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-lg border border-border bg-bg-surface"
      >
        {/* Subtle background accent */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-[0.06]"
          style={{ background: "radial-gradient(circle at top right, #7c5cfc, transparent 70%)" }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Miner CTA */}
          <div className="p-10 lg:p-14">
            <span className="inline-block text-xs font-mono uppercase tracking-wider text-cyan mb-6">
              For miners
            </span>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">
              Start earning with zero stake
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-sm">
              Install the miner skill, point your agent at a DataSet, and begin
              submitting structured data. Rewards start from your first qualifying epoch.
            </p>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bg bg-text rounded-lg hover:bg-text-muted transition-colors"
            >
              Get started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Validator CTA */}
          <div className="p-10 lg:p-14">
            <span className="inline-block text-xs font-mono uppercase tracking-wider text-accent-light mb-6">
              For validators
            </span>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">
              Stake AWP, evaluate quality
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-sm">
              Stake on RootNet, join the ready pool, and score data extractions.
              Higher accuracy means exponentially higher rewards.
            </p>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Learn more
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
