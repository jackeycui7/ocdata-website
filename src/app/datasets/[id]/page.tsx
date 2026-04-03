import { loadDataset, loadRecentSubmissions } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DatasetDetailClient from "@/components/DatasetDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 30;

export default async function DatasetDetailPage({ params }: { params: { id: string } }) {
  const ds = await loadDataset(params.id);
  if (!ds) return notFound();

  const schemaEntries = Object.entries(ds.schema);
  const requiredCount = schemaEntries.filter(([, v]) => v.required).length;

  const allSubmissions = await loadRecentSubmissions();
  const dsSubmissions = allSubmissions
    .filter((s) => s.dataset_id === params.id)
    .slice(0, 20)
    .map((s) => ({
      url: s.original_url || s.normalized_url,
      miner: s.miner_id,
      time: s.created_at,
      status: s.status,
    }));

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <a href="/datasets" className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors">← Datasets</a>
            <div className="flex items-start justify-between flex-wrap gap-4 mt-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">{ds.name}</h1>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {ds.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ds.domains.map((d) => (
                    <span key={d} className="text-xs font-mono text-text-muted bg-bg-surface border border-border rounded px-2 py-0.5">{d}</span>
                  ))}
                </div>
                <div className="text-sm text-text-dim">
                  Created by <span className="font-mono text-text-muted">{ds.creator}</span> on {ds.createdAt}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">Refresh</div>
                <div className="font-mono text-sm">{ds.refresh}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-10">
            {[
              { label: "Total Entries", value: ds.entries.toLocaleString() },
              { label: "Active Miners", value: String(ds.miners) },
              { label: "Schema Fields", value: `${ds.fields} (${requiredCount} required)` },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>

          <DatasetDetailClient ds={ds} submissions={dsSubmissions} />
        </div>
      </main>
      <Footer />
    </>
  );
}
