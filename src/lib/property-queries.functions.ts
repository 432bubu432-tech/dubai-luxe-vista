import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function pub() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const CARD_FIELDS =
  "id, slug, name, category, hero_image_url, price, location, developer, bedrooms, featured";

export const listProperties = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await pub()
    .from("properties")
    .select(CARD_FIELDS)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("name");
  if (error) throw error;
  return data ?? [];
});

export const listFeatured = createServerFn({ method: "GET" }).handler(async () => {
  const client = pub();
  const { data: featured } = await client
    .from("properties")
    .select(CARD_FIELDS)
    .eq("published", true)
    .eq("featured", true)
    .limit(6);
  if (featured && featured.length >= 3) return featured;
  const { data: fallback, error } = await client
    .from("properties")
    .select(CARD_FIELDS)
    .eq("published", true)
    .not("hero_image_url", "is", null)
    .order("name")
    .limit(6);
  if (error) throw error;
  return [...(featured ?? []), ...(fallback ?? [])]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 6);
});

export const listByCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ category: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { data: rows, error } = await pub()
      .from("properties")
      .select(CARD_FIELDS)
      .eq("published", true)
      .eq("category", data.category)
      .order("featured", { ascending: false })
      .order("name");
    if (error) throw error;
    return rows ?? [];
  });

export const getProperty = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const client = pub();
    const { data: prop, error } = await client
      .from("properties")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    if (!prop) return null;
    const { data: media } = await client
      .from("property_media")
      .select("id, drive_file_id, kind, mime, position, name, media_group")
      .eq("property_id", prop.id)
      .order("position");
    const { data: related } = await client
      .from("properties")
      .select(CARD_FIELDS)
      .eq("category", prop.category)
      .neq("id", prop.id)
      .eq("published", true)
      .limit(4);
    return { property: prop, media: media ?? [], related: related ?? [] };
  });
