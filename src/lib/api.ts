// API client for Platform Service
// Tries real API first, falls back to mock data if unavailable

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "http://101.47.73.95";

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
  schema: Record<string, { type: string; required: boolean }>;
  dedup_fields: string[];
  refresh_interval: string | null;
  created_at: string;
  updated_at: string;
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
  epoch_id: string;
  start_time: string;
  end_time: string;
  status: string;
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

export async function fetchMinersOnline(): Promise<ApiMinerOnline[] | null> {
  return apiFetch<ApiMinerOnline[]>("/api/mining/v1/miners/online");
}

export async function fetchEpochSnapshot(epochId: string): Promise<ApiEpochSnapshot | null> {
  return apiFetch<ApiEpochSnapshot>(`/api/mining/v1/epochs/${epochId}/snapshot`);
}

export async function fetchEpochSettlement(epochId: string): Promise<ApiEpochSettlement | null> {
  return apiFetch<ApiEpochSettlement>(`/api/mining/v1/epochs/${epochId}/settlement-results`);
}
