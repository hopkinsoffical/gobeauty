import { NextResponse } from "next/server";
import { listProducts } from "@/lib/gbApi";

export const dynamic = "force-dynamic";

// Browser-side proxy for the /local-rankings top-products section (label
// chips refetch on click; the gb shim has no CORS).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const badge = url.searchParams.get("badge") ?? "";
  const category = url.searchParams.get("category") ?? "";

  try {
    const result = await listProducts("", {
      badge,
      category,
      sort: "top",
      limit: 8,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "products are unavailable right now" },
      { status: 502 },
    );
  }
}
