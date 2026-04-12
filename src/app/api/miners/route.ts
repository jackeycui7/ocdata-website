import { NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

// Test epochs without rewards - exclude from calculations
const TEST_EPOCHS = ["2026-04-06"];

interface MinerProfile {
  miner_id: string;
  credit: number;
  credit_tier: string;
  online: boolean;
  total_rewards: number;
  total_tasks: number;
  avg_score: number;
}

interface EpochSettlement {
  epoch_id: string;
  miners: Array<{
    miner_id: string;
    task_count: number;
    avg_score: number;
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
  // Fetch all miners
  const minersRes = await fetch(`${PLATFORM_API}/api/mining/v1/miners`, {
    cache: "no-store",
  });

  if (!minersRes.ok) {
    return NextResponse.json({ success: false, data: [] }, { status: minersRes.status });
  }

  const minersJson = await minersRes.json();
  if (!minersJson.success || !minersJson.data) {
    return NextResponse.json({ success: false, data: [] });
  }

  const miners = minersJson.data as Array<{
    miner_id: string;
    credit: number;
    credit_tier: string;
    online: boolean;
  }>;

  // Fetch epochs and get completed ones (excluding test epochs)
  const epochs = await fetchEpochs();
  const completedEpochs = epochs.filter(
    (e) => e.status === "completed" && !TEST_EPOCHS.includes(e.epoch_id)
  );

  // Fetch all settlements in parallel (use epoch_id, not id)
  const settlements = await Promise.all(
    completedEpochs.map((e) => fetchSettlement(e.epoch_id))
  );

  // Aggregate miner stats from settlements
  const minerStats = new Map<string, { total_rewards: number; total_tasks: number; scores: number[]; epochs: number }>();

  for (const settlement of settlements) {
    if (!settlement?.miners) continue;
    for (const m of settlement.miners) {
      const existing = minerStats.get(m.miner_id) || { total_rewards: 0, total_tasks: 0, scores: [], epochs: 0 };
      existing.total_rewards += m.reward_amount;
      existing.total_tasks += m.task_count;
      if (m.avg_score > 0) {
        existing.scores.push(m.avg_score);
      }
      existing.epochs += 1;
      minerStats.set(m.miner_id, existing);
    }
  }

  // Merge miners with aggregated stats
  const minersWithRewards: MinerProfile[] = miners.map((m) => {
    const stats = minerStats.get(m.miner_id);
    const avgScore = stats && stats.scores.length > 0
      ? stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length
      : 0;
    return {
      ...m,
      total_rewards: stats?.total_rewards ?? 0,
      total_tasks: stats?.total_tasks ?? 0,
      avg_score: avgScore,
    };
  });

  // Sort by total_rewards descending
  minersWithRewards.sort((a, b) => b.total_rewards - a.total_rewards);

  return NextResponse.json({ success: true, data: minersWithRewards });
}
