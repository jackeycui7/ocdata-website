"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/mock";
import type { DatasetInfo } from "@/lib/mock";

export default function DatasetsClient({ datasets }: { datasets: DatasetInfo[] }) {
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"entries" | "created">("entries");
  const [search, setSearch] = useState("");

  const filtered = datasets
    .filter((ds) => status === "all" || ds.status === status)
    .filter((ds) => !search || ds.name.toLowerCase().includes(search.toLowerCase()) || ds.domains.some((d) => d.includes(search.toLowerCase())))
    .sort((a, b) => sort === "entries" ? b.entries - a.entries : b.createdAt.localeCompare(a.createdAt));

  const maxEntries = Math.max(...filtered.map((d) => d.entries), 1);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "entries" | "created")}
          className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
        >
          <option value="entries">Sort by Entries</option>
          <option value="created">Sort by Created</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search datasets..."
          className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent transition-colors flex-1 min-w-[160px]"
        />
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

        {filtered.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-text-dim">No datasets match your filters.</div>
        )}

        {filtered.map((ds) => (
          <Link
            key={ds.id}
            href={`/datasets/${ds.id}`}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border-subtle last:border-b-0 hover:bg-bg-surface transition-colors group"
          >
            <div className="col-span-3">
              <div className="text-sm font-medium group-hover:text-accent transition-colors">{ds.name}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${ds.status === "active" ? "bg-success" : ds.status === "paused" ? "bg-warn" : "bg-text-dim"}`} />
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
    </>
  );
}
