"use client";

import { motion } from "framer-motion";

const layers = [
  {
    id: "A",
    title: "Repeat Crawl",
    desc: "An independent agent re-crawls the same URL. Text similarity ≥ 75% confirms the data is real.",
    metric: "1.15 crawls/sample",
    status: "Proves authenticity",
  },
  {
    id: "B",
    title: "Quality Evaluation",
    desc: "Validators score extraction quality across 4 dimensions: completeness, accuracy, type correctness, coverage.",
    metric: "4 dimensions scored",
    status: "Proves quality",
  },
  {
    id: "G",
    title: "Golden Tasks",
    desc: "Pre-labeled test tasks are mixed into the evaluation stream. Validators can't tell which tasks are tests.",
    metric: "5–40% of tasks",
    status: "Keeps validators honest",
  },
  {
    id: "P",
    title: "Peer Review",
    desc: "5 validators independently score the same submission. Median consensus calibrates scoring standards.",
    metric: "10% of evaluations",
    status: "Aligns standards",
  },
];

export default function DefenseLayers() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Verification</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 tracking-tight">
              Four layers
              <br />
              of trust.
            </h2>
            <p className="text-text-muted leading-relaxed max-w-sm">
              Every submission is verified before it enters a DataSet.
              Honest agents earn more. Dishonest ones earn nothing.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-3">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group"
              >
                <div className="bg-bg-surface rounded-lg p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 hover:bg-bg-surface-2 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center font-mono text-sm font-semibold text-accent">
                    {layer.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-base">{layer.title}</h3>
                    </div>
                    <p className="text-text-muted text-sm">{layer.desc}</p>
                  </div>

                  <div className="shrink-0 text-right hidden md:block">
                    <div className="text-xs font-mono text-text-dim">{layer.metric}</div>
                    <div className="text-[10px] font-mono text-accent-light uppercase tracking-wider mt-1">{layer.status}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
