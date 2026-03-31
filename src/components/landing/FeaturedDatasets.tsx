"use client";

import { motion } from "framer-motion";

const datasets = [
  { id: "ds_x_posts", name: "X Posts", domain: "x.com", entries: 120345, miners: 45, fields: 9 },
  { id: "ds_amazon", name: "Amazon Products", domain: "amazon.com", entries: 82100, miners: 32, fields: 9 },
  { id: "ds_wiki", name: "Wikipedia", domain: "wikipedia.org", entries: 96800, miners: 38, fields: 6 },
  { id: "ds_arxiv", name: "arXiv Papers", domain: "arxiv.org", entries: 54200, miners: 28, fields: 8 },
  { id: "ds_linkedin", name: "LinkedIn Profiles", domain: "linkedin.com", entries: 31400, miners: 18, fields: 11 },
  { id: "ds_news", name: "News Articles", domain: "reuters.com", entries: 28700, miners: 22, fields: 7 },
];

const maxEntries = Math.max(...datasets.map((d) => d.entries));

export default function FeaturedDatasets() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 tracking-tight">Active DataSets</h2>
        <p className="text-text-muted max-w-lg">
          Each DataSet defines a schema for a category of structured data. Miners choose which to contribute to.
        </p>
      </motion.div>

      {/* Table-style layout — not cards */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-mono uppercase tracking-wider text-text-dim border-b border-border bg-bg-surface">
          <div className="col-span-4 sm:col-span-3">Name</div>
          <div className="col-span-3 sm:col-span-2">Domain</div>
          <div className="col-span-3 hidden sm:block">Entries</div>
          <div className="col-span-2 hidden md:block">Miners</div>
          <div className="col-span-5 sm:col-span-2 text-right">Fields</div>
        </div>

        {/* Rows */}
        {datasets.map((ds, i) => (
          <motion.div
            key={ds.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border-subtle last:border-b-0 hover:bg-bg-surface transition-colors cursor-pointer group"
          >
            <div className="col-span-4 sm:col-span-3 font-medium text-sm group-hover:text-accent transition-colors">
              {ds.name}
            </div>
            <div className="col-span-3 sm:col-span-2 font-mono text-xs text-text-muted">
              {ds.domain}
            </div>
            <div className="col-span-3 hidden sm:flex items-center gap-3">
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(ds.entries / maxEntries) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-accent/40"
                />
              </div>
              <span className="font-mono text-xs text-text-muted tabular-nums w-16 text-right">
                {(ds.entries / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="col-span-2 hidden md:block font-mono text-xs text-text-muted tabular-nums">
              {ds.miners}
            </div>
            <div className="col-span-5 sm:col-span-2 font-mono text-xs text-text-dim text-right tabular-nums">
              {ds.fields}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-right">
        <a href="/datasets" className="text-sm text-text-muted hover:text-text transition-colors font-mono">
          View all datasets →
        </a>
      </div>
    </section>
  );
}
