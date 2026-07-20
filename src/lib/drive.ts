// Client-safe Drive helpers: category mapping + slug utility.

export const DRIVE_ROOT_FOLDER_ID = "1hAdxgEICUGy40hwpziRbFS3bqqC1o1yX";

// Maps top-level Drive folder name → category key used across the site.
export const DRIVE_CATEGORY_MAP: Record<string, { key: string; label: string }> = {
  "Featured Properties": { key: "featured", label: "Featured" },
  "Signature Villa & Mansions": { key: "signature", label: "Signature Villas & Mansions" },
  "The Branded Properties": { key: "branded", label: "Branded Residences" },
  "The Skyline Properties": { key: "skyline", label: "Skyline Towers" },
  "The Waterfront Collection": { key: "waterfront", label: "Waterfront Collection" },
  "Affordable collection": { key: "yield", label: "Yield Collection" },
};

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

export function categoryLabel(key: string): string {
  const found = Object.values(DRIVE_CATEGORY_MAP).find((c) => c.key === key);
  return found?.label ?? key;
}
