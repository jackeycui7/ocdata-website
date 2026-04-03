import Link from "next/link";
import { shortenAddress, TIERS, getTier } from "@/lib/mock";
import { loadValidators } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export default async function ValidatorsPage() {
  const validators = await loadValidators();
  const sorted = [...validators].sort((a, b) => b.accuracy - a.accuracy);
  const onlineCount = validators.filter((v) => v.online).length;
  const readyCount = validators.filter((v) => v.ready).length;

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Validators</h1>
            <p className="text-xs font-mono text-text-dim mt-2">No validator API available — showing demo data</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total", value: String(validators.length) },
              { label: "Online", value: String(onlineCount) },
              { label: "Ready Pool", value: String(readyCount) },
              { label: "Avg Accuracy", value: validators.length > 0 ? (validators.reduce((s, v) => s + v.accuracy, 0) / validators.length).toFixed(1) + "%" : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-xl font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                    <th className="text-left px-6 py-3 w-8">#</th>
                    <th className="text-left px-4 py-3">Validator</th>
                    <th className="text-left px-4 py-3">Credit</th>
                    <th className="text-left px-4 py-3">Tier</th>
                    <th className="text-right px-4 py-3">Evals</th>
                    <th className="text-right px-4 py-3">Accuracy</th>
                    <th className="text-right px-4 py-3">Peer Acc.</th>
                    <th className="text-right px-4 py-3">Stake</th>
                    <th className="text-center px-4 py-3">Ready</th>
                    <th className="text-center px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {sorted.map((v, i) => {
                    const tier = getTier(v.credit);
                    const t = TIERS[tier];
                    return (
                      <tr key={v.address} className="hover:bg-bg-surface transition-colors group">
                        <td className="px-6 py-3 font-mono text-text-dim tabular-nums">{i + 1}</td>
                        <td className="px-4 py-3">
                          <Link href={`/validators/${v.address}`} className="font-mono text-sm group-hover:text-accent transition-colors">
                            {shortenAddress(v.address)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-accent/50" style={{ width: `${v.credit}%` }} />
                            </div>
                            <span className="font-mono text-xs tabular-nums text-text-muted">{v.credit}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-xs font-mono ${t.color}`}>{t.label}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.evalCount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">{v.accuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.peerAccuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.stake.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          {v.ready ? <span className="text-[10px] font-mono text-success">READY</span> : <span className="text-[10px] font-mono text-text-dim">—</span>}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${v.online ? "bg-success" : "bg-text-dim"}`} />
                        </td>
                      </tr>
                    );
                  })}
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
