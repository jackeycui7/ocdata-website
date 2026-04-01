import { formatNumber } from "@/lib/mock";
import { loadEpochs, loadMiners, loadValidators } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EpochDetailClient from "@/components/EpochDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 30;

export default async function EpochDetailPage({ params }: { params: { id: string } }) {
  const epochs = await loadEpochs();
  const epoch = epochs.find((e) => String(e.id) === params.id);
  if (!epoch) return notFound();

  const miners = await loadMiners();
  const validators = await loadValidators();

  const minerResults = miners.map((m) => ({
    address: m.address,
    taskCount: m.taskCount,
    avgScore: m.avgScore,
    qualified: m.taskCount >= 80 && m.avgScore >= 60,
    confirmed: m.taskCount >= 80 && m.avgScore >= 60 ? m.taskCount : 0,
    rejected: m.taskCount >= 80 && m.avgScore >= 60 ? 0 : m.taskCount,
    reward: m.reward,
  }));

  const qualifiedValidators = validators.filter((v) => v.accuracy >= 60);
  const validatorResults = validators.map((v) => ({
    address: v.address,
    evalCount: v.evalCount,
    accuracy: v.accuracy,
    peerAccuracy: v.peerAccuracy,
    qualified: v.accuracy >= 60,
    reward: v.accuracy >= 60 ? Math.round(epoch.validatorPool / (qualifiedValidators.length || 1)) : 0,
    penalty: v.accuracy < 40 ? "slashed" : "",
  }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <a href="/epochs" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">← Epochs</a>

          <div className="mt-4 mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Epoch #{epoch.id}</h1>
            <p className="text-text-muted text-sm mt-2">{epoch.startTime.split("T")[0]}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total Emission", value: formatNumber(epoch.totalEmission) + " $aMine" },
              { label: "Miner Pool (41%)", value: formatNumber(epoch.minerPool) },
              { label: "Validator Pool (41%)", value: formatNumber(epoch.validatorPool) },
              { label: "Owner (18%)", value: formatNumber(epoch.ownerPool) },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          <EpochDetailClient minerResults={minerResults} validatorResults={validatorResults} />
        </div>
      </main>
      <Footer />
    </>
  );
}
