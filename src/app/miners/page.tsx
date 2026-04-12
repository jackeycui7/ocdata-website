"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { shortenAddress, TIERS, getTier, formatNumber } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PAGE_SIZE = 20;

interface MinerWithReward {
  miner_id: string;
  credit: number;
  credit_tier: string;
  online: boolean;
  total_rewards: number;
  total_tasks: number;
  avg_score: number;
}

export default function MinersPage() {
  const [miners, setMiners] = useState<MinerWithReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Load all miners (sorted by reward from API)
  useEffect(() => {
    async function loadMiners() {
      try {
        const res = await fetch("/api/miners");
        const json = await res.json();
        if (json.success && json.data) {
          setMiners(json.data);
        }
      } catch (e) {
        console.error("Failed to load miners", e);
      } finally {
        setLoading(false);
      }
    }
    loadMiners();
  }, []);

  const totalPages = Math.ceil(miners.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageMiners = miners.slice(start, start + PAGE_SIZE);
  const onlineCount = miners.filter((m) => m.online).length;
  const avgCredit =
    miners.length > 0
      ? Math.round(miners.reduce((s, m) => s + m.credit, 0) / miners.length)
      : 0;

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">
              Network
            </span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Miners</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total Miners", value: String(miners.length) },
              { label: "Online", value: String(onlineCount) },
              { label: "Avg Credit", value: String(avgCredit) },
              {
                label: "Page",
                value: totalPages > 0 ? `${page} / ${totalPages}` : "—",
              },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">
                  {s.label}
                </div>
                <div className="font-mono text-xl font-semibold tabular-nums">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="border border-border rounded-lg py-20 flex items-center justify-center">
              <p className="text-text-muted text-sm font-mono">Loading miners...</p>
            </div>
          ) : miners.length === 0 ? (
            <div className="border border-border rounded-lg py-20 flex flex-col items-center justify-center text-center">
              <p className="text-text-muted text-sm font-medium">
                No miners currently registered.
              </p>
              <p className="text-text-dim text-xs font-mono mt-2">
                Run the clawtroop crawler and register via the platform API to
                start mining.
              </p>
            </div>
          ) : (
            <>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                        <th className="text-left px-6 py-3 w-8">#</th>
                        <th className="text-left px-4 py-3">Miner</th>
                        <th className="text-left px-4 py-3">Credit</th>
                        <th className="text-left px-4 py-3">Tier</th>
                        <th className="text-right px-4 py-3">Total Tasks</th>
                        <th className="text-right px-4 py-3">Avg Score</th>
                        <th className="text-right px-4 py-3">Total Rewards</th>
                        <th className="text-center px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {pageMiners.map((m, i) => {
                        const tier = getTier(m.credit);
                        const t = TIERS[tier];
                        return (
                          <tr
                            key={m.miner_id}
                            className="hover:bg-bg-surface transition-colors group"
                          >
                            <td className="px-6 py-3 font-mono text-text-dim tabular-nums">
                              {start + i + 1}
                            </td>
                            <td className="px-4 py-3">
                              <Link
                                href={`/miners/${m.miner_id}`}
                                className="font-mono text-sm group-hover:text-accent transition-colors"
                              >
                                {shortenAddress(m.miner_id)}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-accent/50"
                                    style={{ width: `${m.credit}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs tabular-nums text-text-muted">
                                  {m.credit}
                                </span>
                              </div>
                            </td>
                            <td className={`px-4 py-3 text-xs font-mono ${t.color}`}>
                              {t.label}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">
                              {m.total_tasks.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">
                              {m.avg_score.toFixed(1)}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">
                              {m.total_rewards > 0 ? (
                                <span className="text-success">
                                  {formatNumber(m.total_rewards)}
                                </span>
                              ) : (
                                "0"
                              )}
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  m.online ? "bg-success" : "bg-text-dim"
                                }`}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-mono border border-border rounded hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 text-xs font-mono rounded transition-colors ${
                            page === pageNum
                              ? "bg-accent text-bg font-semibold"
                              : "hover:bg-bg-surface"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-mono border border-border rounded hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
