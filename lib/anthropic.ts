import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { BeautyAnalysis } from "@/lib/types";

const MODEL = "claude-opus-4-8";

let cachedClient: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing ANTHROPIC_API_KEY. Set it in .env.local to enable photo analysis.",
    );
  }
  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

export type SupportedMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

const SYSTEM_PROMPT = `You are GoBeauty's resident beauty analyst — an expert nail tech, hairstylist, and makeup artist rolled into one. A user uploads a photo of a beauty look (most often nails, but also hair, makeup, brows, lashes, or skin) and you break it down for them clearly and warmly.

Be specific and practical. Name actual techniques, finishes, shapes, colors, and products where you can identify them. Keep each section tight — a few sentences, no filler. Prices should be realistic US salon ranges. Write for a curious consumer, not an industry insider.

If the photo is not a beauty look at all (e.g. a landscape or a random object), still fill every field but say plainly in "what" that it doesn't look like a beauty photo and invite them to upload one.`;

// We get structured output via a forced tool call — supported across SDK
// versions and reliably typed (the tool `input` is a parsed object).
const ANALYSIS_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description:
        "A short, catchy name for the look, e.g. 'Glazed donut almond nails' or 'Soft glam smokey eye'. Max ~6 words.",
    },
    category: {
      type: "string",
      enum: ["Nails", "Hair", "Makeup", "Skin", "Brows", "Lashes", "Other"],
      description: "The primary beauty category of the look.",
    },
    what: {
      type: "string",
      description:
        "What it is — describe the structure of the look: shape, length, colors, finish, technique. Be concrete.",
    },
    why: {
      type: "string",
      description:
        "Why it works — the appeal, the occasions it suits, what it flatters.",
    },
    how: {
      type: "string",
      description:
        "How it's achieved — the technique, products, and rough steps a pro would use.",
    },
    howMuch: {
      type: "string",
      description:
        "Rough cost — a realistic US salon price range to get this done, plus typical upkeep cadence.",
    },
    recommendation: {
      type: "string",
      description:
        "A concrete recommendation — exactly what to ask your stylist/tech for, products to try, and who it suits best.",
    },
    nextSteps: {
      type: "array",
      description:
        "3 to 4 natural follow-up questions the user might want to ask next, each phrased in the user's voice.",
      items: { type: "string" },
    },
    tags: {
      type: "array",
      description: "3 to 5 lowercase discovery tags, no '#'.",
      items: { type: "string" },
    },
  },
  required: [
    "title",
    "category",
    "what",
    "why",
    "how",
    "howMuch",
    "recommendation",
    "nextSteps",
    "tags",
  ],
};

const ANALYSIS_TOOL: Anthropic.Tool = {
  name: "record_beauty_analysis",
  description:
    "Record the structured breakdown of the beauty look shown in the photo.",
  input_schema: ANALYSIS_SCHEMA as unknown as Anthropic.Tool.InputSchema,
};

/** Analyze an uploaded beauty photo and return the structured breakdown. */
export async function analyzePhoto(opts: {
  imageBase64: string;
  mediaType: SupportedMediaType;
  prompt?: string;
}): Promise<BeautyAnalysis> {
  const userText =
    opts.prompt?.trim() ||
    "Analyze this beauty look in detail and break it down for me.";

  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [ANALYSIS_TOOL],
    tool_choice: { type: "tool", name: ANALYSIS_TOOL.name },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: opts.mediaType,
              data: opts.imageBase64,
            },
          },
          { type: "text", text: userText },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolUse) {
    throw new Error("The analyzer returned an unexpected response. Try again.");
  }
  return toolUse.input as BeautyAnalysis;
}

/**
 * Continue the conversation about an already-analyzed look. The original
 * analysis is given as context so we don't need to re-send the image.
 */
export async function chatFollowUp(opts: {
  analysis: BeautyAnalysis;
  history: { role: "user" | "assistant"; text: string }[];
}): Promise<string> {
  const system = `${SYSTEM_PROMPT}

You've already analyzed the user's photo. Here is your analysis as JSON — use it as the shared context for this conversation:

${JSON.stringify(opts.analysis)}

Answer follow-up questions conversationally and concisely (a short paragraph or a tight list). Stay grounded in the look you analyzed. Do not output JSON.`;

  const messages = opts.history
    .filter((m) => m.text.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.text }));

  // The first message must be from the user.
  if (messages.length === 0 || messages[0].role !== "user") {
    throw new Error("A follow-up needs at least one user message.");
  }

  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages,
  });

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
