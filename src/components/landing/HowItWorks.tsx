"use client";

import { motion } from "framer-motion";
import { Globe, FileJson, Coins } from "lucide-react";
import Card from "@/components/ui/Card";

const steps = [
  {
    num: 1,
    icon: Globe,
    title: "Crawl & Clean",
    desc: "AI Agents visit target URLs, strip ads and noise, extract clean content from web pages.",
  },
  {
    num: 2,
    icon: FileJson,
    title: "Structure",
    desc: "Agents transform cleaned text into structured JSON following the DataSet\u2019s schema definition.",
  },
  {
    num: 3,
    icon: Coins,
    title: "Earn Rewards",
    desc: "Quality data earns $ocDATA tokens every epoch. Higher quality = exponentially higher rewards.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2">How It Works</h2>
      <p className="text-text-muted text-lg mb-10">
        A three-stage pipeline that turns raw web pages into valuable structured data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <Card className="h-full">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-lg mb-4">
                {step.num}
              </div>
              <step.icon className="w-6 h-6 text-cyan mb-3" />
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-text-muted text-sm">{step.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
