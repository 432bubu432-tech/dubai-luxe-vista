import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { DRIVE_ROOT_FOLDER_ID, DRIVE_CATEGORY_MAP, slugify } from "./drive";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
};

async function driveFetch(path: string, params: Record<string, string>) {
  const key = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!key || !connKey) throw new Error("Drive gateway credentials missing");
  const url = new URL(`${GATEWAY}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${key}`,
      "X-Connection-Api-Key": connKey,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive ${path} failed [${res.status}]: ${text}`);
  }
  return res.json() as Promise<{ files: DriveFile[] }>;
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
    if (pageToken) params.pageToken = pageToken;
    const res = (await driveFetch("/files", params)) as {
      files: DriveFile[];
      nextPageToken?: string;
    };
    all.push(...res.files);
    pageToken = res.nextPageToken;
  } while (pageToken);
  return all;
}

function classify(mime: string, name: string): "image" | "brochure" | "floor_plan" | "video" | "other" {
  const n = name.toLowerCase();
  if (mime.startsWith("image/")) {
    if (n.includes("floor") || n.includes("plan") || n.includes("layout")) return "floor_plan";
    return "image";
  }
  if (mime === "application/pdf") {
    if (n.includes("floor") || n.includes("plan")) return "floor_plan";
    return "brochure";
  }
  if (mime.startsWith("video/")) return "video";
  return "other";
}

export const runDriveImport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ secret: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    if (data.secret !== process.env.DRIVE_IMPORT_SECRET) {
      throw new Error("Forbidden");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const categories = await listChildren(DRIVE_ROOT_FOLDER_ID);
    const usedSlugs = new Set<string>();
    const summary: {
      properties: number;
      media: number;
      categories: string[];
      errors: string[];
    } = { properties: 0, media: 0, categories: [], errors: [] };

    for (const cat of categories) {
      if (cat.mimeType !== "application/vnd.google-apps.folder") continue;
      const mapping = DRIVE_CATEGORY_MAP[cat.name.trim()];
      if (!mapping) {
        summary.errors.push(`Unknown category folder: ${cat.name}`);
        continue;
      }
      summary.categories.push(mapping.key);
      const props = await listChildren(cat.id);
      for (const prop of props) {
        if (prop.mimeType !== "application/vnd.google-apps.folder") continue;
        const cleanName = prop.name.trim();
        let slug = slugify(cleanName);
        if (!slug) continue;
        while (usedSlugs.has(slug)) slug = `${slug}-${Math.floor(Math.random() * 999)}`;
        usedSlugs.add(slug);

        try {
          const media = await listChildren(prop.id);
          const heroImage = media.find(
            (m) => m.mimeType.startsWith("image/") && !/(floor|plan|layout)/i.test(m.name),
          );

          const { data: upserted, error: upErr } = await supabaseAdmin
            .from("properties")
            .upsert(
              {
                slug,
                name: cleanName,
                category: mapping.key,
                drive_folder_id: prop.id,
                hero_image_url: heroImage ? `/api/public/drive/${heroImage.id}` : null,
                published: true,
              },
              { onConflict: "drive_folder_id" },
            )
            .select("id")
            .single();
          if (upErr || !upserted) {
            summary.errors.push(`${cleanName}: ${upErr?.message ?? "upsert failed"}`);
            continue;
          }
          summary.properties += 1;

          const rows = media.map((m, idx) => ({
            property_id: upserted.id,
            drive_file_id: m.id,
            kind: classify(m.mimeType, m.name),
            storage_path: `drive:${m.id}`,
            mime: m.mimeType,
            size_bytes: m.size ? Number(m.size) : null,
            position: idx,
          }));
          if (rows.length) {
            const { error: mErr } = await supabaseAdmin
              .from("property_media")
              .upsert(rows, { onConflict: "property_id,drive_file_id" });
            if (mErr) summary.errors.push(`${cleanName} media: ${mErr.message}`);
            else summary.media += rows.length;
          }
        } catch (err) {
          summary.errors.push(`${cleanName}: ${(err as Error).message}`);
        }
      }
    }
    return summary;
  });
