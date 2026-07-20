/**
 * K-beauty brand catalog for goBeauty.ai (~108 brands).
 *
 * - `slug` is the preferred public path segment (`/brands/[slug]`).
 * - `gbSlug` maps to an existing RDS `gb_brands.slug` when it differs
 *   (skinsort legacy slugs like `a39pieu`, `axis---y`).
 * - `marketplaceTier` drives US-marketplace prioritization:
 *     1 = Top Tier (must-have), 2 = Second, 3 = Third, null = catalog only.
 */

export type MarketplaceTier = 1 | 2 | 3;

export interface KBeautyBrand {
  /** Display name */
  name: string;
  /** Canonical public slug */
  slug: string;
  /** RDS gb_brands.slug when different from slug */
  gbSlug?: string;
  /** A–Z index letter */
  letter: string;
  /** US marketplace priority tier (null = not in top-30 push) */
  marketplaceTier: MarketplaceTier | null;
  /** Official site when known; null = unknown */
  website: string | null;
}

function b(
  name: string,
  slug: string,
  letter: string,
  opts: {
    gbSlug?: string;
    tier?: MarketplaceTier | null;
    website?: string | null;
  } = {},
): KBeautyBrand {
  return {
    name,
    slug,
    letter,
    gbSlug: opts.gbSlug,
    marketplaceTier: opts.tier ?? null,
    website: opts.website ?? null,
  };
}

