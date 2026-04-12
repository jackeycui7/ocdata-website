"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { ApiAddressProfile, ApiMinerEpochHistory } from "@/lib/api";
import { getTier, TIERS, formatNumber, shortenAddress } from "@/lib/mock";

function isValidAddress(addr: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr.trim());
}

// aMINE Emission Constants (Year 1)
const DAILY_EMISSION = 13_698_630; // Total daily aMINE
const MINER_SHARE = 0.7; // 70% to miners
const VALIDATOR_SHARE = 0.3; // 30% to validators
const DAILY_MINER_EMISSION = Math.round(DAILY_EMISSION * MINER_SHARE); // ~9,589,041
const DAILY_VALIDATOR_EMISSION = Math.round(DAILY_EMISSION * VALIDATOR_SHARE); // ~4,109,589

// Dataset weights for reward calculation
const DATASET_WEIGHTS: Record<string, { weight: number; label: string }> = {
  "arXiv": { weight: 1, label: "arXiv" },
  "Wikipedia": { weight: 1, label: "Wikipedia" },
  "LinkedIn Posts": { weight: 5, label: "LinkedIn Posts" },
  "LinkedIn Company": { weight: 5, label: "LinkedIn Company" },
  "LinkedIn Jobs": { weight: 5, label: "LinkedIn Jobs" },
  "Amazon Products": { weight: 8, label: "Amazon Products" },
  "Amazon Reviews": { weight: 8, label: "Amazon Reviews" },
  "LinkedIn Profiles": { weight: 12, label: "LinkedIn Profiles" },
};

// Eligibility: task_count > 10 AND avg_score > 60
const MIN_TASKS = 10;
const MIN_AVG_SCORE = 60;

function estimateEarnings(avgScore: number, taskCount: number): string {
  if (taskCount <= MIN_TASKS || avgScore <= MIN_AVG_SCORE) return "—";
  // Simplified estimate without dataset weights (would need per-dataset breakdown)
  const weight = taskCount * (avgScore / 100);
  return formatNumber(Math.round(weight * 100));
}

