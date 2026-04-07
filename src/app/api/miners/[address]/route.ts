import { NextRequest, NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

export async function GET(
  _req: NextRequest,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  const [profileRes, historyRes] = await Promise.all([
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/miners/${address}`, { next: { revalidate: 30 } }),
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/miners/${address}/epochs`, { next: { revalidate: 30 } }),
  ]);

  const profile = profileRes.ok ? await profileRes.json() : null;
  const history = historyRes.ok ? await historyRes.json() : null;

  return NextResponse.json({
    profile: profile?.success ? profile.data : null,
    history: history?.success ? history.data : [],
  });
}
