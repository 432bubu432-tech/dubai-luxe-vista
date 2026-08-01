import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { listByCategory } from "@/lib/property-queries.functions";
import { CATEGORIES, categoryDef } from "@/lib/drive";

const collectionQuery = (category: string) =>
  queryOptions({
    queryKey: ["properties", "category", category],
    queryFn: () => listByCategory({ data: { category } }),
  });

export const Route = createFileRoute("/collections/$category")({
  loader: async ({ params, context }) => {
    const def = categoryDef(params.category);
    if (!def) throw notFound();
    const properties = await context.queryClient.ensureQueryData(collectionQuery(params.category));
    return { def, count: properties.length };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Collection not found — Aureus Capital" }, { name: "robots", content: "noindex" }],
      };
    }
    const { def, count } = loaderData;
    const title = `${def.label} in Dubai — ${count} Residences | Aureus Capital`;
    const desc = def.intro.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/collections/${params.category}` },
      ],
      links: [{ rel: "canonical", href: `/collections/${params.category}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: def.label,
            description: def.intro,
            url: `/collections/${params.category}`,
          }),
        },
      ],
    };
  },
  component: CollectionPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="px-6 md:px-10 py-32 text-center">
        <h1 className="font-serif text-4xl">Collection not found</h1>
        <Link to="/properties" className="mt-8 inline-block text-accent text-sm uppercase tracking-[0.25em]">
          Back to portfolio
        </Link>
      </div>
    </PageShell>
  ),
});

function CollectionPage() {
  const { category } = Route.useParams();
  const { data: properties } = useSuspenseQuery(collectionQuery(category));
  const def = categoryDef(category);
  if (!def) return null;

  return (
    <PageShell>
      <PageHero
        eyebrow={def.tagline}
        title={
          <>
            {def.label.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic">{def.label.split(" ").slice(-1)}</span>
          </>
        }
        intro={def.intro}
      />

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-10">
            {properties.length} residences on file
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 border-t border-border">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl font-serif mb-8">Other collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {CATEGORIES.filter((c) => c.key !== category).map((c) => (
              <Link
                key={c.key}
                to="/collections/$category"
                params={{ category: c.key }}
                className="bg-background p-8 hover:bg-foreground/[0.03] transition-colors"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {c.tagline}
                </p>
                <h3 className="mt-3 font-serif text-xl">{c.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
