import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, isAnthropicConfigured, type SupportedMediaType } from "@/lib/anthropic";
import {
  clampScore,
  DEFAULT_DISCLAIMER,
  METRIC_META,
  scoreBand,
} from "@/lib/skin/metrics";
import { fetchProductsForConcerns } from "@/lib/skin/recommend";
import type {
  ClientMetrics,
  MetricKey,
  MetricScore,
  MetricSource,
  SkinAnalyzeResponse,
  SkinConcern,
  SkinReport,
} from "@/lib/skin/types";
import { METRIC_KEYS } from "@/lib/skin/types";

const MODEL = process.env.SKIN_AI_MODEL?.trim() || "claude-sonnet-4-5";

const SYSTEM = `You are goBeauty's Skin AI esthetician educator. A user uploads a face selfie for cosmetic skin assessment (NOT medical diagnosis).

Your job:
1. Judge photo quality (face visible? well lit? blurry? heavy filter?).
2. Estimate 6 skin metrics 0–100 (higher = more of that concern): oiliness, dryness, redness, pores, spots, wrinkles.
3. If client CV metrics are provided, treat them as priors — blend/correct for lighting, makeup, or pose. Do not invent extreme scores from a bad photo.
4. Infer overall skin type (Oily, Dry, Combination, Normal, Sensitive, etc.).
5. Rank 2–4 prioritized concerns with plain-language detail.
6. Give practical AM / PM (and optional Weekly) routine steps using common product categories (cleanser, moisturizer, SPF, serum…) — no prescription drugs.
7. Stay warm, specific, and non-alarmist. Never claim medical diagnosis.

Write in English. Keep explanations to 1–2 sentences each.`;

const scoreProp = {
  type: "object" as const,
  properties: {
    value: { type: "number" as const, description: "0–100" },
    explanation: { type: "string" as const },
  },
  required: ["value", "explanation"] as const,
};

const REPORT_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  properties: {
    overallType: {
      type: "string",
      description: "Overall skin type label, e.g. Combination, Oily, Dry, Sensitive.",
    },
    summary: {
      type: "string",
      description: "2–3 sentence overall summary of the skin assessment.",
    },
    quality: {
      type: "object",
      properties: {
        ok: { type: "boolean" },
        issues: {
          type: "array",
          items: { type: "string" },
          description: "Photo quality issues if any (empty if ok).",
        },
      },
      required: ["ok", "issues"],
    },
    scores: {
      type: "object",
      properties: {
        oiliness: scoreProp,
        dryness: scoreProp,
        redness: scoreProp,
        pores: scoreProp,
        spots: scoreProp,
        wrinkles: scoreProp,
      },
      required: ["oiliness", "dryness", "redness", "pores", "spots", "wrinkles"],
    },
    concerns: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: ["oiliness", "dryness", "redness", "pores", "spots", "wrinkles"],
          },
          severity: { type: "string", enum: ["low", "moderate", "high"] },
          title: { type: "string" },
          detail: { type: "string" },
        },
        required: ["key", "severity", "title", "detail"],
      },
    },
    routine: {
      type: "array",
      items: {
        type: "object",
        properties: {
          when: { type: "string", enum: ["AM", "PM", "Weekly"] },
          steps: { type: "array", items: { type: "string" } },
        },
        required: ["when", "steps"],
      },
    },
  },
  required: ["overallType", "summary", "quality", "scores", "concerns", "routine"],
};

const TOOL: Anthropic.Tool = {
  name: "record_skin_report",
  description: "Record structured skin AI assessment for the selfie.",
  input_schema: REPORT_SCHEMA as unknown as Anthropic.Tool.InputSchema,
};

type LlmScore = { value: number; explanation: string };
type LlmPayload = {
  overallType: string;
  summary: string;
  quality: { ok: boolean; issues: string[] };
  scores: Record<MetricKey, LlmScore>;
  concerns: {
    key: MetricKey;
    severity: "low" | "moderate" | "high";
    title: string;
    detail: string;
  }[];
  routine: { when: "AM" | "PM" | "Weekly"; steps: string[] }[];
};

function blend(
  cv: number | undefined,
  llm: number,
  qualityOk: boolean,
): { value: number; source: MetricSource } {
  if (cv == null || !Number.isFinite(cv)) {
    return { value: clampScore(llm), source: "llm" };
  }
  if (!qualityOk) {
    return { value: clampScore(0.35 * cv + 0.65 * llm), source: "hybrid" };
  }
  return { value: clampScore(0.55 * cv + 0.45 * llm), source: "hybrid" };
}