/** Full curated K-beauty list (A–Z). ~108 brands. */
export const KBEAUTY_BRANDS: KBeautyBrand[] = [
  // ── A ──────────────────────────────────────────────────────────────────────
  b("ABIB", "abib", "A", { tier: 2, website: "https://abib.com" }),
  b("ACWELL", "acwell", "A"),
  b("AESTURA", "aestura", "A", { tier: 3, website: "https://aestura.com" }),
  b("AGE 20'S", "age-20s", "A"),
  b("AHC", "ahc", "A", { website: "https://www.ahcbeauty.com" }),
  b("ANUA", "anua", "A", { tier: 1, website: "https://anua.global" }),
  b("A'PIEU", "apieu", "A", { gbSlug: "a39pieu" }),
  b("APRIL SKIN", "april-skin", "A", { gbSlug: "aprilskin" }),
  b("ATOPALM", "atopalm", "A"),
  b("AXIS-Y", "axis-y", "A", { gbSlug: "axis---y", website: "https://axis-y.com" }),

  // ── B ──────────────────────────────────────────────────────────────────────
  b("BANILA CO", "banila-co", "B", { website: "https://www.banilaco.com" }),
  b("BEAUTY OF JOSEON", "beauty-of-joseon", "B", {
    tier: 1,
    website: "https://beautyofjoseon.com",
  }),
  b("BENTON", "benton", "B", { website: "https://www.bentoncosmetic.com" }),
  b("BIODANCE", "biodance", "B", { tier: 2, website: "https://biodance.com" }),
  b("BIOLEE", "biolee", "B"),
  b("BLESSED MOON", "blessed-moon", "B"),
  b("BAREN", "baren", "B"),

  // ── C ──────────────────────────────────────────────────────────────────────
  b("CATCH ME PATCH", "catch-me-patch", "C"),
  b("CCAM BBAK", "ccam-bbak", "C"),
  b("CELIMAX", "celimax", "C", { website: "https://celimax.com" }),
  b("CENTELLIAN24", "centellian24", "C"),
  b("Chosungah", "chosungah", "C"),
  b("CKD", "ckd", "C"),
  b("CLIO", "clio", "C", { tier: 3, website: "https://cliocosmetic.com" }),
  b("CNP COSMETICS", "cnp-cosmetics", "C", { gbSlug: "cnp-laboratory" }),
  b("COLORGRAM", "colorgram", "C"),
  b("COS DE BAHA", "cos-de-baha", "C"),
  b("COSMOOD", "cosmood", "C"),
  b("COSRX", "cosrx", "C", { tier: 1, website: "https://www.cosrx.com" }),
  b("Cellfusion C", "cellfusion-c", "C"),

  // ── D ──────────────────────────────────────────────────────────────────────
  b("D'ALBA", "dalba", "D", { website: "https://dalba.com" }),
  b("DARKNESS", "darkness", "D"),
  b("DERMA:B", "derma-b", "D"),
  b("DR.G", "dr-g", "D", { gbSlug: "drg", tier: 2, website: "https://drgskincare.com" }),
  b("DONG-A", "dong-a", "D"),
  b("DONUT", "donut", "D"),
  b("DR.ALTHEA", "dr-althea", "D", { website: "https://dralthea.us" }),
  b("Dr.CEURACLE", "dr-ceuracle", "D", { gbSlug: "drceuracle" }),
  b("Dr.FORHAIR", "dr-forhair", "D"),
  b("DR.JART", "dr-jart", "D", { website: "https://www.drjart.com" }),
  b("DR.MELAXIN", "dr-melaxin", "D", { gbSlug: "drmelaxin" }),

  // ── E ──────────────────────────────────────────────────────────────────────
  b("ELIZAVECCA", "elizavecca", "E"),
  b("ESFOLIO", "esfolio", "E"),
  b("ETUDE HOUSE", "etude-house", "E", { website: "https://www.etude.com" }),
  b("EVERYDAZE", "everydaze", "E"),
  b("ESPOIR", "espoir", "E", { website: "https://www.espoir.com" }),

  // ── F ──────────────────────────────────────────────────────────────────────
  b("FRUDIA", "frudia", "F", { website: "https://frudia.com" }),
  b("FULLY", "fully", "F"),
  b("FWEE", "fwee", "F", { tier: 3, website: "https://fwee.kr" }),

  // ── G ──────────────────────────────────────────────────────────────────────
  b("GOODAL", "goodal", "G", { website: "https://goodal.com" }),
  b("GOONGBE", "goongbe", "G"),
  b("GREEN MONSTER", "green-monster", "G"),

  // ── H ──────────────────────────────────────────────────────────────────────
  b("HAPPY BATH", "happy-bath", "H"),
  b("HARUHARU", "haruharu", "H", {
    gbSlug: "haruharu-wonder",
    tier: 2,
    website: "https://haruharuwonder.com",
  }),
  b("HEIMISH", "heimish", "H"),
  b("Hello Kitty", "hello-kitty", "H"),
  b("HINCE", "hince", "H", { tier: 3, website: "https://hince.com" }),
  b("HEVEBLUE", "heveblue", "H"),

  // ── I ──────────────────────────────────────────────────────────────────────
  b("ILLIYOON", "illiyoon", "I"),
  b("I'M FROM", "im-from", "I", { website: "https://imfrom.com" }),
  b("INCELLDERM", "incellderm", "I"),
  b("INNISFREE", "innisfree", "I", { website: "https://www.innisfree.com" }),
  b("ISNTREE", "isntree", "I", { tier: 2, website: "https://isntree.com" }),
  b("IT'S SKIN", "its-skin", "I"),
  b("iUNIK", "iunik", "I"),

  // ── J ──────────────────────────────────────────────────────────────────────
  b("JAYJUN", "jayjun", "J", { gbSlug: "jayjun-cosmetic" }),
  b("JMSOLUTION", "jmsolution", "J"),
  b("JUMISO", "jumiso", "J"),

  // ── K ──────────────────────────────────────────────────────────────────────
  b("KAHI", "kahi", "K"),
  b("KAINE", "kaine", "K"),
  b("KAJA", "kaja", "K"),
  b("KOELF", "koelf", "K"),
  b("K-SECRET", "k-secret", "K"),
  b("Kwailnara", "kwailnara", "K"),

  // ── L ──────────────────────────────────────────────────────────────────────
  b("LAKA", "laka", "L"),
  b("LANEIGE", "laneige", "L", { tier: 3, website: "https://www.laneige.com" }),
  b("LINDSAY", "lindsay", "L"),
  b("LUTHIONE", "luthione", "L"),

  // ── M ──────────────────────────────────────────────────────────────────────
  b("MAKE P:REM", "make-prem", "M"),
  b("MANYO", "manyo", "M", { tier: 2, website: "https://manyofactory.com" }),
  b("Mary&May", "mary-may", "M", { tier: 2, website: "https://marynmay.com" }),
  b("MEDICUBE", "medicube", "M", { tier: 1, website: "https://medicube.us" }),
  b("MEDIHEAL", "mediheal", "M", { tier: 3, website: "https://www.mediheal.com" }),
  b("MEDIPEEL", "medipeel", "M", { gbSlug: "medi-peel" }),
  b("MISE EN SCENE", "mise-en-scene", "M"),
  b("MISSHA", "missha", "M", { website: "https://www.misshaus.com" }),
  b("MIXSOON", "mixsoon", "M", { tier: 1, website: "https://mixsoon.us" }),
  b("MIZON", "mizon", "M"),
  b("MODAMODA", "modamoda", "M"),

  // ── N ──────────────────────────────────────────────────────────────────────
  b("NATURE REPUBLIC", "nature-republic", "N"),
  b("NEEDLY", "needly", "N", { tier: 3 }),
  b("NINE LESS", "nine-less", "N"),
  b("NUMBUZIN", "numbuzin", "N", { tier: 1, website: "https://numbuzin.com" }),
  b("NACIFIC", "nacific", "N"),

  // ── O ──────────────────────────────────────────────────────────────────────
  b("ON THE BODY", "on-the-body", "O"),

  // ── P ──────────────────────────────────────────────────────────────────────
  b("PERIPERA", "peripera", "P", { tier: 3, website: "https://www.peripera.com" }),
  b("PETITFEE", "petitfee", "P"),
  b("PURECELL", "purecell", "P", { gbSlug: "purcell" }),
  b("PURITO", "purito", "P", { tier: 2, website: "https://purito.com" }),
  b("PYUNKANG YUL", "pyunkang-yul", "P", { website: "https://pyunkangyul.com" }),

  // ── R ──────────────────────────────────────────────────────────────────────
  b("REAL BARRIER", "real-barrier", "R"),
  b("REJURAN", "rejuran", "R", { tier: 3 }),
  b("ROM&ND", "romand", "R", { tier: 2, website: "https://romand.us" }),
  b("ROUND LAB", "round-lab", "R", { tier: 1, website: "https://roundlab.us" }),
  b("RYO", "ryo", "R"),

  // ── S ──────────────────────────────────────────────────────────────────────
  b("S.nature", "s-nature", "S", { gbSlug: "snature" }),
  b("SECRET KEY", "secret-key", "S"),
  b("SKIN1004", "skin1004", "S", { tier: 1, website: "https://skin1004.com" }),
  b("SKINFOOD", "skinfood", "S"),
  b("SOMEBYMI", "somebymi", "S", { gbSlug: "some-by-mi", website: "https://somebymi.com" }),
  b("son&park", "son-and-park", "S"),
  b("SNP", "snp", "S"),
  b("SUNGBOON EDITOR", "sungboon-editor", "S"),

  // ── T ──────────────────────────────────────────────────────────────────────
  b("TFIT", "tfit", "T"),
  b("THEFACESHOP", "the-face-shop", "T", { website: "https://www.thefaceshop.com" }),
  b("TIRTIR", "tirtir", "T", { tier: 2, website: "https://tirtir.com" }),
  b("TOCOBO", "tocobo", "T", { tier: 3, website: "https://tocobo.com" }),
  b("TONYMOLY", "tonymoly", "T", { website: "https://tonymolyus.com" }),
  b("TOO COOL FOR SCHOOL", "too-cool-for-school", "T"),
  b("TORRIDEN", "torriden", "T", { tier: 1, website: "https://torriden.com" }),
  b("TOUCH IN SOL", "touch-in-sol", "T"),

  // ── U ──────────────────────────────────────────────────────────────────────
  b("UNOVE", "unove", "U"),
  b("UNLEASHIA", "unleashia", "U"),

  // ── V ──────────────────────────────────────────────────────────────────────
  b("VT COSMETICS", "vt-cosmetics", "V", {
    tier: 1,
    website: "https://vtcosmetics.us",
  }),

  // ── W ──────────────────────────────────────────────────────────────────────
  b("W.DRESSROOM", "w-dressroom", "W"),
  b("WAKEMAKE", "wakemake", "W"),
];

