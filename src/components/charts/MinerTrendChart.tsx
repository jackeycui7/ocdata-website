"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TrendData {
  epoch: string;
  submissions: number;
  avgScore: number;
}

export default function MinerTrendChart({ data }: { data: TrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="epoch"
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#1e1e2e" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "#12121a",
            border: "1px solid #1e1e2e",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
          }}
          labelStyle={{ color: "#888" }}
        />
        <Line yAxisId="left" type="monotone" dataKey="submissions" name="Submissions" stroke="#7c5cfc" strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="avgScore" name="Avg Score" stroke="#5ce0d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
