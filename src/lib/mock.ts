// Shared types and utility functions

export interface MinerStat {
  address: string;
  credit: number;
  tier: string;
  taskCount: number;
  avgScore: number;
  reward: number;
  online: boolean;
}

export interface ValidatorStat {
  address: string;
  credit: number;
  tier: string;
  evalCount: number;
  accuracy: number;
  peerAccuracy: number;
  stake: number;
  online: boolean;
  ready: boolean;
}

export interface DatasetInfo {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  domains: string[];
  entries: number;
  miners: number;
  fields: number;
  refresh: string;
  creator: string;
  createdAt: string;
  schema: Record<string, { type: string; required: boolean }>;
}

export interface EpochInfo {
  id: string;           // "epoch_20260402"
  startTime: string;
  endTime: string;
  status: "open" | "completed" | "failed";
  summary: { total: number; confirmed: number; rejected: number };
  qualifiedMiners: number;
  totalMiners: number;
  totalEmission: number;
  minerPool: number;
  validatorPool: number;
  ownerPool: number;
}

export const TIERS: Record<string, { label: string; color: string }> = {
  novice: { label: "Novice", color: "text-text-dim" },
  limited: { label: "Limited", color: "text-warn" },
  normal: { label: "Normal", color: "text-cyan" },
  good: { label: "Good", color: "text-accent-light" },
  excellent: { label: "Excellent", color: "text-accent" },
};

export function getTier(credit: number): string {
  if (credit >= 80) return "excellent";
  if (credit >= 60) return "good";
  if (credit >= 40) return "normal";
  if (credit >= 20) return "limited";
  return "novice";
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

