import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/PageShell";
import { runDriveImport } from "@/lib/drive-import.functions";

export const Route = createFileRoute("/admin/import")({
  head: () => ({
    meta: [
      { title: "Drive Import — Aureus Capital" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ImportPage,
});

function ImportPage() {
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof runDriveImport>> | null>(null);

  const importMut = useMutation({
    mutationFn: async () => {
      const res = await runDriveImport({ data: { secret } });
      setResult(res);
      return res;
    },
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Internal"
        title={<>Google Drive <span className="italic">Import</span></>}
        intro="Pulls every property folder from the connected Drive workspace, creates listing pages, and links every image, floor plan, and brochure. Idempotent — safe to re-run whenever new folders are added."
      />
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Import secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={() => importMut.mutate()}
            disabled={importMut.isPending || !secret}
            className="px-6 py-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] disabled:opacity-50"
          >
            {importMut.isPending ? "Importing…" : "Run import"}
          </button>
          {importMut.isError && (
            <p className="text-sm text-destructive">
              {(importMut.error as Error).message}
            </p>
          )}
          {result && (
            <div className="mt-8 border border-border p-6 space-y-4">
              <p className="font-serif text-2xl">
                {result.properties} properties, {result.media} media files
              </p>
              <p className="text-sm text-muted-foreground">
                Categories: {result.categories.join(", ")}
              </p>
              {result.errors.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-accent">
                    {result.errors.length} warning(s)
                  </summary>
                  <ul className="mt-3 space-y-1 text-muted-foreground">
                    {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
