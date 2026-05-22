import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/properties", priority: "0.9", changefreq: "weekly" },
          { path: "/communities", priority: "0.8", changefreq: "monthly" },
          { path: "/investment", priority: "0.8", changefreq: "monthly" },
          { path: "/developers", priority: "0.7", changefreq: "monthly" },
          { path: "/services", priority: "0.7", changefreq: "monthly" },
          { path: "/insights", priority: "0.7", changefreq: "weekly" },
          { path: "/calculator", priority: "0.6", changefreq: "monthly" },
          { path: "/concierge", priority: "0.7", changefreq: "monthly" },
          { path: "/contact", priority: "0.6", changefreq: "monthly" },
          { path: "/about", priority: "0.6", changefreq: "monthly" },
          { path: "/quiz", priority: "0.8", changefreq: "monthly" },
          { path: "/heatmap", priority: "0.8", changefreq: "weekly" },
          { path: "/compare", priority: "0.7", changefreq: "monthly" },
          { path: "/dashboard", priority: "0.6", changefreq: "monthly" },
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
