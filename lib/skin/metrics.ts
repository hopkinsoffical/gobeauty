import type { MetricKey, SeverityBand } from "@/lib/skin/types";

export const METRIC_META: Record<
  MetricKey,
  { label: string; short: string; description: string; method: string }
> = {
  oiliness: {
    label: "Oiliness",
    short: "Oil",
    description: "T-zone shine and sebum-related reflectivity.",
    method: "T-zone gloss / specular highlight ratio",
  },
  dryness: {
    label: "Dryness",
    short: "Dry",
    description: "Rough texture and flaking signals on the cheeks.",
    method: "Local contrast / texture roughness",
  },
  redness: {
    label: "Sensitivity / Redness",
    short: "Red",
    description: "Red-zone intensity often linked to irritation or sensitivity.",
    method: "HSV red-channel anomaly",
  },
  pores: {
    label: "Pores",
    short: "Pores",
    description: "Visibility of pore texture in the mid-face.",
    method: "High-frequency texture energy",
  },
  spots: {
    label: "Spots / Pigmentation",
    short: "Spots",
    description: "Uneven tone and localized pigmentation.",
    method: "Color distance from median skin tone",
  },
  wrinkles: {
    label: "Fine lines / Wrinkles",
    short: "Lines",
    description: "Line-like texture density, especially on the forehead.",
    method: "Oriented gradient / line density",
  },
};

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreBand(value: number): SeverityBand {
  if (value >= 67) return "high";
  if (value >= 34) return "moderate";
  return "low";
}

export function bandColor(band: SeverityBand): string {
  switch (band) {
    case "high":
      return "text-rose-700 bg-rose-50 ring-rose-200";
    case "moderate":
      return "text-amber-800 bg-amber-50 ring-amber-200";
    default:
      return "text-emerald-800 bg-emerald-50 ring-emerald-200";
  }
}

export function bandRingStroke(band: SeverityBand): string {
  switch (band) {
    case "high":
      return "#e11d48";
    case "moderate":
      return "#d97706";
    default:
      return "#059669";
  }
}

export const DEFAULT_DISCLAIMER =
  "Not a medical device or diagnosis. Results are estimated from your selfie for product discovery and education only. See a dermatologist for clinical concerns.";
