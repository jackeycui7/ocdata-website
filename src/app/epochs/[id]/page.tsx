import { loadEpochs, loadEpochSettlement, loadEpochSnapshot } from "@/lib/data";
import { shortenAddress, formatNumber } from "@/lib/mock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EpochDetailClient from "@/components/EpochDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 30;

const STATUS_STYLE: Record<string, string> = {
  open: "text-success",
  completed: "text-text-muted",
  failed: "text-danger",
};

export default async function EpochDetailPage({ params }: { params: { id: string } }) {
  const epochs = await loadEpochs();
  const epoch = epochs.find((e) => e.id === params.id);
  if (!epoch) return notFound();

  const [settlement, snapshot] = await Promise.all([
    loadEpochSettlement(epoch.id),
    loadEpochSnapshot(epoch.id),
  ]);

  // Build miner results from settlement data if available, otherwise snapshot
  const minerResults = settlement?.miners.map((m) => ({
    address: m.miner_id,
    taskCount: m.task_count,
    avgScore: m.avg_score,
    qualified: m.qualified,
    confirmed: m.confirmed_submission_count,
    rejected: m.rejected_submission_count,
    reward: m.reward_amount,
  })) ?? (snapshot ? Object.entries(snapshot.miners).map(([address, s]) => ({
    address,
    taskCount: s.task_count,
    avgScore: s.avg_score,
    qualified: s.task_count >= 80 && s.avg_score >= 60,
    confirmed: 0,
    rejected: 0,
    reward: 0,
  })) : []);

  const validatorResults = settlement?.validators.map((v) => ({
    address: v.validator_id,
    evalCount: v.eval_count,
    accuracy: v.accuracy,
    peerAccuracy: v.peer_review_accuracy,
    qualified: v.qualified,
    reward: v.reward_amount,
    penalty: v.penalty_reason || "",
  })) ?? (snapshot ? Object.entries(snapshot.validators).map(([address, v]) => ({
    address,
    evalCount: v.eval_count,
    accuracy: v.accuracy,
    peerAccuracy: v.peer_review_accuracy,
    qualified: v.accuracy >= 60,
    reward: 0,
    penalty: "",
  })) : []);

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a href="/epochs" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">← Epochs</a>

          <div className="mt-4 mb-10 flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{epoch.startTime.split("T")[0]}</h1>
              <p className="text-text-muted text-sm mt-1">
                {epoch.startTime.split("T")[0]} → {epoch.endTime.split("T")[0]}
              </p>
            </div>
            <span className={`text-xs font-mono uppercase tracking-wider ${STATUS_STYLE[epoch.status] || "text-text-dim"}`}>
              {epoch.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total Submissions", value: String(epoch.summary.total) },
              { label: "Confirmed", value: String(epoch.summary.confirmed), color: "text-success" },
              { label: "Rejected", value: String(epoch.summary.rejected), color: "text-danger" },
              { label: "Qualified Miners", value: epoch.qualifiedMiners > 0 ? `${epoch.qualifiedMiners}/${epoch.totalMiners}` : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className={`font-mono text-lg font-semibold tabular-nums ${s.color || ""}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {minerResults.length > 0 || validatorResults.length > 0 ? (
            <EpochDetailClient minerResults={minerResults} validatorResults={validatorResults} />
          ) : (
            <div className="border border-border rounded-lg p-10 text-center">
              <p className="text-text-dim text-sm font-mono">
                {epoch.status === "open" ? "Epoch in progress — results available after settlement." : "No settlement data available for this epoch."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
