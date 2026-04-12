import Link from "next/link";
import { loadEpochs } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 10;

const STATUS_STYLE: Record<string, string> = {
  open: "text-success",
  completed: "text-text-muted",
  failed: "text-danger",
};

// Test epochs without rewards
const TEST_EPOCHS = ["2026-04-06"];

export default async function EpochsPage() {
  const epochs = await loadEpochs();

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">History</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">Epochs</h1>
            <p className="text-text-muted text-sm mt-2">
              Each epoch lasts 1 day. Settlement occurs at UTC 12:00.
            </p>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim bg-bg-surface">
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Submissions</th>
                    <th className="text-right px-4 py-3">Confirmed</th>
                    <th className="text-right px-6 py-3">Rejected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {epochs.map((ep) => (
                    <tr key={ep.id} className="hover:bg-bg-surface transition-colors group">
                      <td className="px-6 py-3">
                        <Link
                          href={`/epochs/${ep.id}`}
                          className="font-mono tabular-nums group-hover:text-accent transition-colors"
                        >
                          {ep.startTime?.split("T")[0] ?? ep.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono uppercase tracking-wider ${STATUS_STYLE[ep.status] || "text-text-dim"}`}>
                          {ep.status}
                        </span>
                        {TEST_EPOCHS.includes(ep.startTime?.split("T")[0] ?? "") && (
                          <span className="ml-2 text-xs font-mono text-warning">(Test)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">
                        {ep.summary.total}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-success tabular-nums text-right">
                        {ep.summary.confirmed}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-danger tabular-nums text-right">
                        {ep.summary.rejected}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
