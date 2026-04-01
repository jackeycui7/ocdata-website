"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TrendData {
  epoch: string;
  accuracy: number;
  peerAccuracy: number;
}

export default function ValidatorTrendChart({ data }: { data: TrendData[] }) {
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
          domain={[50, 100]}
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          width={36}
          tickFormatter={(v: number) => `${v}%`}
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
          formatter={(v) => `${Number(v).toFixed(1)}%`}
        />
        <Line type="monotone" dataKey="accuracy" name="Golden Accuracy" stroke="#7c5cfc" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="peerAccuracy" name="Peer Accuracy" stroke="#5ce0d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
