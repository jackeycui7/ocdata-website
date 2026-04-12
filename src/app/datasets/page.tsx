import Link from "next/link";
import { loadDatasets } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DatasetsClient from "@/components/DatasetsClient";

export const revalidate = 0;

export default async function DatasetsPage() {
  const datasets = await loadDatasets();

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

          <DatasetsClient datasets={datasets} />
        </div>
      </main>
      <Footer />
    </>
  );
}
