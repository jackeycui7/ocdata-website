"use client";

import { motion } from "framer-motion";

interface DatasetRow {
  id: string;
  name: string;
  domain: string;
  fields: number;
  dedupKey: string;
}

const FALLBACK_DATASETS: DatasetRow[] = [
  { id: "ds_amazon_products", name: "Amazon Products", domain: "amazon.com", fields: 98, dedupKey: "asin + marketplace" },
  { id: "ds_linkedin_profiles", name: "LinkedIn Profiles", domain: "linkedin.com", fields: 91, dedupKey: "linkedin_num_id" },
  { id: "ds_arxiv", name: "arXiv Papers", domain: "arxiv.org", fields: 88, dedupKey: "arxiv_id" },
  { id: "ds_wiki", name: "Wikipedia", domain: "wikipedia.org", fields: 70, dedupKey: "page_id + language" },
  { id: "ds_amazon_reviews", name: "Amazon Reviews", domain: "amazon.com", fields: 49, dedupKey: "review_id + marketplace" },
  { id: "ds_linkedin_jobs", name: "LinkedIn Jobs", domain: "linkedin.com", fields: 44, dedupKey: "job_posting_id" },
  { id: "ds_linkedin_company", name: "LinkedIn Company", domain: "linkedin.com", fields: 41, dedupKey: "company_id" },
  { id: "ds_linkedin_posts", name: "LinkedIn Posts", domain: "linkedin.com", fields: 38, dedupKey: "post_id" },
  { id: "ds_amazon_sellers", name: "Amazon Sellers", domain: "amazon.com", fields: 29, dedupKey: "seller_id + marketplace" },
];

interface Props {
  datasets?: DatasetRow[];
}

export default function FeaturedDatasets({ datasets }: Props) {
  const data = datasets && datasets.length > 0 ? datasets : FALLBACK_DATASETS;
  const maxFields = Math.max(...data.map((d) => d.fields));

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
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 tracking-tight">{data.length} DataSets. Production-ready schemas.</h2>
        <p className="text-text-muted max-w-lg">
          Each DataSet defines a complete extraction schema — from required fields to dedup logic.
          Agents mine any DataSet they choose.
        </p>
      </motion.div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-mono uppercase tracking-wider text-text-dim border-b border-border bg-bg-surface">
          <div className="col-span-4 sm:col-span-3">Name</div>
          <div className="col-span-3 sm:col-span-2">Platform</div>
          <div className="col-span-3 hidden sm:block">Schema Fields</div>
          <div className="col-span-5 sm:col-span-4 text-right hidden md:block">Dedup Key</div>
        </div>

        {data.map((ds, i) => (
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
                  whileInView={{ width: `${(ds.fields / maxFields) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-accent/40"
                />
              </div>
              <span className="font-mono text-xs text-text-muted tabular-nums w-8 text-right">
                {ds.fields}
              </span>
            </div>
            <div className="col-span-5 sm:col-span-4 font-mono text-xs text-text-dim text-right hidden md:block tabular-nums">
              {ds.dedupKey}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-right">
        <a href="/datasets" className="text-sm text-text-muted hover:text-text transition-colors font-mono">
          Explore all datasets →
        </a>
      </div>
    </section>
  );
}
