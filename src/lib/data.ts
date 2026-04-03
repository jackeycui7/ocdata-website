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

// Normalize dataset schema — API returns either:
//   flat:        { field: { type: string, required: boolean } }
//   JSON Schema: { $schema, title, properties: { field: { type, ... } }, required: [...] }
function normalizeSchema(raw: Record<string, unknown>): Record<string, { type: string; required: boolean }> {
  if ("properties" in raw || "$schema" in raw) {
    const properties = (raw.properties as Record<string, { type?: string | string[] }>) ?? {};
    const requiredFields = Array.isArray(raw.required) ? (raw.required as string[]) : [];
    const result: Record<string, { type: string; required: boolean }> = {};
    for (const [field, spec] of Object.entries(properties)) {
      const typeArr = Array.isArray(spec.type)
        ? spec.type.filter((t) => t !== "null")
        : [spec.type || "string"];
      result[field] = {
        type: typeArr.join(" | ") || "string",
        required: requiredFields.includes(field),
      };
    }
    return result;
  }
  // Flat format
  const result: Record<string, { type: string; required: boolean }> = {};
  for (const [field, spec] of Object.entries(raw)) {
    if (spec && typeof spec === "object" && "type" in spec) {
      const s = spec as { type: string; required?: boolean };
      result[field] = { type: s.type, required: Boolean(s.required) };
    }
  }
  return result;
}

// --- Datasets ---

export async function loadDatasets(): Promise<DatasetInfo[]> {
  const remote = await api.fetchDatasets();
  if (remote && remote.length > 0) {
    return remote.map((d) => {
      const schema = normalizeSchema(d.schema);
      return {
        id: d.dataset_id,
        name: d.name,
        status: d.status as DatasetInfo["status"],
        domains: d.source_domains,
        entries: d.total_entries,
        miners: 0, // not available from core API directly
        fields: Object.keys(schema).length,
        refresh: d.refresh_interval || "never",
        creator: d.creator,
        createdAt: d.created_at?.split("T")[0] || "",
        schema,
      };
    });
  }
  return mockDatasets;
}

export async function loadDataset(id: string): Promise<DatasetInfo | null> {
  const remote = await api.fetchDataset(id);
  if (remote) {
    const schema = normalizeSchema(remote.schema);
    return {
      id: remote.dataset_id,
      name: remote.name,
      status: remote.status as DatasetInfo["status"],
      domains: remote.source_domains,
      entries: remote.total_entries,
      miners: 0,
      fields: Object.keys(schema).length,
      refresh: remote.refresh_interval || "never",
      creator: remote.creator,
      createdAt: remote.created_at?.split("T")[0] || "",
      schema,
    };
  }
  return mockDatasets.find((d) => d.id === id) || null;
}

// --- Miners ---

export async function loadMiners(): Promise<MinerStat[]> {
  const remote = await api.fetchMinersOnline();
  if (remote !== null) {
    // Build base miner list
    const miners: MinerStat[] = remote.map((m) => ({
      address: m.miner_id,
      credit: m.credit,
      tier: getTier(m.credit),
      taskCount: 0,
      avgScore: 0,
      reward: 0,
      online: m.online,
    }));

    // Enrich with snapshot from most recent completed epoch
    try {
      const epochs = await api.fetchCoreEpochs(1, 5);
      const completedEpoch = epochs?.find((e) => e.status === "completed");
      if (completedEpoch) {
        const snapshot = await api.fetchEpochSnapshot(completedEpoch.id);
        if (snapshot) {
          for (const miner of miners) {
            const snap = snapshot.miners[miner.address];
            if (snap) {
              miner.taskCount = snap.task_count;
              miner.avgScore = snap.avg_score;
            }
          }
        }
      }
    } catch {
      // snapshot enrichment is best-effort; ignore errors
    }

    return miners;
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
  const remote = await api.fetchCoreEpochs(1, 50);
  if (remote && remote.length > 0) {
    return remote
      .filter((e) => e.epoch_id !== "2099-12-31") // filter test/placeholder epochs
      .map((e) => ({
        id: e.id,
        startTime: e.window_start_at,
        endTime: e.window_end_at,
        status: e.status,
        summary: e.summary,
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
  return null;
}

export async function loadEpochSnapshot(epochId: string): Promise<api.ApiEpochSnapshot | null> {
  return api.fetchEpochSnapshot(epochId);
}

export async function loadRecentSubmissions() {
  const remote = await api.fetchSubmissions(1, 10);
  return remote ?? [];
}

// --- Dashboard stats ---

export interface DashboardStats {
  currentEpoch: string;  // date string e.g. "2026-04-03", or "" if unknown
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
  const [miners, datasets, epochs] = await Promise.all([
    api.fetchMinersOnline(),
    api.fetchDatasets(),
    api.fetchCoreEpochs(1, 5),
  ]);

  if (miners !== null) {
    const openEpoch = epochs?.find((e) => e.status === "open");
    const currentEpoch = openEpoch?.epoch_id || epochs?.[0]?.epoch_id || "";
    const currentEpochSummary = epochs?.find((e) => e.status === "open")?.summary;

    return {
      currentEpoch,
      minersOnline: miners.filter((m) => m.online).length,
      minersTotal: miners.length,
      validatorsOnline: mockValidators.filter((v) => v.online).length,
      validatorsTotal: mockValidators.length,
      totalSubmissions: currentEpochSummary?.total ?? 0,
      totalEvaluations: 0,
      datasetCount: datasets?.length || mockDatasets.length,
      source: "api",
    };
  }

  return {
    currentEpoch: mockEpochs[0]?.startTime.split("T")[0] || "",
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