function reportFromCvOnly(client: ClientMetrics): SkinReport {
  const scores = {} as Record<MetricKey, MetricScore>;
  for (const key of METRIC_KEYS) {
    const value = clampScore(client[key] ?? 40);
    const band = scoreBand(value);
    scores[key] = {
      value,
      band,
      label: METRIC_META[key].label,
      explanation: `Estimated from image texture/color analysis (${METRIC_META[key].method}).`,
      source: "cv",
    };
  }
  const ranked = METRIC_KEYS.map((key) => ({ key, ...scores[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const concerns: SkinConcern[] = ranked.map((r) => ({
    key: r.key,
    severity: r.band,
    title: METRIC_META[r.key].label,
    detail: r.explanation,
  }));
  const oily = scores.oiliness.value;
  const dry = scores.dryness.value;
  let overallType = "Combination";
  if (oily >= 60 && dry < 45) overallType = "Oily";
  else if (dry >= 60 && oily < 45) overallType = "Dry";
  else if (scores.redness.value >= 60) overallType = "Sensitive";
  else if (oily < 40 && dry < 40) overallType = "Normal";

  return {
    overallType,
    summary:
      "We analyzed texture, color, and shine in your selfie. Scores are cosmetic estimates — use them to explore matching skincare products and local pros.",
    quality: { ok: true, issues: [] },
    scores,
    concerns,
    routine: [
      {
        when: "AM",
        steps: ["Gentle cleanser", "Hydrating serum", "Moisturizer", "Broad-spectrum SPF 30+"],
      },
      {
        when: "PM",
        steps: [
          "Double cleanse if wearing SPF/makeup",
          "Treatment serum for top concern",
          "Moisturizer / barrier cream",
        ],
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  };
}

function assembleReport(llm: LlmPayload, client: ClientMetrics): SkinReport {
  const scores = {} as Record<MetricKey, MetricScore>;
  for (const key of METRIC_KEYS) {
    const llmScore = llm.scores?.[key];
    const llmVal = llmScore?.value ?? client[key] ?? 40;
    const { value, source } = blend(client[key], llmVal, llm.quality?.ok !== false);
    scores[key] = {
      value,
      band: scoreBand(value),
      label: METRIC_META[key].label,
      explanation:
        llmScore?.explanation?.trim() ||
        `Estimated for ${METRIC_META[key].label.toLowerCase()}.`,
      source,
    };
  }

  const concerns: SkinConcern[] = (llm.concerns || [])
    .filter((c) => METRIC_KEYS.includes(c.key))
    .map((c) => ({
      key: c.key,
      severity: c.severity || scoreBand(scores[c.key].value),
      title: c.title || METRIC_META[c.key].label,
      detail: c.detail || scores[c.key].explanation,
    }));

  if (concerns.length === 0) {
    for (const key of [...METRIC_KEYS]
      .sort((a, b) => scores[b].value - scores[a].value)
      .slice(0, 3)) {
      concerns.push({
        key,
        severity: scores[key].band,
        title: METRIC_META[key].label,
        detail: scores[key].explanation,
      });
    }
  }

  return {
    overallType: llm.overallType || "Combination",
    summary: llm.summary || "Skin assessment complete.",
    quality: {
      ok: llm.quality?.ok !== false,
      issues: Array.isArray(llm.quality?.issues) ? llm.quality.issues : [],
    },
    scores,
    concerns,
    routine:
      Array.isArray(llm.routine) && llm.routine.length
        ? llm.routine
        : reportFromCvOnly(client).routine,
    disclaimer: DEFAULT_DISCLAIMER,
  };
}

async function callVisionLlm(opts: {
  imageBase64: string;
  mediaType: SupportedMediaType;
  clientMetrics: ClientMetrics;
}): Promise<LlmPayload> {
  const prior = JSON.stringify(opts.clientMetrics ?? {});
  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 1800,
    system: SYSTEM,
    tools: [TOOL],
    tool_choice: { type: "tool", name: TOOL.name },
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
          {
            type: "text",
            text: `Analyze this face selfie for cosmetic skin scoring. Client CV metric priors (0–100, higher = more concern): ${prior}\nBlend these with what you see. If this is not a usable face photo, set quality.ok=false and list issues.`,
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolUse) throw new Error("Skin AI returned an unexpected response.");
  return toolUse.input as LlmPayload;
}

export async function analyzeSkin(opts: {
  imageBase64: string;
  mediaType: SupportedMediaType;
  clientMetrics?: ClientMetrics;
}): Promise<SkinAnalyzeResponse> {
  const client = opts.clientMetrics ?? {};
  let report: SkinReport;

  if (isAnthropicConfigured()) {
    try {
      const llm = await callVisionLlm({
        imageBase64: opts.imageBase64,
        mediaType: opts.mediaType,
        clientMetrics: client,
      });
      report = assembleReport(llm, client);
    } catch {
      report = reportFromCvOnly(client);
    }
  } else {
    report = reportFromCvOnly(client);
  }

  const products = await fetchProductsForConcerns(report.concerns);
  return { report, products };
}
