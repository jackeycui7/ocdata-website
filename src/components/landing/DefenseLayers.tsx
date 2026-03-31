"use client";

import { motion } from "framer-motion";
import { RefreshCw, ClipboardCheck, Eye, Users } from "lucide-react";
import Card from "@/components/ui/Card";

const layers = [
  {
    num: 1,
    icon: RefreshCw,
    title: "Phase A: Repeat Crawl",
    desc: "Independent miners re-crawl the same URL to verify data authenticity via text similarity.",
    color: "text-cyan",
  },
  {
    num: 2,
    icon: ClipboardCheck,
    title: "Phase B: Quality Eval",
    desc: "Validators assess structured data extraction quality against the verified cleaned data.",
    color: "text-accent-light",
  },
  {
    num: 3,
    icon: Eye,
    title: "Golden Task",
    desc: "Secret pre-labeled test tasks are mixed in to catch lazy or dishonest validators.",
    color: "text-warn",
  },
  {
    num: 4,
    icon: Users,
    title: "Peer Review",
    desc: "5-validator consensus on 10% of tasks aligns scoring standards across the network.",
    color: "text-success",
  },
];

export default function DefenseLayers() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2">Four-Layer Defense</h2>
      <p className="text-text-muted text-lg mb-10">
        A layered verification system ensures only authentic, high-quality data enters the network.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                  {layer.num}
                </span>
                <layer.icon className={`w-5 h-5 ${layer.color}`} />
              </div>
              <h3 className="text-sm font-semibold mb-2">{layer.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{layer.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
