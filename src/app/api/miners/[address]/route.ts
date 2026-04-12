import { NextRequest, NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

export async function GET(
  _req: NextRequest,
  { params }: { params: { address: string } }
) {
  const address = params.address.toLowerCase();

  const [profileRes, historyRes] = await Promise.all([
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/${address}`, { cache: "no-store" }),
    fetch(`${PLATFORM_API}/api/mining/v1/profiles/miners/${address}/epochs`, { cache: "no-store" }),
  ]);

  const profile = profileRes.ok ? await profileRes.json() : null;
  const history = historyRes.ok ? await historyRes.json() : null;

  return NextResponse.json({
    profile: profile?.success ? profile.data : null,
    history: history?.success ? history.data : [],
  });
}
