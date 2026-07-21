import { NextResponse } from "next/server";
import { isAnthropicConfigured, type SupportedMediaType } from "@/lib/anthropic";
import { analyzeSkin } from "@/lib/skin/analyze";
import type { ClientMetrics, MetricKey } from "@/lib/skin/types";
import { METRIC_KEYS } from "@/lib/skin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vision + product fan-out can take a bit longer than default serverless budget.
export const maxDuration = 60;

const ALLOWED_TYPES: SupportedMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_BASE64_LENGTH = 8_000_000;

function sanitizeClientMetrics(raw: unknown): ClientMetrics {
  if (!raw || typeof raw !== "object") return {};
  const out: ClientMetrics = {};
  for (const key of METRIC_KEYS) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === "number" && Number.isFinite(v)) {
      out[key as MetricKey] = Math.max(0, Math.min(100, Math.round(v)));
    }
  }
  return out;
}

export async function GET() {
  return NextResponse.json({
    anthropicConfigured: isAnthropicConfigured(),
    metrics: METRIC_KEYS,
  });
}

export async function POST(req: Request) {
  let body: {
    imageBase64?: string;
    mediaType?: string;
    clientMetrics?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { imageBase64, mediaType } = body;
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }
  if (imageBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { error: "Image is too large. Please upload a smaller photo." },
      { status: 413 },
    );
  }
  if (!ALLOWED_TYPES.includes(mediaType as SupportedMediaType)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPEG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }

  try {
    const result = await analyzeSkin({
      imageBase64,
      mediaType: mediaType as SupportedMediaType,
      clientMetrics: sanitizeClientMetrics(body.clientMetrics),
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not analyze the photo.";
    const missingKey = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      {
        error: missingKey
          ? "Skin AI isn't fully configured yet (missing API key). CV-only mode should still work — try again."
          : message,
      },
      { status: missingKey ? 503 : 500 },
    );
  }
}
