import { NextResponse } from "next/server";
import { topSalons } from "@/lib/gbApi";

export const dynamic = "force-dynamic";

// Browser-side proxy for /local-rankings "Top 3 near you" — the gb shim has
// no CORS, so client fetches go through here.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const town = url.searchParams.get("town") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const zip3 = url.searchParams.get("zip3") ?? "";
  const category = url.searchParams.get("category") ?? "";

  if (!town && !zip3 && !state) {
    return NextResponse.json(
      { error: "provide town, zip3, or state" },
      { status: 400 },
    );
  }

  try {
    const result = await topSalons({ town, state, zip3, category, limit: 3 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "salon rankings are unavailable right now" },
      { status: 502 },
    );
  }
}
