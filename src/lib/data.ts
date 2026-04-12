import * as api from "./api";
import {
  type DatasetInfo,
  type MinerStat,
  type EpochInfo,
  getTier,
} from "./mock";

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
  const result: Record<string, { type: string; required: boolean }> = {};
  for (const [field, spec] of Object.entries(raw)) {
    if (spec && typeof spec === "object" && "type" in spec) {
      const s = spec as { type: string; required?: boolean };
      result[field] = { type: s.type, required: Boolean(s.required) };
    }
  }
  return result;
}

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
        miners: 0,
        fields: Object.keys(schema).length,
        refresh: d.refresh_interval || "never",
        creator: d.creator,
        createdAt: d.created_at?.split("T")[0] || "",
        schema,
      };
    });
  }
  return [];
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
  return null;
}

export async function loadMiners(): Promise<MinerStat[]> {
  const remote = await api.fetchAllMiners();
  if (remote !== null) {
    return remote.map((m) => ({
      address: m.miner_id,
      credit: m.credit,
      tier: m.credit_tier,
      taskCount: 0,
      avgScore: 0,
      reward: 0,
      online: m.online,
    }));
  }
  // fallback to online-only list
  const online = await api.fetchMinersOnline();
  if (online !== null) {
    return online.map((m) => ({
      address: m.miner_id,
      credit: m.credit,
      tier: getTier(m.credit),
      taskCount: 0,
      avgScore: 0,
      reward: 0,
      online: m.online,
    }));
  }
  return [];
}

export interface MinerEpochHistory {
  epochId: string;
  taskCount: number;
  avgScore: number;
  qualified: boolean;
  weight: number;
  rewardAmount: number;
}

export async function loadMinerProfile(address: string): Promise<MinerStat | null> {
  const remote = await api.fetchMinerPublic(address);
  if (!remote) return null;
  return {
    address: remote.miner_id,
    credit: remote.credit,
    tier: remote.credit_tier,
    taskCount: 0,
    avgScore: 0,
    reward: 0,
    online: remote.online,
  };
}

export async function loadMinerEpochHistory(address: string): Promise<MinerEpochHistory[]> {
  const remote = await api.fetchMinerEpochHistory(address);
  if (!remote) return [];
  return remote.map((e) => ({
    epochId: e.epoch_id,
    taskCount: e.task_count,
    avgScore: e.avg_score,
    qualified: e.qualified,
    weight: e.weight,
    rewardAmount: e.reward_amount,
  }));
}

export interface AddressProfile {
  address: string;
  miner?: {
    minerId: string;
    credit: number;
    creditTier: string;
    online: boolean;
  };
  validator?: {
    validatorId: string;
    credit: number;
    eligible: boolean;
    online: boolean;
    stakeAmount: string;
  };
  minerSummary?: {
    totalEpochs: number;
    totalTasks: number;
    totalRewards: number;
    avgScore: number;
  };
  validatorSummary?: {
    totalEpochs: number;
    totalEvals: number;
    totalRewards: number;
    totalSlashed: number;
    avgAccuracy: number;
  };
  currentEpoch?: {
    epochId: string;
    miner?: {
      taskCount: number;
      pendingSubmissionCount: number;
      repeatTaskCount: number;
      sampledScoreCount: number;
      avgScore: number;
    };
    validator?: {
      evalCount: number;
      goldenCount: number;
      peerCount: number;
      accuracy: number;
      peerReviewAccuracy: number;
    };
  };
}

export async function loadAddressProfile(address: string): Promise<AddressProfile | null> {
  const remote = await api.fetchAddressProfile(address);
  if (!remote) return null;
  return {
    address: remote.address,
    miner: remote.miner ? {
      minerId: remote.miner.miner_id,
      credit: remote.miner.credit,
      creditTier: remote.miner.credit_tier,
      online: remote.miner.online,
    } : undefined,
    validator: remote.validator ? {
      validatorId: remote.validator.validator_id,
      credit: remote.validator.credit,
      eligible: remote.validator.eligible,
      online: remote.validator.online,
      stakeAmount: remote.validator.stake_amount,
    } : undefined,
    minerSummary: remote.miner_summary ? {
      totalEpochs: remote.miner_summary.total_epochs,
      totalTasks: remote.miner_summary.total_tasks,
      totalRewards: remote.miner_summary.total_rewards,
      avgScore: remote.miner_summary.avg_score,
    } : undefined,
    validatorSummary: remote.validator_summary ? {
      totalEpochs: remote.validator_summary.total_epochs,
      totalEvals: remote.validator_summary.total_evals,
      totalRewards: remote.validator_summary.total_rewards,
      totalSlashed: remote.validator_summary.total_slashed,
      avgAccuracy: remote.validator_summary.avg_accuracy,
    } : undefined,
    currentEpoch: remote.current_epoch ? {
      epochId: remote.current_epoch.epoch_id,
      miner: remote.current_epoch.miner ? {
        taskCount: remote.current_epoch.miner.task_count,
        pendingSubmissionCount: remote.current_epoch.miner.pending_submission_count,
        repeatTaskCount: remote.current_epoch.miner.repeat_task_count,
        sampledScoreCount: remote.current_epoch.miner.sampled_score_count,
        avgScore: remote.current_epoch.miner.avg_score,
      } : undefined,
      validator: remote.current_epoch.validator ? {
        evalCount: remote.current_epoch.validator.eval_count,
        goldenCount: remote.current_epoch.validator.golden_count,
        peerCount: remote.current_epoch.validator.peer_count,
        accuracy: remote.current_epoch.validator.accuracy,
        peerReviewAccuracy: remote.current_epoch.validator.peer_review_accuracy,
      } : undefined,
    } : undefined,
  };
}

