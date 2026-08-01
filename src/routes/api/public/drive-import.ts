import { createFileRoute } from "@tanstack/react-router";

// Secret-guarded sync endpoint so the Drive library can be re-imported
// on a schedule or on demand without a UI session.
export const Route = createFileRoute("/api/public/drive-import")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["DRIVE_IMPORT_SECRET"];
        const provided = request.headers.get("x-import-secret");
        if (!expected || provided !== expected) {
          return new Response("Forbidden", { status: 403 });
        }
        try {
          const { runImport } = await import("@/lib/drive-import.server");
          const summary = await runImport();
          return Response.json(summary);
        } catch (err) {
          return new Response(`Import failed: ${(err as Error).message}`, { status: 500 });
        }
      },
    },
  },
});
