"use client";

import { useState } from "react";
import { shortenAddress, formatNumber } from "@/lib/mock";

interface MinerResult {
  address: string;
  taskCount: number;
  avgScore: number;
  qualified: boolean;
  confirmed: number;
  rejected: number;
  reward: number;
}

interface ValidatorResult {
  address: string;
  evalCount: number;
  accuracy: number;
  peerAccuracy: number;
  qualified: boolean;
  reward: number;
  penalty: string;
}

export default function EpochDetailClient({
  minerResults,
  validatorResults,
}: {
  minerResults: MinerResult[];
  validatorResults: ValidatorResult[];
}) {
  const [tab, setTab] = useState<"miners" | "validators">("miners");

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-6">
        <button
          onClick={() => setTab("miners")}
          className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px ${
            tab === "miners" ? "border-accent text-text" : "border-transparent text-text-dim hover:text-text-muted"
          }`}
        >
          Miner Results ({minerResults.length})
        </button>
        <button
          onClick={() => setTab("validators")}
          className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px ${
            tab === "validators" ? "border-accent text-text" : "border-transparent text-text-dim hover:text-text-muted"
          }`}
        >
          Validator Results ({validatorResults.length})
        </button>
      </div>

      {tab === "miners" && (
        <div className="border border-border rounded-lg overflow-hidden">
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
      )}

      {tab === "validators" && (
        <div className="border border-border rounded-lg overflow-hidden">
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
                {validatorResults.map((vr) => (
                  <tr key={vr.address} className="hover:bg-bg-surface transition-colors">
                    <td className="px-6 py-3 font-mono text-sm">{shortenAddress(vr.address)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{vr.evalCount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{vr.accuracy.toFixed(1)}%</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{vr.peerAccuracy.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-mono ${vr.qualified ? "text-success" : "text-danger"}`}>{vr.qualified ? "yes" : "no"}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">{vr.qualified ? formatNumber(vr.reward) : "0"}</td>
                    <td className="px-6 py-3 text-center">
                      {vr.penalty ? <span className="text-[10px] font-mono text-danger uppercase">{vr.penalty}</span> : <span className="text-text-dim">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