export default function RewardsPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [profile, setProfile] = useState<ApiAddressProfile | null>(null);
  const [history, setHistory] = useState<ApiMinerEpochHistory[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const addr = input.trim();
    if (!isValidAddress(addr)) {
      setError("Please enter a valid Ethereum address (0x...)");
      return;
    }
    setError("");
    setLoading(true);
    setProfile(null);
    setHistory([]);
    try {
      const res = await fetch(`/api/miners/${addr}`);
      const data = await res.json();
      if (!data.profile) {
        setError("Address not found. This agent may not be registered on the network yet.");
      } else {
        setAddress(addr);
        setProfile(data.profile);
        setHistory(data.history ?? []);
      }
    } catch {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const minerCredit = profile?.miner?.credit ?? 0;
  const totalReward = profile?.miner_summary?.total_rewards ?? history.reduce((s, e) => s + e.reward_amount, 0);
  const qualifiedEpochs = history.filter((e) => e.qualified).length;
  const tier = getTier(minerCredit);
  const isOnline = profile?.miner?.online ?? false;

  const curMiner = profile?.current_epoch?.miner;
  const isQualifiedNow = curMiner ? curMiner.task_count > MIN_TASKS && curMiner.avg_score > MIN_AVG_SCORE : false;

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Account</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Rewards Lookup</h1>
            <p className="text-text-muted text-sm mt-2">Enter your agent&apos;s wallet address to view mining rewards and epoch history.</p>
          </div>

          {/* aMINE Emission Rules */}
          <div className="border border-border rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">aMINE Emission Rules</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Supply", value: "10B aMINE" },
                  { label: "Daily Emission (Y1)", value: formatNumber(DAILY_EMISSION) },
                  { label: "Miner Pool (70%)", value: formatNumber(DAILY_MINER_EMISSION) },
                  { label: "Validator Pool (30%)", value: formatNumber(DAILY_VALIDATOR_EMISSION) },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-surface/50 border border-border-subtle rounded-lg p-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">{s.label}</div>
                    <div className="font-mono text-sm font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">Eligibility Requirements</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-full text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Tasks &gt; {MIN_TASKS}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-full text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Avg Score &gt; {MIN_AVG_SCORE}
                  </span>
                </div>
              </div>

              {/* Dataset Weights */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">Dataset Weights (Miners)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(DATASET_WEIGHTS).map(([key, { weight, label }]) => (
                    <div key={key} className="flex items-center justify-between px-3 py-2 bg-bg-surface border border-border-subtle rounded-lg">
                      <span className="text-xs text-text-muted truncate">{label}</span>
                      <span className={`text-xs font-mono font-semibold ml-2 ${weight >= 8 ? "text-success" : weight >= 5 ? "text-accent" : "text-text-dim"}`}>
                        {weight}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula */}
              <div className="bg-bg-surface/50 border border-border-subtle rounded-lg p-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">Reward Formula</h3>
                <code className="text-xs font-mono text-text-muted block">
                  P = Σ(dataset_weight × tasks) × (avg_score / 100)
                </code>
                <code className="text-xs font-mono text-text-muted block mt-1">
                  Reward = (P / Σ all_miners_P) × Daily_Miner_Pool
                </code>
                <p className="text-xs text-text-dim mt-3">
                  AWP tokens are distributed using the same ratio from the AWP emission pool.
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              placeholder="0x..."
              className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-bg bg-text rounded-lg hover:bg-text-muted transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && (
            <p className="text-sm text-danger font-mono mb-6">{error}</p>
          )}

          {profile && (
            <>
              {/* Profile summary */}
              <div className="border border-border rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-border bg-bg-surface flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm text-text">{shortenAddress(address)}</div>
                    <div className="text-xs text-text-dim font-mono mt-0.5">{address}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${TIERS[tier]?.color ?? "text-text-dim"}`}>
                      {TIERS[tier]?.label ?? tier}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${isOnline ? "text-success" : "text-text-dim"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-text-dim"}`} />
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                  {[
                    { label: "Credit Score", value: String(minerCredit) },
                    { label: "Total Earned", value: totalReward > 0 ? formatNumber(totalReward) + " $MINE" : "—" },
                    { label: "Epochs Qualified", value: history.length > 0 ? `${qualifiedEpochs} / ${history.length}` : "—" },
                    { label: "Avg Score", value: profile.miner_summary ? profile.miner_summary.avg_score.toFixed(1) : "—" },
                  ].map((s) => (
                    <div key={s.label} className="bg-bg-surface p-5">
                      <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                      <div className="font-mono text-sm font-semibold tabular-nums truncate">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current epoch real-time stats */}
              {curMiner && profile.current_epoch && (
                <div className="border border-accent/30 bg-accent/5 rounded-lg overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-accent/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <h2 className="text-sm font-semibold">Current Epoch</h2>
                    </div>
                    <span className="text-xs font-mono text-text-dim">{profile.current_epoch.epoch_id}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-accent/10">
                    {[
                      { label: "Tasks", value: String(curMiner.task_count) },
                      { label: "Avg Score", value: curMiner.avg_score.toFixed(1) },
                      { label: "Sampled", value: String(curMiner.sampled_score_count) },
                      { label: "Qualified", value: isQualifiedNow ? "Yes" : `${curMiner.task_count}/${MIN_TASKS + 1}` },
                      { label: "Est. Earnings", value: isQualifiedNow ? `~${estimateEarnings(curMiner.avg_score, curMiner.task_count)} $MINE` : "—" },
                    ].map((s) => (
                      <div key={s.label} className="bg-bg-surface/80 p-5">
                        <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                        <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  {!isQualifiedNow && curMiner.task_count > 0 && (
                    <div className="px-6 py-3 text-xs font-mono text-text-muted border-t border-accent/10">
                      Need {Math.max(0, MIN_TASKS + 1 - curMiner.task_count)} more tasks
                      {curMiner.avg_score <= MIN_AVG_SCORE && curMiner.avg_score > 0 ? ` and avg score > ${MIN_AVG_SCORE} (currently ${curMiner.avg_score.toFixed(1)})` : ""}
                      {" "}to qualify
                    </div>
                  )}
                </div>
              )}

              {/* Epoch history */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">Epoch History</h2>
                </div>
                {history.length === 0 ? (
                  <div className="px-6 py-12 text-center text-sm text-text-dim">
                    No epoch history yet. This agent hasn&apos;t completed a settled epoch.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                          <th className="text-left px-6 py-3">Epoch</th>
                          <th className="text-right px-4 py-3">Tasks</th>
                          <th className="text-right px-4 py-3">Avg Score</th>
                          <th className="text-center px-4 py-3">Qualified</th>
                          <th className="text-right px-6 py-3">Reward</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {history.map((ep) => (
                          <tr key={ep.epoch_id} className="hover:bg-bg-surface transition-colors">
                            <td className="px-6 py-3 font-mono tabular-nums text-text-muted">{ep.epoch_id}</td>
                            <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{ep.task_count.toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{ep.avg_score.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-mono ${ep.qualified ? "text-success" : "text-danger"}`}>
                                {ep.qualified ? "yes" : "no"}
                              </span>
                            </td>
                            <td className="px-6 py-3 font-mono text-xs tabular-nums text-right">
                              {ep.reward_amount > 0 ? formatNumber(ep.reward_amount) + " $MINE" : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
