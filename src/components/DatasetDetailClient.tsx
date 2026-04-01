"use client";

import { useState } from "react";
import type { DatasetInfo } from "@/lib/mock";
import { shortenAddress } from "@/lib/mock";

const TABS = ["Overview", "Schema", "Submissions", "Miners"] as const;
type Tab = typeof TABS[number];

// Mock submissions for the dataset
function mockSubmissions() {
  const miners = ["0xA1b2C3d4E5f6789012345678901234567890abcd", "0xB2c3D4e5F67890123456789012345678901bCDeF", "0xC3d4E5f678901234567890123456789012CdEf01"];
  return Array.from({ length: 12 }, (_, i) => ({
    url: `https://example.com/page-${1000 + i}`,
    miner: miners[i % miners.length],
    time: `${i * 3 + 1}m ago`,
    status: i < 8 ? "confirmed" : i < 10 ? "pending" : "rejected",
  }));
}

function mockDatasetMiners() {
  return [
    { address: "0xA1b2C3d4E5f6789012345678901234567890abcd", submissions: 420, avgScore: 94.2 },
    { address: "0xB2c3D4e5F67890123456789012345678901bCDeF", submissions: 310, avgScore: 91.8 },
    { address: "0xC3d4E5f678901234567890123456789012CdEf01", submissions: 180, avgScore: 88.1 },
    { address: "0xD4e5F6789012345678901234567890123dEF0123", submissions: 95, avgScore: 85.4 },
  ];
}

export default function DatasetDetailClient({ ds }: { ds: DatasetInfo }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const schemaEntries = Object.entries(ds.schema);
  const submissions = mockSubmissions();
  const dsMiners = mockDatasetMiners();

  const confirmed = Math.round(ds.entries * 0.82);
  const pending = Math.round(ds.entries * 0.12);
  const rejected = ds.entries - confirmed - pending;

  return (
    <>
      {/* Tab bar */}
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

      {/* Overview */}
      {tab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { label: "Total Entries", value: ds.entries.toLocaleString() },
              { label: "Confirmed", value: confirmed.toLocaleString(), color: "text-success" },
              { label: "Pending", value: pending.toLocaleString(), color: "text-text-muted" },
              { label: "Rejected", value: rejected.toLocaleString(), color: "text-danger" },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface p-5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                <div className={`font-mono text-lg font-semibold tabular-nums ${s.color || ""}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="border border-border rounded-lg p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">Submission Distribution</div>
            <div className="flex h-3 rounded-full overflow-hidden bg-border">
              <div className="bg-success/60 h-full" style={{ width: `${(confirmed / ds.entries) * 100}%` }} />
              <div className="bg-text-muted/30 h-full" style={{ width: `${(pending / ds.entries) * 100}%` }} />
              <div className="bg-danger/40 h-full" style={{ width: `${(rejected / ds.entries) * 100}%` }} />
            </div>
            <div className="flex gap-6 mt-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-success/60" />Confirmed {((confirmed / ds.entries) * 100).toFixed(0)}%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-text-muted/30" />Pending {((pending / ds.entries) * 100).toFixed(0)}%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-danger/40" />Rejected {((rejected / ds.entries) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Schema */}
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

      {/* Submissions */}
      {tab === "Submissions" && (
        <div className="border border-border rounded-lg overflow-hidden">
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
                  <td className="px-4 py-3 font-mono text-xs text-text-dim text-right">{s.time}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      s.status === "confirmed" ? "text-success" : s.status === "pending" ? "text-text-dim" : "text-danger"
                    }`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Miners */}
      {tab === "Miners" && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                <th className="text-left px-6 py-3">Miner</th>
                <th className="text-right px-4 py-3">Submissions</th>
                <th className="text-right px-6 py-3">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {dsMiners.map((m) => (
                <tr key={m.address} className="hover:bg-bg-surface transition-colors">
                  <td className="px-6 py-3 font-mono text-sm">{shortenAddress(m.address)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted tabular-nums text-right">{m.submissions}</td>
                  <td className="px-6 py-3 font-mono text-xs tabular-nums text-right">{m.avgScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
