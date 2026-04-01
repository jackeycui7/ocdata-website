"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EpochEmissionData {
  epoch: string;
  minerPool: number;
  validatorPool: number;
  ownerPool: number;
}

export default function EpochEmissionChart({ data }: { data: EpochEmissionData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="epoch"
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#1e1e2e" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#555", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
          width={48}
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
          itemStyle={{ padding: 0 }}
        />
        <Legend
          iconType="plainline"
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)", paddingTop: 8 }}
        />
        <Line type="monotone" dataKey="minerPool" name="Miner Pool" stroke="#7c5cfc" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="validatorPool" name="Validator Pool" stroke="#5ce0d8" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="ownerPool" name="Owner Pool" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}
