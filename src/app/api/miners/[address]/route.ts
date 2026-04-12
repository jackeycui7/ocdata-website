import { NextRequest, NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

export async function GET(
  _req: NextRequest,
  { params }: { params: { address: string } }
) {
  const address = params.address.toLowerCase();

  const [profileRes, minerHistoryRes, validatorHistoryRes] = await Promise.all([
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/${address}`, { cache: "no-store" }),
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/miners/${address}/epochs`, { cache: "no-store" }),
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/validators/${address}/epochs`, { cache: "no-store" }),
  ]);

  const profile = profileRes.ok ? await profileRes.json() : null;
  const minerHistory = minerHistoryRes.ok ? await minerHistoryRes.json() : null;
  const validatorHistory = validatorHistoryRes.ok ? await validatorHistoryRes.json() : null;

  return NextResponse.json({
    profile: profile?.success ? profile.data : null,
    minerHistory: minerHistory?.success ? minerHistory.data : [],
    validatorHistory: validatorHistory?.success ? validatorHistory.data : [],
  });
}
