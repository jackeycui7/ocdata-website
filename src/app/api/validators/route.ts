import { NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

// Test epochs without rewards - exclude from calculations
const TEST_EPOCHS = ["2026-04-06"];

interface ValidatorProfile {
  validator_id: string;
  credit: number;
  eligible: boolean;
  online: boolean;
  client: string;
  total_rewards: number;
  total_evals: number;
  avg_accuracy: number;
}

interface EpochSettlement {
  epoch_id: string;
  validators: Array<{
    validator_id: string;
    eval_count: number;
    accuracy: number;
    qualified: boolean;
    reward_amount: number;
  }>;
}

// Fetch epochs list
async function fetchEpochs(): Promise<Array<{ id: string; epoch_id: string; status: string }>> {
  try {
    const res = await fetch(`${PLATFORM_API}/api/core/v1/epochs?page=1&page_size=50`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

// Fetch settlement for a single epoch
async function fetchSettlement(epochId: string): Promise<EpochSettlement | null> {
  try {
    const res = await fetch(`${PLATFORM_API}/api/mining/v1/epochs/${epochId}/settlement-results`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function GET() {
  // Fetch all online validators
  const validatorsRes = await fetch(`${PLATFORM_API}/api/mining/v1/validators/online`, {
    cache: "no-store",
  });

  if (!validatorsRes.ok) {
    return NextResponse.json({ success: false, data: [] }, { status: validatorsRes.status });
  }

  const validatorsJson = await validatorsRes.json();
  if (!validatorsJson.success || !validatorsJson.data) {
    return NextResponse.json({ success: false, data: [] });
  }

  const validators = validatorsJson.data as Array<{
    validator_id: string;
    client: string;
    online: boolean;
    credit: number;
    eligible: boolean;
  }>;

  // Fetch epochs and get completed ones (excluding test epochs)
  const epochs = await fetchEpochs();
  const completedEpochs = epochs.filter(
    (e) => e.status === "completed" && !TEST_EPOCHS.includes(e.epoch_id)
  );

  // Fetch all settlements in parallel
  const settlements = await Promise.all(
    completedEpochs.map((e) => fetchSettlement(e.id))
  );

  // Aggregate validator stats from settlements
  const validatorStats = new Map<string, { total_rewards: number; total_evals: number; accuracies: number[] }>();

  for (const settlement of settlements) {
    if (!settlement?.validators) continue;
    for (const v of settlement.validators) {
      const existing = validatorStats.get(v.validator_id) || { total_rewards: 0, total_evals: 0, accuracies: [] };
      existing.total_rewards += v.reward_amount;
      existing.total_evals += v.eval_count;
      if (v.accuracy > 0) {
        existing.accuracies.push(v.accuracy);
      }
      validatorStats.set(v.validator_id, existing);
    }
  }

  // Merge validators with aggregated stats
  const validatorsWithRewards: ValidatorProfile[] = validators.map((v) => {
    const stats = validatorStats.get(v.validator_id);
    const avgAccuracy = stats && stats.accuracies.length > 0
      ? stats.accuracies.reduce((a, b) => a + b, 0) / stats.accuracies.length
      : 0;
    return {
      ...v,
      total_rewards: stats?.total_rewards ?? 0,
      total_evals: stats?.total_evals ?? 0,
      avg_accuracy: avgAccuracy,
    };
  });

  // Sort by total_rewards descending
  validatorsWithRewards.sort((a, b) => b.total_rewards - a.total_rewards);

  return NextResponse.json({ success: true, data: validatorsWithRewards });
}
