import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { listProperties } from "@/lib/property-queries.functions";
import { CATEGORIES } from "@/lib/drive";

const propertiesQuery = queryOptions({
  queryKey: ["properties", "all"],
  queryFn: () => listProperties(),
});

export const Route = createFileRoute("/properties/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQuery),
  head: () => ({
    meta: [
      { title: "Dubai Luxury Property Portfolio — 80+ Live Residences | Aureus Capital" },
      {
        name: "description",
        content:
          "Browse the live Aureus Capital portfolio: signature villas, branded residences, skyline towers, waterfront homes and yield assets across Dubai, with full media on file.",
      },
      { property: "og:title", content: "Dubai Luxury Property Portfolio — Aureus Capital" },
      {
        property: "og:description",
        content:
          "The live Aureus Capital portfolio of Dubai villas, branded residences, skyline towers and waterfront homes.",
      },
      { property: "og:url", content: "/properties" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { data: properties } = useSuspenseQuery(propertiesQuery);
  const [category, setCategory] = useState<string>("all");
  const [developer, setDeveloper] = useState<string>("all");
  const [q, setQ] = useState("");

  const developers = useMemo(
    () =>
      Array.from(new Set(properties.map((p) => p.developer).filter(Boolean) as string[])).sort(),
    [properties],
  );

  const visible = properties.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (developer !== "all" && p.developer !== developer) return false;
    if (q) {
      const hay = `${p.name} ${p.developer ?? ""} ${p.location ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="The Portfolio"
        title={
          <>
            {properties.length} live Dubai <span className="italic">residences</span>
          </>
        }
        intro="Every property below is held in our own library — architectural imagery, floor plates and developer documentation included. Filter by collection, developer or address."
      />

      {/* Filters */}
      <section className="px-6 md:px-10 py-10 border-b border-border sticky top-20 z-30 bg-background/90 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              All collections
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>
                {c.label}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="sr-only" htmlFor="search">
              Search residences
            </label>
            <input
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, developer or district"
              className="flex-1 min-w-[240px] bg-transparent border border-border px-5 py-3 text-sm focus:outline-none focus:border-accent"
            />
            <label className="sr-only" htmlFor="developer">
              Developer
            </label>
            <select
              id="developer"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              className="bg-background border border-border px-5 py-3 text-[11px] uppercase tracking-[0.2em] focus:outline-none focus:border-accent"
            >
              <option value="all">All developers</option>
              {developers.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {visible.length} shown
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto">
          {visible.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {visible.map((p, i) => (
                <PropertyCard key={p.slug} property={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="py-24 text-center text-muted-foreground">
              No residences match those filters. Adjust your criteria or speak with an advisor.
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] border transition-colors ${
        active ? "border-accent text-accent" : "border-border text-muted-foreground hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}
