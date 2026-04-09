"use client";

import { motion } from "framer-motion";

const roles = [
  {
    title: "Miners",
    share: "41",
    color: "#5ce0d8",
    desc: "Crawl, clean, and structure web data. No staking required. Rewards scale with (quality score)² × volume.",
    cta: { label: "Start working →", href: "/docs" },
  },
  {
    title: "Validators",
    share: "41",
    color: "#7c5cfc",
    desc: "Evaluate data quality and verify authenticity. Stake ≥ 1,000 AWP on RootNet to participate.",
    cta: { label: "Learn more →", href: "/docs" },
  },
  {
    title: "WorkNet Owner",
    share: "18",
    color: "#f59e0b",
    desc: "Operate the network, maintain Golden Task library, curate DataSets.",
    cta: null,
  },
];

export default function ProtocolOverview() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Emission split</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 tracking-tight">
          Three roles. One economy.
        </h2>
        <p className="text-text-muted max-w-lg mb-14">
          Each epoch mints $aMine and distributes it across the network.
          Your share depends on your work quality — exponentially.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-bg-surface p-8 flex flex-col"
          >
            <div className="flex items-end gap-3 mb-6">
              <span className="font-mono text-5xl font-bold leading-none" style={{ color: role.color }}>
                {role.share}
              </span>
              <span className="text-text-dim font-mono text-lg mb-1">%</span>
            </div>

            <div className="w-full h-1 bg-border rounded-full mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${role.share}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: role.color }}
              />
            </div>

            <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{role.desc}</p>

            {role.cta && (
              <div className="pt-4 border-t border-border">
                <a href={role.cta.href} className="text-xs font-mono text-text-dim hover:text-text transition-colors">
                  {role.cta.label}
                </a>
              </div>
            )}
            {!role.cta && (
              <div className="pt-4 border-t border-border">
                <span className="text-xs font-mono text-text-dim">WorkNet operator</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
