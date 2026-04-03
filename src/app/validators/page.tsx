import { loadValidatorsFromEpoch } from "@/lib/data";
import { shortenAddress, formatNumber } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export default async function ValidatorsPage() {
  const data = await loadValidatorsFromEpoch();
  const validators = data?.validators ?? [];
  const sorted = [...validators].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Validators</h1>
            {data ? (
              <p className="text-xs font-mono text-text-dim mt-2">
                Data from epoch <span className="text-text-muted">{data.epochId}</span> settlement
              </p>
            ) : (
              <p className="text-xs font-mono text-text-dim mt-2">Sourced from latest completed epoch settlement</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total", value: String(validators.length) },
              { label: "Qualified", value: String(validators.filter((v) => v.qualified).length) },
              { label: "Avg Accuracy", value: validators.length > 0 ? (validators.reduce((s, v) => s + v.accuracy, 0) / validators.length).toFixed(1) + "%" : "—" },
              { label: "Total Rewards", value: validators.length > 0 ? formatNumber(validators.reduce((s, v) => s + v.reward, 0)) + " $aMine" : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-xl font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          {validators.length === 0 ? (
            <div className="border border-border rounded-lg py-20 flex flex-col items-center justify-center text-center">
              <p className="text-text-muted text-sm font-medium">No validators have participated in an epoch yet.</p>
              <p className="text-text-dim text-xs font-mono mt-2">Validator data will appear here once the first epoch with validators is settled.</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                      <th className="text-left px-6 py-3 w-8">#</th>
                      <th className="text-left px-4 py-3">Validator</th>
                      <th className="text-right px-4 py-3">Evals</th>
                      <th className="text-right px-4 py-3">Accuracy</th>
                      <th className="text-right px-4 py-3">Peer Acc.</th>
                      <th className="text-center px-4 py-3">Qualified</th>
                      <th className="text-right px-6 py-3">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {sorted.map((v, i) => (
                      <tr key={v.address} className="hover:bg-bg-surface transition-colors">
                        <td className="px-6 py-3 font-mono text-text-dim tabular-nums">{i + 1}</td>
                        <td className="px-4 py-3 font-mono text-sm">{shortenAddress(v.address)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.evalCount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right font-medium">{v.accuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{v.peerAccuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-mono ${v.qualified ? "text-success" : "text-danger"}`}>
                            {v.qualified ? "yes" : "no"}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs tabular-nums text-right">
                          {v.qualified ? formatNumber(v.reward) + " $aMine" : "—"}
                        </td>
                      </tr>
                    ))}
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
