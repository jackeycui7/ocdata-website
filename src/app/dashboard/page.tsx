import { formatNumber, TIERS, getTier } from "@/lib/mock";
import { loadDashboardStats, loadDatasets, loadMiners, loadEpochs, loadRecentSubmissions } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EpochEmissionChart from "@/components/charts/EpochEmissionChart";
import CreditDistChart from "@/components/charts/CreditDistChart";
import AutoRefresh from "@/components/AutoRefresh";

export const revalidate = 10;

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default async function DashboardPage() {
  const [dashStats, datasets, miners, epochs, rawSubmissions] = await Promise.all([
    loadDashboardStats(),
    loadDatasets(),
    loadMiners(),
    loadEpochs(),
    loadRecentSubmissions(),
  ]);

  const stats = [
    { label: "Current Epoch", value: dashStats.currentEpoch || "—", sub: "live" },
    { label: "Miners Online", value: String(dashStats.minersOnline), sub: `of ${dashStats.minersTotal} total` },
    { label: "Validators Online", value: String(dashStats.validatorsOnline), sub: `of ${dashStats.validatorsTotal} total` },
    { label: "Submissions", value: formatNumber(dashStats.totalSubmissions), sub: "this epoch" },
    { label: "Evaluations", value: formatNumber(dashStats.totalEvaluations), sub: "completed" },
    { label: "$aMine Price", value: "—", sub: "Live on Base" },
  ];

  const sortedDatasets = [...datasets].sort((a, b) => b.entries - a.entries);
  const maxEntries = sortedDatasets[0]?.entries || 1;

  const datasetMap = new Map(datasets.map((d) => [d.id, d.name]));

  const recentSubmissions = rawSubmissions.slice(0, 8).map((s) => ({
    dataset: datasetMap.get(s.dataset_id) || s.dataset_id,
    miner: s.miner_id.length > 12 ? `${s.miner_id.slice(0, 6)}...${s.miner_id.slice(-4)}` : s.miner_id,
    time: relativeTime(s.created_at),
    status: s.status === "confirmed" ? "confirmed" : "pending",
  }));

  const emissionData = [...epochs].reverse().map((ep) => ({
    epoch: ep.startTime.split("T")[0].slice(5),
    minerPool: ep.minerPool,
    validatorPool: ep.validatorPool,
    ownerPool: ep.ownerPool,
  }));

  const creditDist = (() => {
    const counts: Record<string, number> = { excellent: 0, good: 0, normal: 0, limited: 0, novice: 0 };
    miners.forEach((m) => { counts[getTier(m.credit)]++; });
    return Object.entries(counts).map(([tier, count]) => ({
      tier,
      label: TIERS[tier].label,
      count,
      color: TIERS[tier].color,
    }));
  })();

  return (
    <>
      <AutoRefresh />
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Live</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Connected
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Dashboard</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">{s.label}</div>
                <div className="font-mono text-xl font-semibold tabular-nums mb-1">{s.value}</div>
                <div className="text-xs text-text-dim">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">Epoch Emission History</h2>
                </div>
                <div className="p-4">
                  <EpochEmissionChart data={emissionData} />
                </div>
              </div>

              {sortedDatasets.length > 0 ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-bg-surface">
                    <h2 className="text-sm font-semibold">DataSet Ranking</h2>
                  </div>
                  <div className="divide-y divide-border-subtle">
                    {sortedDatasets.map((ds, i) => (
                      <div key={ds.id} className="px-6 py-3 flex items-center gap-4 hover:bg-bg-surface transition-colors">
                        <span className="font-mono text-xs text-text-dim w-6 tabular-nums">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{ds.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden max-w-[200px]">
                              <div className="h-full rounded-full bg-accent/40" style={{ width: `${(ds.entries / maxEntries) * 100}%` }} />
                            </div>
                            <span className="font-mono text-xs text-text-muted tabular-nums">{formatNumber(ds.entries)}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-text-dim tabular-nums">{ds.miners} miners</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-bg-surface">
                    <h2 className="text-sm font-semibold">DataSet Ranking</h2>
                  </div>
                  <div className="px-6 py-10 text-center text-sm text-text-dim">No datasets available.</div>
                </div>
              )}

              {epochs.length > 0 ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-bg-surface">
                    <h2 className="text-sm font-semibold">Recent Epochs</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                          <th className="text-left px-6 py-3">Date</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-right px-4 py-3">Submissions</th>
                          <th className="text-right px-4 py-3">Confirmed</th>
                          <th className="text-right px-6 py-3">Rejected</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {epochs.slice(0, 8).map((ep) => (
                          <tr key={ep.id} className="hover:bg-bg-surface transition-colors">
                            <td className="px-6 py-3 font-mono tabular-nums">{ep.startTime.split("T")[0]}</td>
                            <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider">
                              <span className={ep.status === "open" ? "text-success" : ep.status === "failed" ? "text-danger" : "text-text-muted"}>
                                {ep.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono tabular-nums text-right text-text-muted">{ep.summary.total}</td>
                            <td className="px-4 py-3 font-mono tabular-nums text-right text-success">{ep.summary.confirmed}</td>
                            <td className="px-6 py-3 font-mono tabular-nums text-right text-danger">{ep.summary.rejected}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-bg-surface">
                    <h2 className="text-sm font-semibold">Recent Epochs</h2>
                  </div>
                  <div className="px-6 py-10 text-center text-sm text-text-dim">No epoch data available.</div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-bg-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <h2 className="text-sm font-semibold">Live Submissions</h2>
                  {recentSubmissions.length > 0 && (
                    <span className="ml-auto text-[10px] font-mono text-success">live</span>
                  )}
                </div>
                {recentSubmissions.length > 0 ? (
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
                ) : (
                  <div className="px-5 py-10 text-center text-sm text-text-dim">No recent submissions.</div>
                )}
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">Miner Credit Distribution</h2>
                </div>
                <div className="p-5">
                  <CreditDistChart data={creditDist} />
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
