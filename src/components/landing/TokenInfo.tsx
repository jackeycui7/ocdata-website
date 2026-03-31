"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Zap, Coins } from "lucide-react";
import Button from "@/components/ui/Button";

const tokenStats = [
  { icon: TrendingUp, label: "Price", value: "$0.0234" },
  { icon: BarChart3, label: "24h Volume", value: "$128K" },
  { icon: Zap, label: "Epoch Emission", value: "500K" },
  { icon: Coins, label: "Circulating", value: "72M" },
];

export default function TokenInfo() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-bg-surface border border-border rounded-2xl p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              <span className="gradient-text">$ocDATA</span> Token
            </h2>
            <p className="text-text-muted text-sm mt-1">
              ERC-20 on BSC &mdash; minted by SubnetContract each epoch
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            href="https://pancakeswap.finance"
          >
            Trade on PancakeSwap
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {tokenStats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
                <s.icon className="w-5 h-5 text-accent-light" />
              </div>
              <div>
                <div className="text-xs text-text-muted">{s.label}</div>
                <div className="font-mono font-semibold text-lg">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
