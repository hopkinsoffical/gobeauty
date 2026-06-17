import { NextResponse } from "next/server";
import { chatFollowUp } from "@/lib/anthropic";
import { getUserIdFromToken } from "@/lib/analyses";
import type { BeautyAnalysis } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  return h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : null;
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken(bearer(req));
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to continue the chat." },
      { status: 401 },
    );
  }

  let body: {
    analysis?: BeautyAnalysis;
    history?: { role: "user" | "assistant"; text: string }[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.analysis || !Array.isArray(body.history)) {
    return NextResponse.json(
      { error: "Missing analysis context or message history." },
      { status: 400 },
    );
  }

  try {
    const text = await chatFollowUp({
      analysis: body.analysis,
      history: body.history.slice(-12), // keep the thread bounded
    });
    return NextResponse.json({ text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not generate a reply.";
    const missingKey = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      {
        error: missingKey
          ? "Chat isn't configured yet (missing API key)."
          : message,
      },
      { status: missingKey ? 503 : 500 },
    );
  }
}
