import { shortenAddress, TIERS, getTier, formatNumber } from "@/lib/mock";
import { loadAddressProfile, loadMinerEpochHistory } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MinerTrendChart from "@/components/charts/MinerTrendChart";
import { notFound } from "next/navigation";

export const revalidate = 30;

function estimateEarnings(avgScore: number, taskCount: number): string {
  if (taskCount < 80 || avgScore < 60) return "—";
  const weight = Math.pow(avgScore, 2) * taskCount;
  return formatNumber(Math.round(weight / 100));
}

export default async function MinerDetailPage({ params }: { params: { address: string } }) {
  const address = decodeURIComponent(params.address);
  const [profile, epochHistory] = await Promise.all([
    loadAddressProfile(address),
    loadMinerEpochHistory(address),
  ]);

  if (!profile?.miner) return notFound();

  const { miner, minerSummary, currentEpoch } = profile;
  const tier = getTier(miner.credit);
  const t = TIERS[tier];

  const curMiner = currentEpoch?.miner;
  const isQualifiedNow = curMiner ? curMiner.taskCount >= 80 && curMiner.avgScore >= 60 : false;

  const trendData = [...epochHistory].reverse().map((eh) => ({
    epoch: eh.epochId,
    submissions: eh.taskCount,
    avgScore: Number(eh.avgScore.toFixed(1)),
  }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a href="/miners" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">&larr; Miners</a>

          <div className="mt-4 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-mono text-2xl font-bold tracking-tight">{shortenAddress(address)}</h1>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${miner.online ? "bg-success" : "bg-text-dim"}`} />
              <span className={`text-xs font-mono ${t.color}`}>{t.label}</span>
            </div>
            <div className="font-mono text-xs text-text-dim break-all">{address}</div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Credit Score</span>
              <span className="font-mono text-sm font-semibold">{miner.credit}/100</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-accent/60 transition-all" style={{ width: `${miner.credit}%` }} />
            </div>
          </div>

          {/* Lifetime summary */}
          {minerSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
              {[
                { label: "Total Epochs", value: String(minerSummary.totalEpochs) },
                { label: "Total Tasks", value: minerSummary.totalTasks.toLocaleString() },
                { label: "Avg Score", value: minerSummary.avgScore.toFixed(1) },
                { label: "Total Earned", value: `${formatNumber(minerSummary.totalRewards)} $MINE` },
              ].map((s) => (
                <div key={s.label} className="bg-bg-surface p-5">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                  <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Current epoch real-time stats */}
          {curMiner && currentEpoch && (
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
                  { label: "Tasks", value: String(curMiner.taskCount) },
                  { label: "Avg Score", value: curMiner.avgScore.toFixed(1) },
                  { label: "Sampled", value: String(curMiner.sampledScoreCount) },
                  { label: "Qualified", value: isQualifiedNow ? "Yes" : `${curMiner.taskCount}/80` },
                  { label: "Est. Earnings", value: isQualifiedNow ? `~${estimateEarnings(curMiner.avgScore, curMiner.taskCount)} $MINE` : "—" },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-surface/80 p-5">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                    <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
                  </div>
                ))}
              </div>
              {!isQualifiedNow && curMiner.taskCount > 0 && (
                <div className="px-6 py-3 text-xs font-mono text-text-muted border-t border-accent/10">
                  Need {Math.max(0, 80 - curMiner.taskCount)} more tasks
                  {curMiner.avgScore < 60 && curMiner.avgScore > 0 ? ` and avg score >= 60 (currently ${curMiner.avgScore.toFixed(1)})` : ""}
                  {" "}to qualify
                </div>
              )}
            </div>
          )}

          {trendData.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border bg-bg-surface">
                <h2 className="text-sm font-semibold">Submission Trend</h2>
              </div>
              <div className="p-4">
                <MinerTrendChart data={trendData} />
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
                      <th className="text-right px-4 py-3">Tasks</th>
                      <th className="text-right px-4 py-3">Avg Score</th>
                      <th className="text-center px-4 py-3">Qualified</th>
                      <th className="text-right px-6 py-3">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {epochHistory.map((eh) => (
                      <tr key={eh.epochId} className="hover:bg-bg-surface transition-colors">
                        <td className="px-6 py-3 font-mono tabular-nums">{eh.epochId}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{eh.taskCount}</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">{eh.avgScore.toFixed(1)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-mono ${eh.qualified ? "text-success" : "text-danger"}`}>
                            {eh.qualified ? "yes" : "no"}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs tabular-nums text-right">{eh.qualified ? `${formatNumber(eh.rewardAmount)} $MINE` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-sm text-text-dim">No epoch history available for this miner.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
