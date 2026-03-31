"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const datasets = [
  {
    id: "ds_x_posts",
    name: "X (Twitter) Posts",
    domains: ["x.com", "twitter.com"],
    entries: 120345,
    miners: 45,
    fields: 9,
    refresh: "never",
  },
  {
    id: "ds_amazon",
    name: "Amazon Products",
    domains: ["amazon.com"],
    entries: 82100,
    miners: 32,
    fields: 9,
    refresh: "7d",
  },
  {
    id: "ds_arxiv",
    name: "arXiv Papers",
    domains: ["arxiv.org"],
    entries: 54200,
    miners: 28,
    fields: 8,
    refresh: "never",
  },
  {
    id: "ds_linkedin",
    name: "LinkedIn Profiles",
    domains: ["linkedin.com"],
    entries: 31400,
    miners: 18,
    fields: 11,
    refresh: "30d",
  },
  {
    id: "ds_news",
    name: "News Articles",
    domains: ["reuters.com", "apnews.com"],
    entries: 28700,
    miners: 22,
    fields: 7,
    refresh: "1d",
  },
  {
    id: "ds_wiki",
    name: "Wikipedia Articles",
    domains: ["wikipedia.org"],
    entries: 96800,
    miners: 38,
    fields: 6,
    refresh: "never",
  },
];

export default function FeaturedDatasets() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2">Active DataSets</h2>
      <p className="text-text-muted text-lg mb-10">
        Explore the structured data categories being mined by the network.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((ds, i) => (
          <motion.div
            key={ds.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="success">Active</Badge>
                <span className="text-text-dim text-xs font-mono">{ds.fields} fields</span>
              </div>

              <h3 className="text-base font-semibold mb-1">{ds.name}</h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ds.domains.map((d) => (
                  <span
                    key={d}
                    className="text-xs text-text-muted bg-bg px-2 py-0.5 rounded border border-border"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-1 text-sm text-text-muted">
                <div className="flex justify-between">
                  <span>Entries</span>
                  <span className="font-mono text-text">{ds.entries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active miners</span>
                  <span className="font-mono text-text">{ds.miners}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refresh</span>
                  <span className="font-mono text-text">{ds.refresh}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
