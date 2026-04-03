"use client";

import { useState } from "react";
import type { DatasetInfo } from "@/lib/mock";
import { shortenAddress } from "@/lib/mock";

const TABS = ["Overview", "Schema", "Submissions"] as const;
type Tab = typeof TABS[number];

interface SubmissionRow {
  url: string;
  miner: string;
  time: string;
  status: string;
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DatasetDetailClient({ ds, submissions }: { ds: DatasetInfo; submissions: SubmissionRow[] }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const schemaEntries = Object.entries(ds.schema);

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              tab === t ? "border-accent text-text" : "border-transparent text-text-dim hover:text-text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { label: "Total Entries", value: ds.entries.toLocaleString() },
              { label: "Schema Fields", value: String(ds.fields) },
              { label: "Domains", value: ds.domains.join(", ") },
              { label: "Refresh", value: ds.refresh },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className="font-mono text-lg font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Schema" && (
        <div className="space-y-6">
          <div className="border border-border rounded-lg overflow-hidden">
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
                      {spec.required ? <span className="text-success text-xs font-mono">yes</span> : <span className="text-text-dim text-xs font-mono">no</span>}
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
      )}

      {tab === "Submissions" && (
        <div className="border border-border rounded-lg overflow-hidden">
          {submissions.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                  <th className="text-left px-6 py-3">URL</th>
                  <th className="text-left px-4 py-3">Miner</th>
                  <th className="text-right px-4 py-3">Time</th>
                  <th className="text-center px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {submissions.map((s, i) => (
                  <tr key={i} className="hover:bg-bg-surface transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-text-muted truncate max-w-[240px]">{s.url}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">{shortenAddress(s.miner)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-dim text-right">{relativeTime(s.time)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${
                        s.status === "confirmed" ? "text-success" : s.status === "pending" ? "text-text-dim" : "text-danger"
                      }`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-text-dim">No submissions for this dataset yet.</div>
          )}
        </div>
      )}
    </>
  );
}
