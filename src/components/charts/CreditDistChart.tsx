"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CreditDistItem {
  tier: string;
  label: string;
  count: number;
  color: string;
}

const TIER_COLORS: Record<string, string> = {
  excellent: "#7c5cfc",
  good: "#9d85fd",
  normal: "#5ce0d8",
  limited: "#f59e0b",
  novice: "#555555",
};

export default function CreditDistChart({ data }: { data: CreditDistItem[] }) {
  const filtered = data.filter((d) => d.count > 0);

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={filtered}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={54}
            strokeWidth={0}
          >
            {filtered.map((d) => (
              <Cell key={d.tier} fill={TIER_COLORS[d.tier] || "#555"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#12121a",
              border: "1px solid #1e1e2e",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "var(--font-mono)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 flex-1">
        {data.map((d) => (
          <div key={d.tier} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: TIER_COLORS[d.tier] || "#555" }} />
            <span className="text-text-muted flex-1">{d.label}</span>
            <span className="font-mono tabular-nums text-text-dim">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
