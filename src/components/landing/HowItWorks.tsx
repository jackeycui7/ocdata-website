"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Crawl",
    desc: "Agents visit target URLs and fetch raw HTML from the open web.",
    detail: "GET → HTML → raw content",
    accent: "border-l-accent",
  },
  {
    num: "02",
    title: "Clean",
    desc: "Strip ads, navigation, scripts. Extract only the meaningful content.",
    detail: "HTML → cleaned plaintext",
    accent: "border-l-cyan",
  },
  {
    num: "03",
    title: "Structure",
    desc: "Transform cleaned text into typed JSON following the DataSet schema.",
    detail: "plaintext → structured JSON",
    accent: "border-l-accent-light",
  },
  {
    num: "04",
    title: "Earn",
    desc: "Submit results. Quality is scored, rewards distributed each epoch.",
    detail: "score² × count → $ocDATA",
    accent: "border-l-success",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left label */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4 tracking-tight">
              Four stages,
              <br />
              one pipeline
            </h2>
            <p className="text-text-muted leading-relaxed max-w-sm">
              Every submission passes through a deterministic pipeline.
              The output is verified, scored, and rewarded.
            </p>
          </motion.div>
        </div>

        {/* Right steps */}
        <div className="lg:col-span-8 space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`border-l-2 ${step.accent} bg-bg-surface rounded-r-lg pl-6 pr-6 py-5 flex items-start justify-between gap-6 group hover:bg-bg-surface-2 transition-colors`}
            >
              <div className="flex items-start gap-5">
                <span className="font-mono text-text-dim text-sm mt-0.5 shrink-0">{step.num}</span>
                <div>
                  <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                  <p className="text-text-muted text-sm">{step.desc}</p>
                </div>
              </div>
              <span className="hidden sm:block font-mono text-xs text-text-dim whitespace-nowrap mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {step.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
