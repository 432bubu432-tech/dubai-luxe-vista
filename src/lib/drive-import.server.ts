// Server-only: walks the Google Drive library and syncs it into the database.
import {
  DRIVE_ROOT_FOLDER_ID,
  DRIVE_FEATURED_FOLDER,
  DRIVE_CATEGORY_MAP,
  slugify,
  splitDeveloper,
  inferLocation,
  categoryLabel,
} from "./drive";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const FOLDER_MIME = "application/vnd.google-apps.folder";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
};

export type ImportSummary = {
  properties: number;
  media: number;
  featured: number;
  categories: string[];
  errors: string[];
};

async function driveFetch(params: Record<string, string>) {
  const key = process.env["LOVABLE_API_KEY"];
  const connKey = process.env["GOOGLE_DRIVE_API_KEY"];
  if (!key || !connKey) throw new Error("Drive gateway credentials missing");
  const url = new URL(`${GATEWAY}/files`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${key}`, "X-Connection-Api-Key": connKey },
  });
  if (!res.ok) throw new Error(`Drive list failed [${res.status}]: ${await res.text()}`);
  return (await res.json()) as { files: DriveFile[]; nextPageToken?: string };
}

async function listChildren(parentId: string): Promise<DriveFile[]> {
  const all: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params: Record<string, string> = {
      q: `'${parentId}' in parents and trashed=false`,
      fields: "nextPageToken,files(id,name,mimeType,size,modifiedTime)",
      pageSize: "1000",
    };
    if (pageToken) params["pageToken"] = pageToken;
    const res = await driveFetch(params);
    all.push(...res.files);
    pageToken = res.nextPageToken;
  } while (pageToken);
  return all;
}

/** Recursively collects every non-folder file under a property folder. */
async function collectFiles(folderId: string, depth = 0): Promise<DriveFile[]> {
  const kids = await listChildren(folderId);
  const files = kids.filter((k) => k.mimeType !== FOLDER_MIME);
  if (depth >= 3) return files;
  for (const dir of kids.filter((k) => k.mimeType === FOLDER_MIME)) {
    files.push(...(await collectFiles(dir.id, depth + 1)));
  }
  return files;
}

type Kind = "image" | "floor_plan" | "brochure" | "video" | "other";

export function classify(mime: string, name: string): Kind {
  const n = name.toLowerCase();
  if (mime.startsWith("image/")) {
    return /floor\s*plan|floorplan|layout/.test(n) ? "floor_plan" : "image";
  }
  if (mime === "application/pdf" || n.endsWith(".pdf")) {
    return /floor\s*plan|floorplan|layout|plas/.test(n) ? "floor_plan" : "brochure";
  }
  if (mime.startsWith("video/")) return "video";
  return "other";
}

export function groupFor(kind: Kind, name: string): string | null {
  const n = name.toLowerCase();
  if (kind === "video") return "Film";
  if (kind !== "image") return null;
  if (/interior|living|lounge|kitchen|bedroom|bath|dining|lobby|entrance/.test(n)) return "Interior";
  if (/amenit|pool|gym|spa|club|beach|garden|padel|tennis|kids/.test(n)) return "Amenities";
  if (/view|skyline|sunset|panoram|terrace|balcon/.test(n)) return "Views";
  return "Exterior";
}

/** Stable sort so "photo 1" precedes "photo 10". */
function naturalSort(a: DriveFile, b: DriveFile) {
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
}

function describe(name: string, developer: string | null, category: string, location: string) {
  const house = developer ? ` by ${developer}` : "";
  return `${name}${house} sits within our ${categoryLabel(category)} in ${location}. Aureus Capital holds the full media set — architectural imagery, floor plates and the developer brochure — and advises privately on unit selection, payment structure and exit strategy before public release pricing moves.`;
}

export async function runImport(): Promise<ImportSummary> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const summary: ImportSummary = {
    properties: 0,
    media: 0,
    featured: 0,
    categories: [],
    errors: [],
  };

  const topLevel = await listChildren(DRIVE_ROOT_FOLDER_ID);
  const usedSlugs = new Set<string>();
  const imported: { id: string; slug: string; name: string }[] = [];

  for (const cat of topLevel) {
    if (cat.mimeType !== FOLDER_MIME) continue;
    const mapping = DRIVE_CATEGORY_MAP[cat.name.trim()];
    if (!mapping) continue; // Featured folder handled after the five collections.
    summary.categories.push(mapping.key);

    const props = (await listChildren(cat.id)).filter((p) => p.mimeType === FOLDER_MIME);
    for (const prop of props) {
      const raw = prop.name.replace(/\s+/g, " ").trim();
      const { name, developer } = splitDeveloper(raw);
      let slug = slugify(raw);
      if (!slug) continue;
      while (usedSlugs.has(slug)) slug = `${slug}-2`;
      usedSlugs.add(slug);

      try {
        const files = (await collectFiles(prop.id)).sort(naturalSort);
        const images = files.filter((f) => classify(f.mimeType, f.name) === "image");
        const hero = images[0];
        const location = inferLocation(raw);

        const { data: upserted, error: upErr } = await supabaseAdmin
          .from("properties")
          .upsert(
            {
              slug,
              name,
              category: mapping.key,
              drive_folder_id: prop.id,
              developer,
              location,
              description: describe(name, developer, mapping.key, location),
              hero_image_url: hero ? `/api/public/drive/${hero.id}` : null,
              published: true,
            },
            { onConflict: "drive_folder_id" },
          )
          .select("id, slug, name")
          .single();
        if (upErr || !upserted) {
          summary.errors.push(`${raw}: ${upErr?.message ?? "upsert failed"}`);
          continue;
        }
        summary.properties += 1;
        imported.push(upserted);

        const rows = files.map((f, idx) => {
          const kind = classify(f.mimeType, f.name);
          return {
            property_id: upserted.id,
            drive_file_id: f.id,
            kind,
            name: f.name,
            media_group: groupFor(kind, f.name),
            storage_path: `drive:${f.id}`,
            mime: f.mimeType,
            size_bytes: f.size ? Number(f.size) : null,
            position: idx,
          };
        });
        if (rows.length) {
          const { error: mErr } = await supabaseAdmin
            .from("property_media")
            .upsert(rows, { onConflict: "property_id,drive_file_id" });
          if (mErr) summary.errors.push(`${raw} media: ${mErr.message}`);
          else summary.media += rows.length;
        }
      } catch (err) {
        summary.errors.push(`${raw}: ${(err as Error).message}`);
      }
    }
  }

  // Featured folder: flag matching properties instead of duplicating them.
  const featuredFolder = topLevel.find(
    (t) => t.mimeType === FOLDER_MIME && t.name.trim() === DRIVE_FEATURED_FOLDER,
  );
  if (featuredFolder) {
    const entries = (await listChildren(featuredFolder.id)).filter((f) => f.mimeType === FOLDER_MIME);
    const ids: string[] = [];
    for (const entry of entries) {
      const token = slugify(entry.name).split("-")[0];
      const match = imported.find((p) => slugify(p.name).startsWith(token));
      if (match) ids.push(match.id);
      else summary.errors.push(`Featured entry without match: ${entry.name}`);
    }
    if (ids.length) {
      const { error } = await supabaseAdmin.from("properties").update({ featured: true }).in("id", ids);
      if (error) summary.errors.push(`featured flag: ${error.message}`);
      else summary.featured = ids.length;
    }
  }

  // Nothing in Drive is ever deleted here; unmatched rows are simply unpublished.
  const keep = imported.map((p) => p.id);
  if (keep.length) {
    await supabaseAdmin
      .from("properties")
      .update({ published: false })
      .not("id", "in", `(${keep.join(",")})`);
  }

  return summary;
}
