import { NextResponse } from "next/server";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API || "https://api.minework.net";

export async function GET() {
  const res = await fetch(`${PLATFORM_API}/api/mining/v1/miners`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return NextResponse.json({ success: false, data: [] }, { status: res.status });
  }

  const json = await res.json();
  return NextResponse.json(json);
}
