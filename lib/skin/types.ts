import type { ProductCard } from "@/lib/gbApi";

export const METRIC_KEYS = [
  "oiliness",
  "dryness",
  "redness",
  "pores",
  "spots",
  "wrinkles",
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

export type SeverityBand = "low" | "moderate" | "high";

export type MetricSource = "cv" | "llm" | "hybrid";

export interface MetricScore {
  value: number;
  band: SeverityBand;
  label: string;
  explanation: string;
  source: MetricSource;
}

export interface SkinConcern {
  key: MetricKey;
  severity: SeverityBand;
  title: string;
  detail: string;
}

export interface RoutineBlock {
  when: "AM" | "PM" | "Weekly";
  steps: string[];
}

export interface PhotoQuality {
  ok: boolean;
  issues: string[];
}

export interface SkinReport {
  overallType: string;
  summary: string;
  quality: PhotoQuality;
  scores: Record<MetricKey, MetricScore>;
  concerns: SkinConcern[];
  routine: RoutineBlock[];
  disclaimer: string;
}

export interface ProductRecGroup {
  concern: MetricKey;
  label: string;
  items: ProductCard[];
}

export interface SkinAnalyzeResponse {
  report: SkinReport;
  products: ProductRecGroup[];
}

/** Client CV output before LLM calibration. */
export type ClientMetrics = Partial<Record<MetricKey, number>>;
