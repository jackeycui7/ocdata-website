// Mock data and types for the application
// Will be replaced with real API calls later

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

// --- Mock data ---

export const mockMiners: MinerStat[] = [
  { address: "0xA1b2C3d4E5f6789012345678901234567890abcd", credit: 92, tier: "excellent", taskCount: 1200, avgScore: 94.2, reward: 4184, online: true },
  { address: "0xB2c3D4e5F67890123456789012345678901bCDeF", credit: 85, tier: "excellent", taskCount: 980, avgScore: 91.8, reward: 3520, online: true },
  { address: "0xC3d4E5f678901234567890123456789012CdEf01", credit: 72, tier: "good", taskCount: 800, avgScore: 88.1, reward: 2340, online: true },
  { address: "0xD4e5F6789012345678901234567890123dEF0123", credit: 65, tier: "good", taskCount: 650, avgScore: 85.4, reward: 1890, online: false },
  { address: "0xE5f67890123456789012345678901234eF012345", credit: 48, tier: "normal", taskCount: 420, avgScore: 78.3, reward: 980, online: true },
  { address: "0xF678901234567890123456789012345f01234567", credit: 35, tier: "limited", taskCount: 280, avgScore: 72.1, reward: 540, online: true },
  { address: "0x0789012345678901234567890123456012345678", credit: 22, tier: "limited", taskCount: 150, avgScore: 66.8, reward: 220, online: false },
  { address: "0x1890123456789012345678901234561234567890", credit: 8, tier: "novice", taskCount: 90, avgScore: 62.4, reward: 85, online: true },
];

export const mockValidators: ValidatorStat[] = [
  { address: "0xVa1b2C3d4E5f6789012345678901234567890abc", credit: 88, tier: "excellent", evalCount: 4200, accuracy: 96.1, peerAccuracy: 93.4, stake: 5000, online: true, ready: true },
  { address: "0xVb2c3D4e5F67890123456789012345678901bCDe", credit: 76, tier: "good", evalCount: 2800, accuracy: 91.2, peerAccuracy: 88.7, stake: 3000, online: true, ready: true },
  { address: "0xVc3d4E5f678901234567890123456789012CdEf0", credit: 62, tier: "good", evalCount: 1500, accuracy: 84.5, peerAccuracy: 82.1, stake: 2000, online: true, ready: false },
  { address: "0xVd4e5F6789012345678901234567890123dEF012", credit: 45, tier: "normal", evalCount: 720, accuracy: 76.3, peerAccuracy: 74.8, stake: 1500, online: false, ready: false },
  { address: "0xVe5f67890123456789012345678901234eF01234", credit: 15, tier: "novice", evalCount: 144, accuracy: 68.2, peerAccuracy: 65.1, stake: 1000, online: true, ready: true },
];

