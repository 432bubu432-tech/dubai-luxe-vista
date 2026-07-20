import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const LeadSchema = z.object({
  propertyId: z.string().uuid(),
  driveFileId: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
});

export const Route = createFileRoute("/api/public/brochure")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = LeadSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Invalid input", { status: 400 });
        const body = parsed.data;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Verify the media belongs to the property and is a brochure/floor_plan pdf.
        const { data: media } = await supabaseAdmin
          .from("property_media")
          .select("id, kind, mime")
          .eq("property_id", body.propertyId)
          .eq("drive_file_id", body.driveFileId)
          .maybeSingle();
        if (!media || (media.kind !== "brochure" && media.kind !== "floor_plan")) {
          return new Response("Not found", { status: 404 });
        }

        await supabaseAdmin.from("brochure_leads").insert({
          property_id: body.propertyId,
          name: body.name,
          email: body.email,
          phone: body.phone ?? null,
          source: "brochure",
        });
        await supabaseAdmin.from("property_events").insert({
          property_id: body.propertyId,
          event: "brochure_download",
          meta: { driveFileId: body.driveFileId },
        });

        const key = process.env.LOVABLE_API_KEY;
        const connKey = process.env.GOOGLE_DRIVE_API_KEY;
        const url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${encodeURIComponent(body.driveFileId)}?alt=media`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${key}`,
            "X-Connection-Api-Key": connKey!,
          },
        });
        if (!res.ok) return new Response("Failed to fetch brochure", { status: 502 });
        const headers = new Headers();
        headers.set("content-type", media.mime ?? "application/pdf");
        headers.set("content-disposition", `attachment; filename="brochure.pdf"`);
        return new Response(res.body, { status: 200, headers });
      },
    },
  },
});
