import { shortenAddress, TIERS, getTier, formatNumber } from "@/lib/mock";
import { loadAddressProfile, loadValidatorEpochHistory } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ValidatorTrendChart from "@/components/charts/ValidatorTrendChart";
import { notFound } from "next/navigation";

export const revalidate = 10;

function formatStake(wei: string): string {
  if (!wei || wei === "0") return "0 AWP";
  try {
    const num = BigInt(wei);
    const awp = Number(num / BigInt(10 ** 14)) / 10000;
    return `${awp.toLocaleString()} AWP`;
  } catch {
    return wei;
  }
}

export default async function ValidatorDetailPage({ params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const [profile, epochHistory] = await Promise.all([
    loadAddressProfile(address),
    loadValidatorEpochHistory(address),
  ]);

  if (!profile?.validator) return notFound();

  const { validator, validatorSummary, currentEpoch } = profile;
  const tier = getTier(validator.credit);
  const t = TIERS[tier];

  const curValidator = currentEpoch?.validator;

  const trendData = [...epochHistory].reverse().map((eh) => ({
    epoch: eh.epochId,
    accuracy: Number(eh.accuracy.toFixed(1)),
    peerAccuracy: Number(eh.peerReviewAccuracy.toFixed(1)),
  }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a href="/validators" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">&larr; Validators</a>

          <div className="mt-4 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-mono text-2xl font-bold tracking-tight">{shortenAddress(address)}</h1>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${validator.online ? "bg-success" : "bg-text-dim"}`} />
              <span className={`text-xs font-mono ${t.color}`}>{t.label}</span>
              {validator.eligible ? (
                <span className="text-xs font-mono text-success">Eligible</span>
              ) : (
                <span className="text-xs font-mono text-danger">Not Eligible</span>
              )}
            </div>
            <div className="font-mono text-xs text-text-dim break-all">{address}</div>
          </div>

          {/* Credit + Stake */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Credit Score</span>
                <span className="font-mono text-sm font-semibold">{validator.credit}/100</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-accent/60 transition-all" style={{ width: `${validator.credit}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">Stake</div>
              <div className="font-mono text-lg font-semibold">{formatStake(validator.stakeAmount)}</div>
            </div>
          </div>

          {/* Lifetime summary */}
          {validatorSummary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-lg overflow-hidden mb-10">
              {[
                { label: "Total Epochs", value: String(validatorSummary.totalEpochs) },
                { label: "Total Evals", value: validatorSummary.totalEvals.toLocaleString() },
                { label: "Avg Accuracy", value: validatorSummary.avgAccuracy.toFixed(1) + "%" },
                { label: "Total Earned", value: `${formatNumber(validatorSummary.totalRewards)} $aMine` },
                { label: "Slashed", value: validatorSummary.totalSlashed > 0 ? formatNumber(validatorSummary.totalSlashed) : "0" },
              ].map((s) => (
                <div key={s.label} className="bg-bg-surface p-5">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                  <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Current epoch real-time stats */}
          {curValidator && currentEpoch && (
            <div className="border border-accent/30 bg-accent/5 rounded-lg overflow-hidden mb-10">
              <div className="px-6 py-4 border-b border-accent/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <h2 className="text-sm font-semibold">Current Epoch</h2>
                </div>
                <span className="text-xs font-mono text-text-dim">{currentEpoch.epochId}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-accent/10">
                {[
                  { label: "Evaluations", value: String(curValidator.evalCount) },
                  { label: "Accuracy", value: curValidator.accuracy.toFixed(1) + "%" },
                  { label: "Golden Tasks", value: String(curValidator.goldenCount) },
                  { label: "Peer Reviews", value: String(curValidator.peerCount) },
                  { label: "Peer Accuracy", value: curValidator.peerReviewAccuracy.toFixed(1) + "%" },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-surface/80 p-5">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                    <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Also show miner info if this address is both miner and validator */}
          {profile.miner && (
            <div className="mb-10 border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Also a Miner</span>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${profile.miner.online ? "bg-success" : "bg-text-dim"}`} />
              </div>
              <a href={`/miners/${address}`} className="text-sm font-mono text-accent hover:text-accent-light transition-colors">
                View miner profile &rarr;
              </a>
            </div>
          )}

          {trendData.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border bg-bg-surface">
                <h2 className="text-sm font-semibold">Accuracy Trend</h2>
              </div>
              <div className="p-4">
                <ValidatorTrendChart data={trendData} />
              </div>
            </div>
          )}

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">Epoch History</h2>
            </div>
            {epochHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                      <th className="text-left px-6 py-3">Epoch</th>
                      <th className="text-right px-4 py-3">Evals</th>
                      <th className="text-right px-4 py-3">Accuracy</th>
                      <th className="text-right px-4 py-3">Peer Acc.</th>
                      <th className="text-center px-4 py-3">Qualified</th>
                      <th className="text-right px-6 py-3">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {epochHistory.map((eh) => (
                      <tr key={eh.epochId} className="hover:bg-bg-surface transition-colors">
                        <td className="px-6 py-3 font-mono tabular-nums">{eh.epochId}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{eh.evalCount}</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{eh.accuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{eh.peerReviewAccuracy.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-mono ${eh.qualified ? "text-success" : "text-danger"}`}>
                            {eh.qualified ? "yes" : "no"}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs tabular-nums text-right">{eh.qualified ? `${formatNumber(eh.rewardAmount)} $aMine` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-sm text-text-dim">No epoch history available for this validator.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
