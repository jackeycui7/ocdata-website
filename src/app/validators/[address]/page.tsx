"use client";

import { mockValidators, shortenAddress, TIERS, getTier, mockEpochs, formatNumber } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export default function ValidatorDetailPage({ params }: { params: { address: string } }) {
  const v = mockValidators.find((x) => x.address === decodeURIComponent(params.address));
  if (!v) return notFound();

  const tier = getTier(v.credit);
  const t = TIERS[tier];

  const epochHistory = mockEpochs.slice(0, 10).map((ep, i) => ({
    epoch: ep.id,
    evalCount: Math.max(10, v.evalCount / 10 - i * 20 + Math.floor(Math.random() * 40)),
    accuracy: Math.max(60, v.accuracy - i * 1.2 + Math.random() * 2),
    peerAccuracy: Math.max(58, v.peerAccuracy - i * 1.5 + Math.random() * 3),
    qualified: i < 8,
    reward: Math.max(0, 800 - i * 60 + Math.floor(Math.random() * 50)),
  }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a href="/validators" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">← Validators</a>

          <div className="mt-4 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-mono text-2xl font-bold tracking-tight">{shortenAddress(v.address)}</h1>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${v.online ? "bg-success" : "bg-text-dim"}`} />
              <span className={`text-xs font-mono ${t.color}`}>{t.label}</span>
              {v.ready && <span className="text-[10px] font-mono text-success border border-success/30 rounded px-1.5 py-0.5">READY</span>}
            </div>
            <div className="font-mono text-xs text-text-dim break-all">{v.address}</div>
          </div>

          {/* Credit bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Credit Score</span>
              <span className="font-mono text-sm font-semibold">{v.credit}/100</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-accent/60 transition-all" style={{ width: `${v.credit}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Eval Count", value: v.evalCount.toLocaleString() },
              { label: "Golden Accuracy", value: v.accuracy.toFixed(1) + "%" },
              { label: "Peer Accuracy", value: v.peerAccuracy.toFixed(1) + "%" },
              { label: "Combined", value: ((v.accuracy + v.peerAccuracy) / 2).toFixed(1) + "%" },
              { label: "Stake", value: v.stake.toLocaleString() + " AWP" },
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
                    <th className="text-right px-4 py-3">Evals</th>
                    <th className="text-right px-4 py-3">Accuracy</th>
                    <th className="text-right px-4 py-3">Peer Acc.</th>
                    <th className="text-center px-4 py-3">Qualified</th>
                    <th className="text-right px-6 py-3">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {epochHistory.map((eh) => (
                    <tr key={eh.epoch} className="hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-3 font-mono tabular-nums">#{eh.epoch}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{Math.round(eh.evalCount)}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{eh.accuracy.toFixed(1)}%</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{eh.peerAccuracy.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono ${eh.qualified ? "text-success" : "text-danger"}`}>{eh.qualified ? "yes" : "no"}</span>
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
