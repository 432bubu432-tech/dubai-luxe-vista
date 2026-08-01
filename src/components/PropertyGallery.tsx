import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryItem = {
  id: string;
  drive_file_id: string;
  name: string | null;
  media_group: string | null;
};

/** Grouped editorial gallery with a full-screen lightbox. */
export function PropertyGallery({
  items,
  propertyName,
}: {
  items: GalleryItem[];
  propertyName: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [group, setGroup] = useState<string>("All");
  const groups = Array.from(new Set(items.map((i) => i.media_group ?? "Gallery")));
  const visible =
    group === "All" ? items : items.filter((i) => (i.media_group ?? "Gallery") === group);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % visible.length));
      if (e.key === "ArrowLeft")
        setOpen((v) => (v === null ? v : (v - 1 + visible.length) % visible.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, visible.length]);

  if (!items.length) return null;

  return (
    <section className="px-6 md:px-10 py-20 border-b border-border">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="text-3xl md:text-4xl font-serif">Gallery</h2>
          {groups.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {["All", ...groups].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGroup(g);
                    setOpen(null);
                  }}
                  className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] border transition-colors ${
                    group === g
                      ? "border-accent text-accent"
                      : "border-border text-muted-foreground hover:border-accent"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {visible.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setOpen(idx)}
              className={`group relative overflow-hidden bg-muted ${
                idx % 5 === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/5]"
              }`}
            >
              <img
                src={`/api/public/drive/${m.drive_file_id}`}
                alt={`${propertyName} — ${m.media_group ?? "gallery"} view ${idx + 1}`}
                loading={idx < 3 ? "eager" : "lazy"}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-vault)] group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {open !== null && visible[open] && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 p-3 border border-border hover:border-accent"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() =>
              setOpen((v) => (v === null ? v : (v - 1 + visible.length) % visible.length))
            }
            className="absolute left-4 md:left-10 p-3 border border-border hover:border-accent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img
            src={`/api/public/drive/${visible[open].drive_file_id}`}
            alt={`${propertyName} — enlarged view ${open + 1}`}
            className="max-h-[86vh] max-w-[88vw] object-contain animate-reveal"
          />
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setOpen((v) => (v === null ? v : (v + 1) % visible.length))}
            className="absolute right-4 md:right-10 p-3 border border-border hover:border-accent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {propertyName} — {open + 1} / {visible.length}
          </p>
        </div>
      )}
    </section>
  );
}
