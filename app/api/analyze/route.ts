import { NextResponse } from "next/server";
import {
  analyzePhoto,
  isAnthropicConfigured,
  type SupportedMediaType,
} from "@/lib/anthropic";
import {
  getUserIdFromToken,
  saveAnalysis,
  uploadAnalysisImage,
} from "@/lib/analyses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES: SupportedMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ~8MB of base64 ≈ 6MB image. Clients should downscale before sending.
const MAX_BASE64_LENGTH = 8_000_000;

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  return h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : null;
}

/** Public config probe — never returns the key, only whether it is set. */
export async function GET() {
  return NextResponse.json({
    anthropicConfigured: isAnthropicConfigured(),
  });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromToken(bearer(req));
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to analyze a photo." },
      { status: 401 },
    );
  }

  let body: {
    imageBase64?: string;
    mediaType?: string;
    prompt?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { imageBase64, mediaType, prompt } = body;
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
    const analysis = await analyzePhoto({
      imageBase64,
      mediaType: mediaType as SupportedMediaType,
      prompt,
    });

    // Persistence is best-effort and runs after a successful analysis.
    const imageUrl = await uploadAnalysisImage({
      userId,
      base64: imageBase64,
      mediaType: mediaType as SupportedMediaType,
    });
    const record = await saveAnalysis({
      userId,
      imageUrl,
      prompt: prompt?.trim() || null,
      analysis,
    });

    return NextResponse.json({ analysis, record });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not analyze the photo.";
    const missingKey = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      {
        error: missingKey
          ? "Photo analysis isn't configured yet (missing API key)."
          : message,
      },
      { status: missingKey ? 503 : 500 },
    );
  }
}
