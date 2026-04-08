// API client for Platform Service

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
  meta?: { request_id: string };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${PLATFORM_API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json: ApiResponse<T> = await res.json();
    if (!json.success) return null;
    return json.data;
  } catch {
    return null;
  }
}

// --- Core Module: /api/core/v1/* ---

export interface ApiDataset {
  dataset_id: string;
  name: string;
  creator: string;
  creation_fee: string;
  status: string;
  source_domains: string[];
  schema: Record<string, unknown>;
  dedup_fields: string[];
  url_patterns?: string[];
  refresh_interval?: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  // reviewed_by is intentionally omitted — internal field, not displayed
  total_entries: number;
}

export interface ApiSubmission {
  id: string;
  dataset_id: string;
  miner_id: string;
  epoch_id: string;
  original_url: string;
  normalized_url: string;
  dedup_hash: string;
  status: string;
  crawl_timestamp: string;
  created_at: string;
}

export interface ApiEpoch {
  id: string;           // e.g. "epoch_20260402"
  epoch_id: string;     // e.g. "2026-04-02" (date string)
  status: "open" | "completed" | "failed";
  summary: {
    total: number;
    confirmed: number;
    rejected: number;
  };
  window_start_at: string;
  window_end_at: string;
  settlement_started_at?: string;
  settlement_completed_at?: string;
  created_at: string;
  updated_at?: string;
}

export async function fetchDatasets(): Promise<ApiDataset[] | null> {
  return apiFetch<ApiDataset[]>("/api/core/v1/datasets?page=1&page_size=100");
}

export async function fetchDataset(id: string): Promise<ApiDataset | null> {
  return apiFetch<ApiDataset>(`/api/core/v1/datasets/${id}`);
}

export async function fetchSubmissions(page = 1, pageSize = 20): Promise<ApiSubmission[] | null> {
  return apiFetch<ApiSubmission[]>(`/api/core/v1/submissions?page=${page}&page_size=${pageSize}`);
}

export async function fetchCoreEpochs(page = 1, pageSize = 20): Promise<ApiEpoch[] | null> {
  return apiFetch<ApiEpoch[]>(`/api/core/v1/epochs?page=${page}&page_size=${pageSize}`);
}

export async function fetchCurrentEpoch(): Promise<ApiEpoch | null> {
  return apiFetch<ApiEpoch>("/api/core/v1/epochs/current");
}

// --- Public API: /api/public/v1/* ---

export interface ApiPublicStats {
  online_miners: number;
  online_validators: number;
  current_epoch: string;
}

export async function fetchPublicStats(): Promise<ApiPublicStats | null> {
  return apiFetch<ApiPublicStats>("/api/public/v1/stats");
}

// --- Mining Module: /api/mining/v1/* ---

export interface ApiMinerOnline {
  miner_id: string;
  client: string;
  last_heartbeat_at: string;
  online: boolean;
  credit: number;
}

export interface ApiEpochSnapshot {
  epoch_id: string;
  miners: Record<string, {
    task_count: number;
    avg_score: number;
  }>;
  validators: Record<string, {
    eval_count: number;
    accuracy: number;
    peer_review_accuracy: number;
    consecutive_idle: number;
  }>;
}

export interface ApiEpochSettlement {
  epoch_id: string;
  miners: Array<{
    miner_id: string;
    task_count: number;
    avg_score: number;
    qualified: boolean;
    weight: number;
    reward_amount: number;
    confirmed_submission_count: number;
    rejected_submission_count: number;
  }>;
  validators: Array<{
    validator_id: string;
    eval_count: number;
    accuracy: number;
    peer_review_accuracy: number;
    consecutive_idle: number;
    qualified: boolean;
    weight: number;
    reward_amount: number;
    slashed_amount: number;
    redistributed_amount: number;
    penalty_reason: string;
  }>;
}

export interface ApiValidatorOnline {
  validator_id: string;
  client: string;
  last_heartbeat_at: string;
  online: boolean;
  credit: number;
  eligible: boolean;
  ready: boolean;
}

export interface ApiMinerPublic {
  miner_id: string;
  credit: number;
  credit_tier: string;
  online: boolean;
  client?: string;
  last_heartbeat_at?: string;
}

export interface ApiMinerEpochHistory {
  epoch_id: string;
  task_count: number;
  avg_score: number;
  qualified: boolean;
  weight: number;
  reward_amount: number;
}

export async function fetchMinersOnline(): Promise<ApiMinerOnline[] | null> {
  return apiFetch<ApiMinerOnline[]>("/api/mining/v1/miners/online");
}

export async function fetchAllMiners(): Promise<ApiMinerPublic[] | null> {
  return apiFetch<ApiMinerPublic[]>("/api/mining/v1/miners");
}

export async function fetchMinerPublic(address: string): Promise<ApiMinerPublic | null> {
  return apiFetch<ApiMinerPublic>(`/api/mining/v1/profiles/miners/${address}`);
}

export async function fetchMinerEpochHistory(address: string): Promise<ApiMinerEpochHistory[] | null> {
  return apiFetch<ApiMinerEpochHistory[]>(`/api/mining/v1/profiles/miners/${address}/epochs`);
}

export interface ApiValidatorEpochHistory {
  epoch_id: string;
  eval_count: number;
  golden_count: number;
  peer_count: number;
  accuracy: number;
  peer_review_accuracy: number;
  qualified: boolean;
  reward_amount: number;
}

export async function fetchValidatorEpochHistory(address: string): Promise<ApiValidatorEpochHistory[] | null> {
  return apiFetch<ApiValidatorEpochHistory[]>(`/api/mining/v1/profiles/validators/${address}/epochs`);
}

// --- Unified Address Profile (includes current epoch real-time stats) ---

export interface ApiCurrentEpochMinerStats {
  task_count: number;
  pending_submission_count: number;
  repeat_task_count: number;
  sampled_score_count: number;
  avg_score: number;
}

export interface ApiCurrentEpochValidatorStats {
  eval_count: number;
  golden_count: number;
  peer_count: number;
  accuracy: number;
  peer_review_accuracy: number;
}

export interface ApiAddressProfile {
  address: string;
  miner?: {
    miner_id: string;
    credit: number;
    credit_tier: string;
    online: boolean;
  };
  validator?: {
    validator_id: string;
    credit: number;
    eligible: boolean;
    online: boolean;
    stake_amount: string;
  };
  miner_summary?: {
    total_epochs: number;
    total_tasks: number;
    total_rewards: number;
    avg_score: number;
  };
  validator_summary?: {
    total_epochs: number;
    total_evals: number;
    total_rewards: number;
    total_slashed: number;
    avg_accuracy: number;
  };
  current_epoch?: {
    epoch_id: string;
    miner?: ApiCurrentEpochMinerStats;
    validator?: ApiCurrentEpochValidatorStats;
  };
}

export async function fetchAddressProfile(address: string): Promise<ApiAddressProfile | null> {
  return apiFetch<ApiAddressProfile>(`/api/mining/v1/profiles/${address}`);
}

export async function fetchValidatorsOnline(): Promise<ApiValidatorOnline[] | null> {
  return apiFetch<ApiValidatorOnline[]>("/api/mining/v1/validators/online");
}

export async function fetchEpochSnapshot(epochId: string): Promise<ApiEpochSnapshot | null> {
  return apiFetch<ApiEpochSnapshot>(`/api/mining/v1/epochs/${epochId}/snapshot`);
}

export async function fetchEpochSettlement(epochId: string): Promise<ApiEpochSettlement | null> {
  return apiFetch<ApiEpochSettlement>(`/api/mining/v1/epochs/${epochId}/settlement-results`);
}
