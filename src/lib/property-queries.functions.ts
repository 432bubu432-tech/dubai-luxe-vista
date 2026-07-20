import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function pub() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

export const listProperties = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await pub()
    .from("properties")
    .select("id, slug, name, category, hero_image_url, price, location, developer, bedrooms")
    .eq("published", true)
    .order("category")
    .order("name");
  if (error) throw error;
  return data ?? [];
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
      .select("id, drive_file_id, kind, mime, position")
      .eq("property_id", prop.id)
      .order("kind")
      .order("position");
    const { data: related } = await client
      .from("properties")
      .select("slug, name, hero_image_url, category, price")
      .eq("category", prop.category)
      .neq("id", prop.id)
      .eq("published", true)
      .limit(4);
    return { property: prop, media: media ?? [], related: related ?? [] };
  });