export interface ValidatorEpochHistory {
  epochId: string;
  evalCount: number;
  goldenCount: number;
  peerCount: number;
  accuracy: number;
  peerReviewAccuracy: number;
  qualified: boolean;
  rewardAmount: number;
}

export async function loadValidatorEpochHistory(address: string): Promise<ValidatorEpochHistory[]> {
  const remote = await api.fetchValidatorEpochHistory(address);
  if (!remote) return [];
  return remote.map((e) => ({
    epochId: e.epoch_id,
    evalCount: e.eval_count,
    goldenCount: e.golden_count,
    peerCount: e.peer_count,
    accuracy: e.accuracy,
    peerReviewAccuracy: e.peer_review_accuracy,
    qualified: e.qualified,
    rewardAmount: e.reward_amount,
  }));
}

export async function loadEpochs(): Promise<EpochInfo[]> {
  const [current, remote] = await Promise.all([
    api.fetchCurrentEpoch(),
    api.fetchCoreEpochs(1, 50),
  ]);

  const epochs = remote ?? [];
  // Merge current epoch if not already in the list
  if (current && !epochs.some((e) => e.epoch_id === current.epoch_id)) {
    epochs.unshift(current);
  }

  if (epochs.length > 0) {
    return epochs
      .filter((e) => e.epoch_id !== "2099-12-31")
      .sort((a, b) => b.epoch_id.localeCompare(a.epoch_id)) // Sort by date descending
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
  return [];
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

export interface ValidatorEpochStat {
  address: string;
  evalCount: number;
  accuracy: number;
  peerAccuracy: number;
  qualified: boolean;
  reward: number;
}

export interface ValidatorsEpochData {
  epochId: string;
  validators: ValidatorEpochStat[];
}

export async function loadValidatorsFromEpoch(): Promise<ValidatorsEpochData | null> {
  const epochs = await api.fetchCoreEpochs(1, 10);
  if (!epochs) return null;

  const completed = epochs.filter(
    (e) => e.status === "completed" && e.epoch_id !== "2099-12-31"
  );
  if (completed.length === 0) return null;

  const latest = completed[0];
  const settlement = await api.fetchEpochSettlement(latest.id);
  if (!settlement || settlement.validators.length === 0) return null;

  return {
    epochId: latest.epoch_id,
    validators: settlement.validators.map((v) => ({
      address: v.validator_id,
      evalCount: v.eval_count,
      accuracy: v.accuracy,
      peerAccuracy: v.peer_review_accuracy,
      qualified: v.qualified,
      reward: v.reward_amount,
    })),
  };
}

export interface ValidatorOnlineInfo {
  address: string;
  client: string;
  lastHeartbeatAt: string;
  online: boolean;
  credit: number;
  eligible: boolean;
  ready: boolean;
}

export async function loadValidatorsOnline(): Promise<ValidatorOnlineInfo[]> {
  const remote = await api.fetchValidatorsOnline();
  if (!remote) return [];
  return remote.map((v) => ({
    address: v.validator_id,
    client: v.client,
    lastHeartbeatAt: v.last_heartbeat_at,
    online: v.online,
    credit: v.credit,
    eligible: v.eligible,
    ready: v.ready,
  }));
}

export async function loadRecentSubmissions() {
  const remote = await api.fetchSubmissions(1, 10);
  return remote ?? [];
}

export interface DashboardStats {
  currentEpoch: string;
  minersOnline: number;
  minersTotal: number;
  validatorsOnline: number;
  validatorsTotal: number;
  totalSubmissions: number;
  totalEvaluations: number;
  datasetCount: number;
}

export async function loadDashboardStats(): Promise<DashboardStats> {
  const [publicStats, currentEpoch, miners, datasets, epochs] = await Promise.all([
    api.fetchPublicStats(),
    api.fetchCurrentEpoch(),
    api.fetchMinersOnline(),
    api.fetchDatasets(),
    api.fetchCoreEpochs(1, 5),
  ]);

  const openEpoch = currentEpoch ?? epochs?.find((e) => e.status === "open");
  const currentEpochId = publicStats?.current_epoch || openEpoch?.epoch_id || epochs?.[0]?.epoch_id || "";
  const currentEpochSummary = openEpoch?.summary;

  return {
    currentEpoch: currentEpochId,
    minersOnline: publicStats?.online_miners ?? miners?.filter((m) => m.online).length ?? 0,
    minersTotal: miners?.length ?? 0,
    validatorsOnline: publicStats?.online_validators ?? 0,
    validatorsTotal: publicStats?.online_validators ?? 0,
    totalSubmissions: currentEpochSummary?.total ?? 0,
    totalEvaluations: 0,
    datasetCount: datasets?.length ?? 0,
  };
}
