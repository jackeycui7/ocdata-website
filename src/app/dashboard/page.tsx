"use client";

import { motion } from "framer-motion";
import { mockMiners, mockValidators, mockDatasets, mockEpochs, formatNumber, TIERS } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const currentEpoch = mockEpochs[0];
const totalSubmissions = mockMiners.reduce((s, m) => s + m.taskCount, 0);
const totalEvals = mockValidators.reduce((s, v) => s + v.evalCount, 0);

const stats = [
  { label: "Current Epoch", value: `#${currentEpoch.id}`, sub: "14h 23m remaining" },
  { label: "Miners Online", value: String(mockMiners.filter((m) => m.online).length), sub: `of ${mockMiners.length} total` },
  { label: "Validators Online", value: String(mockValidators.filter((v) => v.online).length), sub: `of ${mockValidators.length} total` },
  { label: "Submissions", value: formatNumber(totalSubmissions), sub: "this epoch" },
  { label: "Evaluations", value: formatNumber(totalEvals), sub: "completed" },
  { label: "$aMine Price", value: "—", sub: "Live on Base" },
];

const recentSubmissions = [
  { dataset: "LinkedIn Profiles", miner: "0xA1b2...abcd", time: "2s ago", status: "pending" },
  { dataset: "Amazon Products", miner: "0xB2c3...CDeF", time: "8s ago", status: "pending" },
  { dataset: "Wikipedia", miner: "0xC3d4...Ef01", time: "15s ago", status: "confirmed" },
  { dataset: "arXiv Papers", miner: "0xE5f6...2345", time: "22s ago", status: "confirmed" },
  { dataset: "Amazon Reviews", miner: "0xF678...4567", time: "31s ago", status: "pending" },
  { dataset: "LinkedIn Jobs", miner: "0x0789...5678", time: "45s ago", status: "confirmed" },
  { dataset: "LinkedIn Company", miner: "0x1890...7890", time: "52s ago", status: "confirmed" },
  { dataset: "Amazon Sellers", miner: "0xA1b2...abcd", time: "1m ago", status: "confirmed" },
];

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Live</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Dashboard</h1>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-bg-surface p-5"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">{s.label}</div>
                <div className="font-mono text-xl font-semibold tabular-nums mb-1">{s.value}</div>
                <div className="text-xs text-text-dim">{s.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: DataSet ranking + Epoch emission */}
            <div className="lg:col-span-8 space-y-6">
              {/* DataSet ranking */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">DataSet Ranking</h2>
                </div>
                <div className="divide-y divide-border-subtle">
                  {mockDatasets
                    .sort((a, b) => b.entries - a.entries)
                    .map((ds, i) => {
                      const maxEntries = mockDatasets[0].entries;
                      return (
                        <div key={ds.id} className="px-6 py-3 flex items-center gap-4 hover:bg-bg-surface transition-colors">
                          <span className="font-mono text-xs text-text-dim w-6 tabular-nums">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{ds.name}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden max-w-[200px]">
                                <div
                                  className="h-full rounded-full bg-accent/40"
                                  style={{ width: `${(ds.entries / maxEntries) * 100}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs text-text-muted tabular-nums">{formatNumber(ds.entries)}</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-text-dim tabular-nums">{ds.miners} miners</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Epoch emission table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">Recent Epochs</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                        <th className="text-left px-6 py-3">Epoch</th>
                        <th className="text-left px-4 py-3">Qualified</th>
                        <th className="text-right px-4 py-3">Miner Pool</th>
                        <th className="text-right px-4 py-3">Validator Pool</th>
                        <th className="text-right px-6 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {mockEpochs.slice(0, 8).map((ep) => (
                        <tr key={ep.id} className="hover:bg-bg-surface transition-colors">
                          <td className="px-6 py-3 font-mono tabular-nums">#{ep.id}</td>
                          <td className="px-4 py-3 font-mono tabular-nums text-text-muted">{ep.qualifiedMiners}/{ep.totalMiners}</td>
                          <td className="px-4 py-3 font-mono tabular-nums text-right text-text-muted">{formatNumber(ep.minerPool)}</td>
                          <td className="px-4 py-3 font-mono tabular-nums text-right text-text-muted">{formatNumber(ep.validatorPool)}</td>
                          <td className="px-6 py-3 font-mono tabular-nums text-right font-medium">{formatNumber(ep.totalEmission)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Live submissions + Miner distribution */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live submissions */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-bg-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <h2 className="text-sm font-semibold">Live Submissions</h2>
                </div>
                <div className="divide-y divide-border-subtle">
                  {recentSubmissions.map((sub, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{sub.dataset}</div>
                        <div className="text-xs font-mono text-text-dim">{sub.miner}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-mono uppercase tracking-wider ${sub.status === "confirmed" ? "text-success" : "text-text-dim"}`}>
                          {sub.status}
                        </div>
                        <div className="text-xs text-text-dim">{sub.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit distribution */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">Miner Credit Distribution</h2>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { tier: "excellent", count: 2, total: mockMiners.length },
                    { tier: "good", count: 2, total: mockMiners.length },
                    { tier: "normal", count: 1, total: mockMiners.length },
                    { tier: "limited", count: 2, total: mockMiners.length },
                    { tier: "novice", count: 1, total: mockMiners.length },
                  ].map((item) => {
                    const t = TIERS[item.tier];
                    const pct = (item.count / item.total) * 100;
                    return (
                      <div key={item.tier} className="flex items-center gap-3">
                        <span className={`text-xs font-mono w-16 ${t.color}`}>{t.label}</span>
                        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-accent/30" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-mono text-xs text-text-dim tabular-nums w-6 text-right">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
