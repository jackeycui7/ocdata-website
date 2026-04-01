import Link from "next/link";
import { formatNumber } from "@/lib/mock";
import { loadDatasets } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export default async function DatasetsPage() {
  const datasets = await loadDatasets();
  const maxEntries = Math.max(...datasets.map((d) => d.entries), 1);

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Network</span>
              <h1 className="text-3xl font-bold mt-2 tracking-tight">DataSets</h1>
              <p className="text-text-muted text-sm mt-2 max-w-lg">
                Each DataSet defines a schema for a category of structured data. Miners choose which to contribute to.
              </p>
            </div>
            <Link
              href="/datasets/create"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bg bg-text rounded-lg hover:bg-text-muted transition-colors"
            >
              Create DataSet
            </Link>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-mono uppercase tracking-wider text-text-dim border-b border-border bg-bg-surface">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Domain</div>
              <div className="col-span-3 hidden sm:block">Entries</div>
              <div className="col-span-1 hidden md:block">Miners</div>
              <div className="col-span-1 hidden md:block">Fields</div>
              <div className="col-span-4 sm:col-span-2 text-right">Refresh</div>
            </div>

            {datasets.map((ds) => (
              <Link
                key={ds.id}
                href={`/datasets/${ds.id}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border-subtle last:border-b-0 hover:bg-bg-surface transition-colors group"
              >
                <div className="col-span-3">
                  <div className="text-sm font-medium group-hover:text-accent transition-colors">{ds.name}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-[10px] font-mono text-text-dim uppercase">{ds.status}</span>
                  </div>
                </div>
                <div className="col-span-2 font-mono text-xs text-text-muted truncate">{ds.domains[0]}</div>
                <div className="col-span-3 hidden sm:flex items-center gap-3">
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-accent/40" style={{ width: `${(ds.entries / maxEntries) * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-text-muted tabular-nums w-14 text-right">{formatNumber(ds.entries)}</span>
                </div>
                <div className="col-span-1 hidden md:block font-mono text-xs text-text-muted tabular-nums">{ds.miners}</div>
                <div className="col-span-1 hidden md:block font-mono text-xs text-text-muted tabular-nums">{ds.fields}</div>
                <div className="col-span-4 sm:col-span-2 font-mono text-xs text-text-dim text-right">{ds.refresh}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
