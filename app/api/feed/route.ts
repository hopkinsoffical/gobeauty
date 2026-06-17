import { NextResponse } from "next/server";
import { getFeed } from "@/lib/analyses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getFeed(12);
  return NextResponse.json({ items });
}
