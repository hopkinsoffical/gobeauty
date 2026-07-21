/**
 * Lightweight client-side skin feature extraction from ImageData.
 * Not clinical-grade — used as priors for LLM calibration and as a
 * fallback when the vision model is unavailable.
 */
import type { ClientMetrics, MetricKey } from "@/lib/skin/types";
import { clampScore } from "@/lib/skin/metrics";

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

/** Crude skin mask in HSV / RGB space. */
function isSkin(r: number, g: number, b: number): boolean {
  if (r < 40 || g < 25 || b < 15) return false;
  if (r < g || r < b) return false;
  if (r - g < 8) return false;
  const [h, s, v] = rgbToHsv(r, g, b);
  const hueOk = (h >= 0 && h <= 50) || h >= 340;
  return hueOk && s > 0.08 && s < 0.75 && v > 0.2 && v < 0.98;
}

function mean(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function mad(arr: number[], med: number): number {
  if (!arr.length) return 1;
  return median(arr.map((x) => Math.abs(x - med))) || 1;
}

export function analyzeImageData(data: ImageData): ClientMetrics {
  const { width: w, height: h, data: px } = data;
  const stride = Math.max(1, Math.floor(Math.min(w, h) / 180));

  type Sample = {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    h: number;
    s: number;
    v: number;
    l: number;
  };

  const samples: Sample[] = [];
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      const i = (y * w + x) * 4;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      if (!isSkin(r, g, b)) continue;
      const [hh, ss, vv] = rgbToHsv(r, g, b);
      samples.push({
        x,
        y,
        r,
        g,
        b,
        h: hh,
        s: ss,
        v: vv,
        l: 0.2126 * r + 0.7152 * g + 0.0722 * b,
      });
    }
  }

  if (samples.length < 40) {
    return {
      oiliness: 40,
      dryness: 40,
      redness: 35,
      pores: 40,
      spots: 40,
      wrinkles: 35,
    };
  }

  const nx = (x: number) => x / w;
  const ny = (y: number) => y / h;

  const tzone = samples.filter((p) => nx(p.x) > 0.3 && nx(p.x) < 0.7 && ny(p.y) < 0.55);
  const cheeks = samples.filter(
    (p) =>
      ny(p.y) > 0.35 &&
      ny(p.y) < 0.8 &&
      ((nx(p.x) > 0.08 && nx(p.x) < 0.35) || (nx(p.x) > 0.65 && nx(p.x) < 0.92)),
  );
  const forehead = samples.filter((p) => ny(p.y) < 0.32 && nx(p.x) > 0.2 && nx(p.x) < 0.8);
  const midface = samples.filter((p) => ny(p.y) > 0.3 && ny(p.y) < 0.7);

  const tz = tzone.length ? tzone : samples;
  const oilFrac = tz.filter((p) => p.v > 0.78 && p.s < 0.35).length / tz.length;
  const oiliness = clampScore(oilFrac * 320);

  const ch = cheeks.length ? cheeks : samples;
  const dryVars: number[] = [];
  for (let i = 0; i < ch.length; i += 3) {
    const p = ch[i];
    const neighbors = ch.filter(
      (q) => Math.abs(q.x - p.x) < stride * 3 && Math.abs(q.y - p.y) < stride * 3,
    );
    if (neighbors.length < 3) continue;
    const m = mean(neighbors.map((n) => n.l));
    const v = mean(neighbors.map((n) => (n.l - m) ** 2));
    dryVars.push(Math.sqrt(v));
  }
  const dryness = clampScore((mean(dryVars) / 18) * 100);

  const redFrac =
    samples.filter((p) => (p.h <= 18 || p.h >= 345) && p.s > 0.22 && p.v > 0.25).length /
    samples.length;
  const redness = clampScore(redFrac * 280);

  const mf = midface.length ? midface : samples;
  const hf: number[] = [];
  for (let i = 0; i < mf.length - 1; i++) {
    const a = mf[i];
    const b = mf[i + 1];
    if (Math.abs(a.y - b.y) > stride * 2) continue;
    hf.push(Math.abs(a.l - b.l));
  }
  const pores = clampScore((mean(hf) / 14) * 100);

  const medR = median(samples.map((p) => p.r));
  const medG = median(samples.map((p) => p.g));
  const medB = median(samples.map((p) => p.b));
  const dists = samples.map((p) =>
    Math.sqrt((p.r - medR) ** 2 + (p.g - medG) ** 2 + (p.b - medB) ** 2),
  );
  const medD = median(dists);
  const m = mad(dists, medD);
  const spotFrac = dists.filter((d) => d > medD + 2.2 * m).length / dists.length;
  const spots = clampScore(spotFrac * 400);

  const fh = forehead.length ? forehead : samples.filter((p) => ny(p.y) < 0.45);
  const byRow = new Map<number, number[]>();
  for (const p of fh) {
    const row = Math.round(p.y / stride);
    if (!byRow.has(row)) byRow.set(row, []);
    byRow.get(row)!.push(p.l);
  }
  let gradSum = 0;
  let gradN = 0;
  for (const row of byRow.values()) {
    for (let i = 1; i < row.length; i++) {
      gradSum += Math.abs(row[i] - row[i - 1]);
      gradN++;
    }
  }
  const wrinkles = clampScore(((gradN ? gradSum / gradN : 0) / 12) * 100);

  const out: Record<MetricKey, number> = {
    oiliness,
    dryness,
    redness,
    pores,
    spots,
    wrinkles,
  };
  return out;
}

/** Run CV on an HTMLImageElement / canvas-drawn image. */
export function analyzeImageElement(img: HTMLImageElement | HTMLCanvasElement): ClientMetrics {
  const maxDim = 512;
  const sw = "naturalWidth" in img ? img.naturalWidth || img.width : img.width;
  const sh = "naturalHeight" in img ? img.naturalHeight || img.height : img.height;
  const scale = Math.min(1, maxDim / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return {};
  ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
  return analyzeImageData(ctx.getImageData(0, 0, w, h));
}
