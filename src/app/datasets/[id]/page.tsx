import { loadDataset } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export const revalidate = 30;

export default async function DatasetDetailPage({ params }: { params: { id: string } }) {
  const ds = await loadDataset(params.id);
  if (!ds) return notFound();

  const schemaEntries = Object.entries(ds.schema);
  const requiredCount = schemaEntries.filter(([, v]) => v.required).length;

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

          <div className="border border-border rounded-lg overflow-hidden mb-10">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">Schema</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                  <th className="text-left px-6 py-3">Field</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-center px-4 py-3">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {schemaEntries.map(([field, spec]) => (
                  <tr key={field} className="hover:bg-bg-surface transition-colors">
                    <td className="px-6 py-3 font-mono text-sm">{field}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">{spec.type}</td>
                    <td className="px-4 py-3 text-center">
                      {spec.required ? (
                        <span className="text-success text-xs font-mono">yes</span>
                      ) : (
                        <span className="text-text-dim text-xs font-mono">no</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-bg-surface">
              <h2 className="text-sm font-semibold">Schema JSON</h2>
            </div>
            <pre className="p-6 text-xs font-mono text-text-muted overflow-x-auto leading-6">
              {JSON.stringify(ds.schema, null, 2)}
            </pre>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
