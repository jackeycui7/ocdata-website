// Unified data loader: tries real API, falls back to mock
// When API auth is resolved, just set NEXT_PUBLIC_PLATFORM_API and data flows through

import * as api from "./api";
import {
  mockDatasets,
  mockMiners,
  mockValidators,
  mockEpochs,
  type DatasetInfo,
  type MinerStat,
  type ValidatorStat,
  type EpochInfo,
  getTier,
} from "./mock";

// --- Datasets ---

export async function loadDatasets(): Promise<DatasetInfo[]> {
  const remote = await api.fetchDatasets();
  if (remote && remote.length > 0) {
    return remote.map((d) => ({
      id: d.dataset_id,
      name: d.name,
      status: d.status as DatasetInfo["status"],
      domains: d.source_domains,
      entries: d.total_entries,
      miners: 0, // not available from core API directly
      fields: Object.keys(d.schema).length,
      refresh: d.refresh_interval || "never",
      creator: d.creator,
      createdAt: d.created_at?.split("T")[0] || "",
      schema: d.schema,
    }));
  }
  return mockDatasets;
}

export async function loadDataset(id: string): Promise<DatasetInfo | null> {
  const remote = await api.fetchDataset(id);
  if (remote) {
    return {
      id: remote.dataset_id,
      name: remote.name,
      status: remote.status as DatasetInfo["status"],
      domains: remote.source_domains,
      entries: remote.total_entries,
      miners: 0,
      fields: Object.keys(remote.schema).length,
      refresh: remote.refresh_interval || "never",
      creator: remote.creator,
      createdAt: remote.created_at?.split("T")[0] || "",
      schema: remote.schema,
    };
  }
  return mockDatasets.find((d) => d.id === id) || null;
}

// --- Miners ---

export async function loadMiners(): Promise<MinerStat[]> {
  const remote = await api.fetchMinersOnline();
  if (remote && remote.length > 0) {
    return remote.map((m) => ({
      address: m.miner_id,
      credit: m.credit,
      tier: getTier(m.credit),
      taskCount: 0, // need epoch snapshot for this
      avgScore: 0,
      reward: 0,
      online: m.online,
    }));
  }
  return mockMiners;
}

// --- Validators ---
// No public list endpoint yet, use mock

export async function loadValidators(): Promise<ValidatorStat[]> {
  return mockValidators;
}

// --- Epochs ---

export async function loadEpochs(): Promise<EpochInfo[]> {
  const remote = await api.fetchCoreEpochs(1, 30);
  if (remote && remote.length > 0) {
    return remote.map((e) => ({
      id: parseInt(e.epoch_id) || 0,
      startTime: e.start_time,
      endTime: e.end_time,
      qualifiedMiners: 0,
      totalMiners: 0,
      totalEmission: 0,
      minerPool: 0,
      validatorPool: 0,
      ownerPool: 0,
    }));
  }
  return mockEpochs;
}

export interface EpochSettlementData {
  epochId: string;
  miners: api.ApiEpochSettlement["miners"];
  validators: api.ApiEpochSettlement["validators"];
}

export async function loadEpochSettlement(epochId: string): Promise<EpochSettlementData | null> {
  const remote = await api.fetchEpochSettlement(epochId);
  if (remote) {
    return {
      epochId: remote.epoch_id,
      miners: remote.miners,
      validators: remote.validators,
    };
  }
  return null; // pages will fall back to mock-based rendering
}

export async function loadEpochSnapshot(epochId: string): Promise<api.ApiEpochSnapshot | null> {
  return api.fetchEpochSnapshot(epochId);
}

// --- Dashboard stats ---

export interface DashboardStats {
  currentEpoch: number;
  minersOnline: number;
  minersTotal: number;
  validatorsOnline: number;
  validatorsTotal: number;
  totalSubmissions: number;
  totalEvaluations: number;
  datasetCount: number;
  source: "api" | "mock";
}

export async function loadDashboardStats(): Promise<DashboardStats> {
  const [miners, datasets] = await Promise.all([
    api.fetchMinersOnline(),
    api.fetchDatasets(),
  ]);

  if (miners) {
    return {
      currentEpoch: 0, // would need epoch API
      minersOnline: miners.filter((m) => m.online).length,
      minersTotal: miners.length,
      validatorsOnline: mockValidators.filter((v) => v.online).length,
      validatorsTotal: mockValidators.length,
      totalSubmissions: 0,
      totalEvaluations: 0,
      datasetCount: datasets?.length || mockDatasets.length,
      source: "api",
    };
  }

  return {
    currentEpoch: mockEpochs[0].id,
    minersOnline: mockMiners.filter((m) => m.online).length,
    minersTotal: mockMiners.length,
    validatorsOnline: mockValidators.filter((v) => v.online).length,
    validatorsTotal: mockValidators.length,
    totalSubmissions: mockMiners.reduce((s, m) => s + m.taskCount, 0),
    totalEvaluations: mockValidators.reduce((s, v) => s + v.evalCount, 0),
    datasetCount: mockDatasets.length,
    source: "mock",
  };
}
