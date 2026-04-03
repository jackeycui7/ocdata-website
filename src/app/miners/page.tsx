import Link from "next/link";
import { shortenAddress, TIERS, getTier, formatNumber } from "@/lib/mock";
import { loadMiners } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export default async function MinersPage() {
  const miners = await loadMiners();
  const sorted = [...miners].sort((a, b) => b.avgScore * b.taskCount - a.avgScore * a.taskCount);
  const onlineCount = miners.filter((m) => m.online).length;
  const avgCredit = miners.length > 0 ? Math.round(miners.reduce((s, m) => s + m.credit, 0) / miners.length) : 0;

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Miners</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total Miners", value: String(miners.length) },
              { label: "Online", value: String(onlineCount) },
              { label: "Avg Credit", value: String(avgCredit) },
              { label: "Qualified (Epoch)", value: String(miners.filter((m) => m.taskCount >= 80 && m.avgScore >= 60).length) },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-xl font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          {miners.length === 0 ? (
            <div className="border border-border rounded-lg py-20 flex flex-col items-center justify-center text-center">
              <p className="text-text-muted text-sm font-medium">No miners currently registered.</p>
              <p className="text-text-dim text-xs font-mono mt-2">Run the clawtroop crawler and register via the platform API to start mining.</p>
            </div>
          ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                    <th className="text-left px-6 py-3 w-8">#</th>
                    <th className="text-left px-4 py-3">Miner</th>
                    <th className="text-left px-4 py-3">Credit</th>
                    <th className="text-left px-4 py-3">Tier</th>
                    <th className="text-right px-4 py-3">Submissions</th>
                    <th className="text-right px-4 py-3">Avg Score</th>
                    <th className="text-right px-4 py-3">Reward</th>
                    <th className="text-center px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {sorted.map((m, i) => {
                    const tier = getTier(m.credit);
                    const t = TIERS[tier];
                    return (
                      <tr key={m.address} className="hover:bg-bg-surface transition-colors group">
                        <td className="px-6 py-3 font-mono text-text-dim tabular-nums">{i + 1}</td>
                        <td className="px-4 py-3">
                          <Link href={`/miners/${m.address}`} className="font-mono text-sm group-hover:text-accent transition-colors">
                            {shortenAddress(m.address)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-accent/50" style={{ width: `${m.credit}%` }} />
                            </div>
                            <span className="font-mono text-xs tabular-nums text-text-muted">{m.credit}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-xs font-mono ${t.color}`}>{t.label}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{m.taskCount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">{m.avgScore.toFixed(1)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{formatNumber(m.reward)}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${m.online ? "bg-success" : "bg-text-dim"}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
