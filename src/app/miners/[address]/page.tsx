"use client";

import { mockMiners, shortenAddress, TIERS, getTier, mockEpochs, formatNumber } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export default function MinerDetailPage({ params }: { params: { address: string } }) {
  const miner = mockMiners.find((m) => m.address === decodeURIComponent(params.address));
  if (!miner) return notFound();

  const tier = getTier(miner.credit);
  const t = TIERS[tier];
  const qualified = miner.taskCount >= 80 && miner.avgScore >= 60;

  // Mock epoch history
  const epochHistory = mockEpochs.slice(0, 10).map((ep, i) => ({
    epoch: ep.id,
    taskCount: Math.max(0, miner.taskCount - i * 50 + Math.floor(Math.random() * 30)),
    avgScore: Math.max(55, miner.avgScore - i * 1.5 + Math.random() * 3),
    qualified: i < 7,
    reward: Math.max(0, miner.reward - i * 200 + Math.floor(Math.random() * 100)),
  }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Back */}
          <a href="/miners" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">← Miners</a>

          {/* Header */}
          <div className="mt-4 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-mono text-2xl font-bold tracking-tight">{shortenAddress(miner.address)}</h1>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${miner.online ? "bg-success" : "bg-text-dim"}`} />
              <span className={`text-xs font-mono ${t.color}`}>{t.label}</span>
            </div>
            <div className="font-mono text-xs text-text-dim break-all">{miner.address}</div>
          </div>

          {/* Credit bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Credit Score</span>
              <span className="font-mono text-sm font-semibold">{miner.credit}/100</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-accent/60 transition-all" style={{ width: `${miner.credit}%` }} />
            </div>
          </div>

          {/* Current epoch stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Submissions", value: miner.taskCount.toLocaleString() },
              { label: "Avg Score", value: miner.avgScore.toFixed(1) },
              { label: "Qualified", value: qualified ? "Yes" : "No" },
              { label: "Epoch Reward", value: `${formatNumber(miner.reward)} $aMine` },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Epoch history */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">Epoch History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                    <th className="text-left px-6 py-3">Epoch</th>
                    <th className="text-right px-4 py-3">Tasks</th>
                    <th className="text-right px-4 py-3">Avg Score</th>
                    <th className="text-center px-4 py-3">Qualified</th>
                    <th className="text-right px-6 py-3">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {epochHistory.map((eh) => (
                    <tr key={eh.epoch} className="hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-3 font-mono tabular-nums">#{eh.epoch}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{eh.taskCount}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{eh.avgScore.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono ${eh.qualified ? "text-success" : "text-danger"}`}>
                          {eh.qualified ? "yes" : "no"}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs tabular-nums text-right">{eh.qualified ? formatNumber(eh.reward) : "—"}</td>
                    </tr>
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
