"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { mockValidators, shortenAddress, TIERS, getTier } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sorted = [...mockValidators].sort((a, b) => b.accuracy - a.accuracy);
const onlineCount = mockValidators.filter((v) => v.online).length;
const readyCount = mockValidators.filter((v) => v.ready).length;

export default function ValidatorsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Validators</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total", value: String(mockValidators.length) },
              { label: "Online", value: String(onlineCount) },
              { label: "Ready Pool", value: String(readyCount) },
              { label: "Avg Accuracy", value: (mockValidators.reduce((s, v) => s + v.accuracy, 0) / mockValidators.length).toFixed(1) + "%" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-xl font-semibold tabular-nums">{s.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                    <th className="text-left px-6 py-3 w-8">#</th>
                    <th className="text-left px-4 py-3">Validator</th>
                    <th className="text-left px-4 py-3">Credit</th>
                    <th className="text-left px-4 py-3">Tier</th>
                    <th className="text-right px-4 py-3">Evals</th>
                    <th className="text-right px-4 py-3">Accuracy</th>
                    <th className="text-right px-4 py-3">Peer Acc.</th>
                    <th className="text-right px-4 py-3">Stake</th>
                    <th className="text-center px-4 py-3">Ready</th>
                    <th className="text-center px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {sorted.map((v, i) => {
                    const tier = getTier(v.credit);
                    const t = TIERS[tier];
                    return (
                      <motion.tr key={v.address} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.04 }} className="hover:bg-bg-surface transition-colors group">
                        <td className="px-6 py-3 font-mono text-text-dim tabular-nums">{i + 1}</td>
                        <td className="px-4 py-3">
                          <Link href={`/validators/${v.address}`} className="font-mono text-sm group-hover:text-accent transition-colors">
                            {shortenAddress(v.address)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-accent/50" style={{ width: `${v.credit}%` }} />
                            </div>
                            <span className="font-mono text-xs tabular-nums text-text-muted">{v.credit}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-xs font-mono ${t.color}`}>{t.label}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.evalCount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">{v.accuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.peerAccuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.stake.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          {v.ready ? <span className="text-[10px] font-mono text-success">READY</span> : <span className="text-[10px] font-mono text-text-dim">—</span>}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${v.online ? "bg-success" : "bg-text-dim"}`} />
                        </td>
                      </motion.tr>
                    );
                  })}
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
