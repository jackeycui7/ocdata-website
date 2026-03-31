"use client";

import { motion } from "framer-motion";

const layers = [
  {
    id: "A",
    title: "Repeat Crawl",
    phase: "Phase A",
    desc: "An independent miner re-crawls the same URL. Text similarity ≥ 75% confirms authenticity.",
    metric: "1.15 crawls/sample",
    status: "Authenticity",
  },
  {
    id: "B",
    title: "Quality Eval",
    phase: "Phase B",
    desc: "Validators score structured extraction quality against the verified cleaned data.",
    metric: "4 dimensions scored",
    status: "Quality",
  },
  {
    id: "G",
    title: "Golden Task",
    phase: "Layer 3",
    desc: "Pre-labeled test tasks mixed into the evaluation stream. Validators can't distinguish them.",
    metric: "5–40% of tasks",
    status: "Honesty",
  },
  {
    id: "P",
    title: "Peer Review",
    phase: "Layer 4",
    desc: "Five validators independently score the same task. Median consensus aligns standards.",
    metric: "10% of evaluations",
    status: "Calibration",
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
              of defense
            </h2>
            <p className="text-text-muted leading-relaxed max-w-sm">
              Every piece of data is verified before it enters the network.
              Cheating is expensive, honesty is rewarded.
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
                  {/* ID badge */}
                  <div className="shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center font-mono text-sm font-semibold text-accent">
                    {layer.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-base">{layer.title}</h3>
                      <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">{layer.phase}</span>
                    </div>
                    <p className="text-text-muted text-sm">{layer.desc}</p>
                  </div>

                  {/* Right meta */}
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
