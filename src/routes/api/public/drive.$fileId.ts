import { createFileRoute } from "@tanstack/react-router";

// Streams a Drive file (image/video) through the connector gateway.
// Public because images/floor plans are meant to be viewable on the site.
// Brochures are streamed by /api/public/brochure after lead capture.

export const Route = createFileRoute("/api/public/drive/$fileId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = process.env.LOVABLE_API_KEY;
        const connKey = process.env.GOOGLE_DRIVE_API_KEY;
        if (!key || !connKey) return new Response("Drive not configured", { status: 500 });

        const url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${encodeURIComponent(params.fileId)}?alt=media`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${key}`,
            "X-Connection-Api-Key": connKey,
          },
        });
        if (!res.ok) {
          const body = await res.text();
          return new Response(`Drive error: ${body}`, { status: res.status });
        }
        const headers = new Headers();
        const ct = res.headers.get("content-type");
        if (ct) headers.set("content-type", ct);
        headers.set("cache-control", "public, max-age=604800, immutable");
        return new Response(res.body, { status: 200, headers });
      },
    },
  },
});