export const mockDatasets: DatasetInfo[] = [
  {
    id: "ds_linkedin_profiles", name: "LinkedIn Profiles", status: "active",
    domains: ["linkedin.com"], entries: 31400, miners: 18, fields: 91, refresh: "30d",
    creator: "0x789...IJKL", createdAt: "2026-03-07",
    schema: { linkedin_num_id: { type: "string", required: true }, name: { type: "string", required: true }, headline: { type: "string", required: true }, location: { type: "string", required: false }, company: { type: "string", required: false }, industry: { type: "string", required: false }, connections: { type: "integer", required: false }, experience: { type: "string[]", required: true }, education: { type: "string[]", required: false }, skills: { type: "string[]", required: false }, profile_url: { type: "string", required: true } },
  },
  {
    id: "ds_amazon_products", name: "Amazon Products", status: "active",
    domains: ["amazon.com"], entries: 82100, miners: 32, fields: 98, refresh: "7d",
    creator: "0xDEF...5678", createdAt: "2026-03-08",
    schema: { asin: { type: "string", required: true }, title: { type: "string", required: true }, price: { type: "number", required: true }, currency: { type: "string", required: true }, rating: { type: "number", required: false }, review_count: { type: "integer", required: false }, availability: { type: "boolean", required: true }, categories: { type: "string[]", required: true }, images: { type: "string[]", required: false } },
  },
  {
    id: "ds_arxiv", name: "arXiv Papers", status: "active",
    domains: ["arxiv.org"], entries: 54200, miners: 28, fields: 88, refresh: "never",
    creator: "0x456...EFGH", createdAt: "2026-03-10",
    schema: { arxiv_id: { type: "string", required: true }, title: { type: "string", required: true }, authors: { type: "string[]", required: true }, abstract: { type: "string", required: true }, categories: { type: "string[]", required: true }, published: { type: "datetime", required: true }, pdf_url: { type: "string", required: false }, citations: { type: "integer", required: false } },
  },
  {
    id: "ds_wiki", name: "Wikipedia", status: "active",
    domains: ["wikipedia.org"], entries: 96800, miners: 38, fields: 70, refresh: "never",
    creator: "0x123...ABCD", createdAt: "2026-03-12",
    schema: { page_id: { type: "string", required: true }, title: { type: "string", required: true }, summary: { type: "string", required: true }, content: { type: "string", required: true }, language: { type: "string", required: true }, categories: { type: "string[]", required: true } },
  },
  {
    id: "ds_amazon_reviews", name: "Amazon Reviews", status: "active",
    domains: ["amazon.com"], entries: 45600, miners: 22, fields: 49, refresh: "7d",
    creator: "0xABC...1234", createdAt: "2026-03-14",
    schema: { review_id: { type: "string", required: true }, asin: { type: "string", required: true }, rating: { type: "number", required: true }, title: { type: "string", required: true }, content: { type: "string", required: true }, marketplace: { type: "string", required: true }, verified: { type: "boolean", required: false }, author: { type: "string", required: false }, date: { type: "datetime", required: true } },
  },
  {
    id: "ds_linkedin_jobs", name: "LinkedIn Jobs", status: "active",
    domains: ["linkedin.com"], entries: 28700, miners: 20, fields: 44, refresh: "1d",
    creator: "0xMNO...PQRS", createdAt: "2026-03-15",
    schema: { job_posting_id: { type: "string", required: true }, title: { type: "string", required: true }, company: { type: "string", required: true }, location: { type: "string", required: true }, description: { type: "string", required: true }, posted: { type: "datetime", required: true }, salary_range: { type: "string", required: false } },
  },
  {
    id: "ds_linkedin_company", name: "LinkedIn Company", status: "active",
    domains: ["linkedin.com"], entries: 18200, miners: 15, fields: 41, refresh: "30d",
    creator: "0xRST...UVWX", createdAt: "2026-03-16",
    schema: { company_id: { type: "string", required: true }, name: { type: "string", required: true }, industry: { type: "string", required: true }, size: { type: "string", required: false }, headquarters: { type: "string", required: false }, description: { type: "string", required: true }, website: { type: "string", required: false } },
  },
  {
    id: "ds_linkedin_posts", name: "LinkedIn Posts", status: "active",
    domains: ["linkedin.com"], entries: 22100, miners: 16, fields: 38, refresh: "never",
    creator: "0xYZA...BCDE", createdAt: "2026-03-17",
    schema: { post_id: { type: "string", required: true }, author: { type: "string", required: true }, content: { type: "string", required: true }, timestamp: { type: "datetime", required: true }, likes: { type: "integer", required: false }, comments: { type: "integer", required: false } },
  },
  {
    id: "ds_amazon_sellers", name: "Amazon Sellers", status: "active",
    domains: ["amazon.com"], entries: 12300, miners: 12, fields: 29, refresh: "30d",
    creator: "0xFGH...IJKL", createdAt: "2026-03-18",
    schema: { seller_id: { type: "string", required: true }, name: { type: "string", required: true }, marketplace: { type: "string", required: true }, rating: { type: "number", required: false }, feedback_count: { type: "integer", required: false } },
  },
];

export const mockEpochs: EpochInfo[] = Array.from({ length: 20 }, (_, i) => {
  // Generate date-based IDs (today = 2026-04-03, going back)
  const base_date = new Date(Date.UTC(2026, 3, 3)); // April 3, 2026
  base_date.setUTCDate(base_date.getUTCDate() - i);
  const dateStr = base_date.toISOString().split("T")[0];
  const id = `epoch_${dateStr.replace(/-/g, "")}`;
  const status: "open" | "completed" | "failed" = i === 0 ? "open" : "completed";
  const base = 500000 * Math.pow(0.996844, i);
  const total = i === 0 ? 0 : Math.round(base / 80);
  const confirmed = Math.round(total * 0.88);
  return {
    id,
    startTime: `${dateStr}T00:00:00Z`,
    endTime: `${dateStr}T23:59:59Z`,
    status,
    summary: { total, confirmed, rejected: total - confirmed },
    qualifiedMiners: i === 0 ? 0 : Math.max(80, 142 - i * 3 + (i % 4)),
    totalMiners: i === 0 ? 0 : Math.max(100, 160 - i * 2 + (i % 5)),
    totalEmission: i === 0 ? 0 : Math.round(base),
    minerPool: i === 0 ? 0 : Math.round(base * 0.41),
    validatorPool: i === 0 ? 0 : Math.round(base * 0.41),
    ownerPool: i === 0 ? 0 : Math.round(base * 0.18),
  };
});
