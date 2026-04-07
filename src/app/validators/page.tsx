import { loadValidatorsFromEpoch, loadValidatorsOnline } from "@/lib/data";
import { shortenAddress, formatNumber, getTier, TIERS } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export default async function ValidatorsPage() {
  const [settlementData, onlineValidators] = await Promise.all([
    loadValidatorsFromEpoch(),
    loadValidatorsOnline(),
  ]);

  const hasSettlement = settlementData && settlementData.validators.length > 0;

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Validators</h1>
            {hasSettlement ? (
              <p className="text-xs font-mono text-text-dim mt-2">
                Settlement data from epoch <span className="text-text-muted">{settlementData.epochId}</span>
                {onlineValidators.length > 0 && (
                  <span> · <span className="text-success">{onlineValidators.filter((v) => v.online).length} online now</span></span>
                )}
              </p>
            ) : (
              <p className="text-xs font-mono text-text-dim mt-2">
                {onlineValidators.length > 0
                  ? <><span className="text-success">{onlineValidators.filter((v) => v.online).length} validators online</span> · settlement data available after first epoch completes</>
                  : "Validator data will appear here once the first epoch with validators is settled."}
              </p>
            )}
          </div>

          {hasSettlement ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
                {[
                  { label: "Total", value: String(settlementData.validators.length) },
                  { label: "Qualified", value: String(settlementData.validators.filter((v) => v.qualified).length) },
                  { label: "Avg Accuracy", value: (settlementData.validators.reduce((s, v) => s + v.accuracy, 0) / settlementData.validators.length).toFixed(1) + "%" },
                  { label: "Total Rewards", value: formatNumber(settlementData.validators.reduce((s, v) => s + v.reward, 0)) + " $aMine" },
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
                        <th className="text-right px-4 py-3">Evals</th>
                        <th className="text-right px-4 py-3">Accuracy</th>
                        <th className="text-right px-4 py-3">Peer Acc.</th>
                        <th className="text-center px-4 py-3">Qualified</th>
                        <th className="text-right px-6 py-3">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {[...settlementData.validators].sort((a, b) => b.accuracy - a.accuracy).map((v, i) => {
                        const isOnline = onlineValidators.some((o) => o.address.toLowerCase() === v.address.toLowerCase() && o.online);
                        return (
                          <tr key={v.address} className="hover:bg-bg-surface transition-colors">
                            <td className="px-6 py-3 font-mono text-text-dim tabular-nums">{i + 1}</td>
                            <td className="px-4 py-3 font-mono text-sm">
                              <span>{shortenAddress(v.address)}</span>
                              {isOnline && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-success align-middle" />}
                            </td>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : onlineValidators.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
                {[
                  { label: "Total Online", value: String(onlineValidators.filter((v) => v.online).length) },
                  { label: "Eligible", value: String(onlineValidators.filter((v) => v.eligible).length) },
                  { label: "Ready", value: String(onlineValidators.filter((v) => v.ready).length) },
                  { label: "Avg Credit", value: onlineValidators.length > 0 ? (onlineValidators.reduce((s, v) => s + v.credit, 0) / onlineValidators.length).toFixed(0) : "—" },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-surface p-5">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                    <div className="font-mono text-xl font-semibold tabular-nums">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-3 border-b border-border bg-bg-surface text-xs font-mono text-text-dim">
                  Live online validators · epoch settlement data available after first epoch completes
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                        <th className="text-left px-6 py-3 w-8">#</th>
                        <th className="text-left px-4 py-3">Validator</th>
                        <th className="text-left px-4 py-3">Client</th>
                        <th className="text-center px-4 py-3">Credit</th>
                        <th className="text-center px-4 py-3">Tier</th>
                        <th className="text-center px-4 py-3">Eligible</th>
                        <th className="text-center px-6 py-3">Ready</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {onlineValidators.filter((v) => v.online).map((v, i) => {
                        const tier = getTier(v.credit);
                        return (
                          <tr key={v.address} className="hover:bg-bg-surface transition-colors">
                            <td className="px-6 py-3 font-mono text-text-dim tabular-nums">{i + 1}</td>
                            <td className="px-4 py-3 font-mono text-sm">
                              <span>{shortenAddress(v.address)}</span>
                              <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-success align-middle" />
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-text-dim">{v.client}</td>
                            <td className="px-4 py-3 font-mono text-xs tabular-nums text-center">{v.credit}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-mono ${TIERS[tier]?.color ?? "text-text-dim"}`}>
                                {TIERS[tier]?.label ?? tier}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-mono ${v.eligible ? "text-success" : "text-text-dim"}`}>
                                {v.eligible ? "yes" : "no"}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className={`text-xs font-mono ${v.ready ? "text-success" : "text-text-dim"}`}>
                                {v.ready ? "yes" : "no"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="border border-border rounded-lg py-20 flex flex-col items-center justify-center text-center">
              <p className="text-text-muted text-sm font-medium">No validators are currently online.</p>
              <p className="text-text-dim text-xs font-mono mt-2">Validator data will appear here once the first epoch with validators is settled.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
