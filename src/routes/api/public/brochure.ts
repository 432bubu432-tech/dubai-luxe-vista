import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PROPERTIES } from "@/data/properties";

const LeadSchema = z.object({
  propertyId: z.string().min(1),
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

        // The document must belong to the property and be a downloadable dossier.
        const property = PROPERTIES.find((p) => p.slug === body.propertyId);
        const media = property?.media.find((m) => m.id === body.driveFileId);
        if (!property || !media || (media.kind !== "brochure" && media.kind !== "floor_plan")) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("brochure_leads").insert({
            property_slug: property.slug,
            property_name: property.name,
            document_name: media.name,
            name: body.name,
            email: body.email,
            phone: body.phone ?? null,
            source: "brochure",
          });
        } catch (err) {
          // A lead-storage hiccup must never block the client's download.
          console.error("brochure lead insert failed", err);
        }

        const fileRes = await fetch(new URL(media.url, request.url).toString());
        if (!fileRes.ok) return new Response("Failed to fetch brochure", { status: 502 });
        const headers = new Headers();
        headers.set("content-type", media.mime || "application/pdf");
        headers.set("content-disposition", `attachment; filename="brochure.pdf"`);
        return new Response(fileRes.body, { status: 200, headers });
      },
    },
  },
});
