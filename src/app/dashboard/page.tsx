import { formatNumber, TIERS, getTier } from "@/lib/mock";
import { loadDashboardStats, loadDatasets, loadMiners, loadEpochs } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export default async function DashboardPage() {
  const [dashStats, datasets, miners, epochs] = await Promise.all([
    loadDashboardStats(),
    loadDatasets(),
    loadMiners(),
    loadEpochs(),
  ]);

  const stats = [
    { label: "Current Epoch", value: dashStats.currentEpoch ? `#${dashStats.currentEpoch}` : "—", sub: dashStats.source === "api" ? "live" : "14h 23m remaining" },
    { label: "Miners Online", value: String(dashStats.minersOnline), sub: `of ${dashStats.minersTotal} total` },
    { label: "Validators Online", value: String(dashStats.validatorsOnline), sub: `of ${dashStats.validatorsTotal} total` },
    { label: "Submissions", value: formatNumber(dashStats.totalSubmissions), sub: "this epoch" },
    { label: "Evaluations", value: formatNumber(dashStats.totalEvaluations), sub: "completed" },
    { label: "$aMine Price", value: "—", sub: "Live on Base" },
  ];

  const sortedDatasets = [...datasets].sort((a, b) => b.entries - a.entries);
  const maxEntries = sortedDatasets[0]?.entries || 1;

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

  const creditDist = (() => {
    const counts: Record<string, number> = { excellent: 0, good: 0, normal: 0, limited: 0, novice: 0 };
    miners.forEach((m) => { counts[getTier(m.credit)]++; });
    return Object.entries(counts).map(([tier, count]) => ({ tier, count, total: miners.length }));
  })();

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Live</span>
              {dashStats.source === "api" && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Connected
                </span>
              )}
              {dashStats.source === "mock" && (
                <span className="text-[10px] font-mono text-text-dim">Demo data</span>
              )}
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
                      {epochs.slice(0, 8).map((ep) => (
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

            <div className="lg:col-span-4 space-y-6">
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

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-bg-surface">
                  <h2 className="text-sm font-semibold">Miner Credit Distribution</h2>
                </div>
                <div className="p-5 space-y-3">
                  {creditDist.map((item) => {
                    const t = TIERS[item.tier];
                    const pct = item.total > 0 ? (item.count / item.total) * 100 : 0;
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
