"use client";

import { mockEpochs, mockMiners, mockValidators, formatNumber, shortenAddress } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export default function EpochDetailPage({ params }: { params: { id: string } }) {
  const epoch = mockEpochs.find((e) => String(e.id) === params.id);
  if (!epoch) return notFound();

  // Mock settlement results
  const minerResults = mockMiners.map((m) => ({
    address: m.address,
    taskCount: m.taskCount,
    avgScore: m.avgScore,
    qualified: m.taskCount >= 80 && m.avgScore >= 60,
    weight: m.avgScore >= 60 ? Math.round(m.avgScore * m.avgScore * m.taskCount) : 0,
    reward: m.reward,
    confirmed: m.taskCount >= 80 && m.avgScore >= 60 ? m.taskCount : 0,
    rejected: m.taskCount >= 80 && m.avgScore >= 60 ? 0 : m.taskCount,
  }));

  const validatorResults = mockValidators.map((v) => ({
    address: v.address,
    evalCount: v.evalCount,
    accuracy: v.accuracy,
    peerAccuracy: v.peerAccuracy,
    qualified: v.accuracy >= 60,
    weight: v.accuracy >= 60 ? Math.round(v.accuracy * v.accuracy * v.evalCount) : 0,
    reward: v.accuracy >= 60 ? Math.round(epoch.validatorPool / mockValidators.filter((x) => x.accuracy >= 60).length) : 0,
    penalty: v.accuracy < 40 ? "slashed" : "",
  }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a href="/epochs" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">← Epochs</a>

          <div className="mt-4 mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Epoch #{epoch.id}</h1>
            <p className="text-text-muted text-sm mt-2">{epoch.startTime.split("T")[0]}</p>
          </div>

          {/* Emission breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total Emission", value: formatNumber(epoch.totalEmission) + " $aMine" },
              { label: "Miner Pool (41%)", value: formatNumber(epoch.minerPool) },
              { label: "Validator Pool (41%)", value: formatNumber(epoch.validatorPool) },
              { label: "Owner (18%)", value: formatNumber(epoch.ownerPool) },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Miner Results */}
          <div className="border border-border rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">Miner Settlement</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                    <th className="text-left px-6 py-3">Miner</th>
                    <th className="text-right px-4 py-3">Tasks</th>
                    <th className="text-right px-4 py-3">Avg Score</th>
                    <th className="text-center px-4 py-3">Qualified</th>
                    <th className="text-right px-4 py-3">Confirmed</th>
                    <th className="text-right px-4 py-3">Rejected</th>
                    <th className="text-right px-6 py-3">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {minerResults.map((m) => (
                    <tr key={m.address} className="hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-3 font-mono text-sm">{shortenAddress(m.address)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{m.taskCount}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{m.avgScore.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono ${m.qualified ? "text-success" : "text-danger"}`}>{m.qualified ? "yes" : "no"}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-success tabular-nums text-right">{m.confirmed || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-danger tabular-nums text-right">{m.rejected || "—"}</td>
                      <td className="px-6 py-3 font-mono text-xs tabular-nums text-right font-medium">{m.qualified ? formatNumber(m.reward) : "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validator Results */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">Validator Settlement</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                    <th className="text-left px-6 py-3">Validator</th>
                    <th className="text-right px-4 py-3">Evals</th>
                    <th className="text-right px-4 py-3">Accuracy</th>
                    <th className="text-right px-4 py-3">Peer Acc.</th>
                    <th className="text-center px-4 py-3">Qualified</th>
                    <th className="text-right px-4 py-3">Reward</th>
                    <th className="text-center px-6 py-3">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {validatorResults.map((v) => (
                    <tr key={v.address} className="hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-3 font-mono text-sm">{shortenAddress(v.address)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.evalCount.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{v.accuracy.toFixed(1)}%</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.peerAccuracy.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono ${v.qualified ? "text-success" : "text-danger"}`}>{v.qualified ? "yes" : "no"}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">{v.qualified ? formatNumber(v.reward) : "0"}</td>
                      <td className="px-6 py-3 text-center">
                        {v.penalty ? <span className="text-[10px] font-mono text-danger uppercase">{v.penalty}</span> : <span className="text-text-dim">—</span>}
                      </td>
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
