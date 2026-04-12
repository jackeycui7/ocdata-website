import { NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

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

// Fetch profile for a single validator
async function fetchValidatorProfile(validatorId: string): Promise<{
  total_rewards: number;
  total_evals: number;
  avg_accuracy: number;
} | null> {
  try {
    const res = await fetch(`${PLATFORM_API}/api/mining/v1/profiles/${validatorId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data?.validator_summary) {
      return {
        total_rewards: json.data.validator_summary.total_rewards ?? 0,
        total_evals: json.data.validator_summary.total_evals ?? 0,
        avg_accuracy: json.data.validator_summary.avg_accuracy ?? 0,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

// Process in batches
async function fetchProfilesInBatches(validatorIds: string[], batchSize = 10): Promise<Map<string, { total_rewards: number; total_evals: number; avg_accuracy: number }>> {
  const results = new Map<string, { total_rewards: number; total_evals: number; avg_accuracy: number }>();

  for (let i = 0; i < validatorIds.length; i += batchSize) {
    const batch = validatorIds.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (id) => {
        const profile = await fetchValidatorProfile(id);
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
  // Fetch all online validators
  const res = await fetch(`${PLATFORM_API}/api/mining/v1/validators/online`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return NextResponse.json({ success: false, data: [] }, { status: res.status });
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    return NextResponse.json({ success: false, data: [] });
  }

  const validators = json.data as Array<{
    validator_id: string;
    client: string;
    online: boolean;
    credit: number;
    eligible: boolean;
  }>;

  // Fetch all profiles in batches
  const validatorIds = validators.map((v) => v.validator_id);
  const profiles = await fetchProfilesInBatches(validatorIds);

  // Merge and sort by total_rewards descending
  const validatorsWithRewards: ValidatorProfile[] = validators.map((v) => {
    const profile = profiles.get(v.validator_id);
    return {
      ...v,
      total_rewards: profile?.total_rewards ?? 0,
      total_evals: profile?.total_evals ?? 0,
      avg_accuracy: profile?.avg_accuracy ?? 0,
    };
  });

  // Sort by total_rewards descending
  validatorsWithRewards.sort((a, b) => b.total_rewards - a.total_rewards);

  return NextResponse.json({ success: true, data: validatorsWithRewards });
}
