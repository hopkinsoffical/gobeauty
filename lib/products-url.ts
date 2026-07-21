/** URL helpers for /products search + filter state. */

export function parseFilterKeys(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  const s = Array.isArray(raw) ? raw.join(",") : raw;
  return s
    .split(",")
    .map((k) => k.trim().replace(/-/g, "_"))
    .filter(Boolean);
}

export function buildProductsHref(opts: {
  q?: string;
  filters?: string[];
  category?: string;
  sort?: string;
  view?: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.category) params.set("category", opts.category);
  if (opts.filters?.length) {
    // Public URL uses hyphenated form; API still uses underscore keys.
    params.set("filters", opts.filters.map((k) => k.replace(/_/g, "-")).join(","));
    // Keep badge= for API compatibility with existing gb endpoint.
    params.set("badge", opts.filters.join(","));
  }
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.view) params.set("view", opts.view);
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export function buildBrandsHref(opts: { q?: string; page?: number } = {}): string {
  const params = new URLSearchParams();
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return `/brands/explore${qs ? `?${qs}` : ""}`;
}

export function toggleFilter(active: string[], key: string): string[] {
  return active.includes(key) ? active.filter((k) => k !== key) : [...active, key];
}
