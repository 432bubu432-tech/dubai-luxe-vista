// Client-safe Drive helpers: category mapping, grouping + slug utilities.

export const DRIVE_ROOT_FOLDER_ID = "1hAdxgEICUGy40hwpziRbFS3bqqC1o1yX";

// Top-level Drive folder that only flags properties as featured.
export const DRIVE_FEATURED_FOLDER = "Featured Properties";

export type CategoryKey = "signature" | "branded" | "skyline" | "waterfront" | "yield";

export type CategoryDef = {
  key: CategoryKey;
  label: string;
  driveFolder: string;
  tagline: string;
  intro: string;
};

// The five live collections, mapped to their Drive folder names.
export const CATEGORIES: CategoryDef[] = [
  {
    key: "signature",
    label: "Signature Villas & Mansions",
    driveFolder: "Signature Villa & Mansions",
    tagline: "Land-owning legacy homes",
    intro:
      "Freehold villas, mansions and private estates for principals who buy land, privacy and permanence — not floor numbers.",
  },
  {
    key: "branded",
    label: "Branded Residences",
    driveFolder: "The Branded Properties",
    tagline: "Maisons under global houses",
    intro:
      "Residences delivered with the world's most disciplined luxury houses — architecture, service and resale narrative already written.",
  },
  {
    key: "skyline",
    label: "Skyline Towers",
    driveFolder: "The Skyline Properties",
    tagline: "Altitude and address",
    intro:
      "Vertical addresses along Sheikh Zayed Road, Downtown and Business Bay, where elevation is the asset and the view is the deed.",
  },
  {
    key: "waterfront",
    label: "Waterfront Collection",
    driveFolder: "The Waterfront Collection",
    tagline: "Harbour, island and canal",
    intro:
      "Beach, marina and island residences on Dubai's finite coastline — the scarcest inventory the city will ever release.",
  },
  {
    key: "yield",
    label: "Yield Collection",
    driveFolder: "Affordable collection",
    tagline: "Entry capital, institutional yield",
    intro:
      "Efficient entry points engineered for rental performance and payment-plan leverage across Dubai's growth corridors.",
  },
];

export const DRIVE_CATEGORY_MAP: Record<string, { key: CategoryKey; label: string }> =
  Object.fromEntries(CATEGORIES.map((c) => [c.driveFolder, { key: c.key, label: c.label }]));

export function categoryDef(key: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function categoryLabel(key: string): string {
  return categoryDef(key)?.label ?? key;
}

export const MEDIA_GROUPS = ["Exterior", "Interior", "Amenities", "Views", "Film"] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Splits "Athlon by Aldar" into display name + developer. */
export function splitDeveloper(raw: string): { name: string; developer: string | null } {
  const clean = raw.replace(/\s+/g, " ").trim();
  const match = clean.match(/^(.*?)\s+by\s+(.+)$/i);
  if (!match) return { name: clean, developer: null };
  return { name: match[1].trim(), developer: match[2].trim() };
}

const LOCATIONS: [RegExp, string][] = [
  [/dubai south|expo/i, "Dubai South"],
  [/harbour/i, "Dubai Harbour"],
  [/downtown|burj/i, "Downtown Dubai"],
  [/marina/i, "Dubai Marina"],
  [/palm|jumeirah bay/i, "Palm Jumeirah"],
  [/business bay|bayz/i, "Business Bay"],
  [/szr|sheikh zayed/i, "Sheikh Zayed Road"],
  [/creek|ras al khor/i, "Dubai Creek Harbour"],
  [/hills|golf/i, "Dubai Hills Estate"],
  [/islands|island/i, "Dubai Islands"],
  [/jvc|village circle/i, "Jumeirah Village Circle"],
  [/meydan|sobha hartland/i, "Meydan"],
  [/damac|valencia|lagoons/i, "Dubailand"],
];

export function inferLocation(name: string): string {
  for (const [re, label] of LOCATIONS) if (re.test(name)) return label;
  return "Dubai, UAE";
}