/** RDS slug used for product joins / API lookups. */
export function kbeautyGbSlug(brand: KBeautyBrand): string {
  return brand.gbSlug ?? brand.slug;
}

/** Brands grouped A–Z (only letters that have entries). */
export function kbeautyByLetter(): Record<string, KBeautyBrand[]> {
  const out: Record<string, KBeautyBrand[]> = {};
  for (const brand of KBEAUTY_BRANDS) {
    (out[brand.letter] ??= []).push(brand);
  }
  return out;
}

/** Top-30 marketplace priority brands, ordered by tier then name. */
export function kbeautyMarketplacePriority(): KBeautyBrand[] {
  return KBEAUTY_BRANDS.filter((b) => b.marketplaceTier != null).sort(
    (a, b) =>
      (a.marketplaceTier ?? 99) - (b.marketplaceTier ?? 99) ||
      a.name.localeCompare(b.name),
  );
}

export const KBEAUTY_TIER_LABEL: Record<MarketplaceTier, string> = {
  1: "Top Tier",
  2: "Second Tier",
  3: "Third Tier",
};

export const KBEAUTY_STATS = {
  total: KBEAUTY_BRANDS.length,
  marketplacePriority: KBEAUTY_BRANDS.filter((b) => b.marketplaceTier != null).length,
  topTier: KBEAUTY_BRANDS.filter((b) => b.marketplaceTier === 1).length,
};
