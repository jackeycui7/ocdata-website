"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { mockEpochs, formatNumber } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function EpochsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">History</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Epochs</h1>
            <p className="text-text-muted text-sm mt-2">
              Each epoch lasts 1 day. Settlement occurs at UTC 00:00.
            </p>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                    <th className="text-left px-6 py-3">Epoch</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Qualified</th>
                    <th className="text-right px-4 py-3">Miner Pool</th>
                    <th className="text-right px-4 py-3">Validator Pool</th>
                    <th className="text-right px-4 py-3">Owner</th>
                    <th className="text-right px-6 py-3">Total Emission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {mockEpochs.map((ep, i) => (
                    <motion.tr
                      key={ep.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="hover:bg-bg-surface transition-colors group"
                    >
                      <td className="px-6 py-3">
                        <Link href={`/epochs/${ep.id}`} className="font-mono tabular-nums group-hover:text-accent transition-colors">
                          #{ep.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted">
                        {ep.startTime.split("T")[0]}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">
                        {ep.qualifiedMiners}/{ep.totalMiners}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">
                        {formatNumber(ep.minerPool)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">
                        {formatNumber(ep.validatorPool)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">
                        {formatNumber(ep.ownerPool)}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs tabular-nums text-right font-medium">
                        {formatNumber(ep.totalEmission)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
