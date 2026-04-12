import { NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

interface MinerProfile {
  miner_id: string;
  credit: number;
  credit_tier: string;
  online: boolean;
  total_rewards: number;
  total_tasks: number;
  avg_score: number;
}

// Fetch profile for a single miner
async function fetchMinerProfile(minerId: string): Promise<{
  total_rewards: number;
  total_tasks: number;
  avg_score: number;
} | null> {
  try {
    const res = await fetch(`${PLATFORM_API}/api/mining/v1/profiles/${minerId}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data?.miner_summary) {
      return {
        total_rewards: json.data.miner_summary.total_rewards ?? 0,
        total_tasks: json.data.miner_summary.total_tasks ?? 0,
        avg_score: json.data.miner_summary.avg_score ?? 0,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

// Process in batches to avoid overwhelming the API
async function fetchProfilesInBatches(minerIds: string[], batchSize = 20): Promise<Map<string, { total_rewards: number; total_tasks: number; avg_score: number }>> {
  const results = new Map<string, { total_rewards: number; total_tasks: number; avg_score: number }>();

  for (let i = 0; i < minerIds.length; i += batchSize) {
    const batch = minerIds.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (id) => {
        const profile = await fetchMinerProfile(id);
        return { id, profile };
      })
    );

    for (const { id, profile } of batchResults) {
      if (profile) {
        results.set(id, profile);
      }
    }
  }

  return results;
}

export async function GET() {
  // Fetch all miners
  const res = await fetch(`${PLATFORM_API}/api/mining/v1/miners`, {
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    return NextResponse.json({ success: false, data: [] }, { status: res.status });
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    return NextResponse.json({ success: false, data: [] });
  }

  const miners = json.data as Array<{
    miner_id: string;
    credit: number;
    credit_tier: string;
    online: boolean;
  }>;

  // Fetch all profiles in batches
  const minerIds = miners.map((m) => m.miner_id);
  const profiles = await fetchProfilesInBatches(minerIds);

  // Merge and sort by total_rewards descending
  const minersWithRewards: MinerProfile[] = miners.map((m) => {
    const profile = profiles.get(m.miner_id);
    return {
      ...m,
      total_rewards: profile?.total_rewards ?? 0,
      total_tasks: profile?.total_tasks ?? 0,
      avg_score: profile?.avg_score ?? 0,
    };
  });

  // Sort by total_rewards descending
  minersWithRewards.sort((a, b) => b.total_rewards - a.total_rewards);

  return NextResponse.json({ success: true, data: minersWithRewards });
}
