import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { PropertyGallery } from "@/components/PropertyGallery";
import { PropertyCard } from "@/components/PropertyCard";
import { getProperty } from "@/lib/property-queries.functions";
import { categoryLabel } from "@/lib/drive";
import { captureLead } from "@/lib/contact";

const propertyQuery = (slug: string) =>
  queryOptions({
    queryKey: ["property", slug],
    queryFn: () => getProperty({ data: { slug } }),
  });

export const Route = createFileRoute("/properties/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(propertyQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Property not found — Aureus Capital" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.property;
    const title = `${p.name} — ${categoryLabel(p.category)} | Aureus Capital`;
    const desc = p.description
      ? p.description.slice(0, 155)
      : `${p.name} — curated Dubai ${categoryLabel(p.category).toLowerCase()} property available through Aureus Capital's private client desk.`;
    const image = p.hero_image_url ?? undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
        { property: "og:url", content: `/properties/${p.slug}` },
      ],
      links: [{ rel: "canonical", href: `/properties/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.name,
            description: desc,
            url: `/properties/${p.slug}`,
            image: image ? [image] : undefined,
            category: categoryLabel(p.category),
            offers: p.price ? { "@type": "Offer", price: p.price, priceCurrency: "AED" } : undefined,
          }),
        },
      ],
    };
  },
  component: PropertyDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="px-6 md:px-10 py-32 text-center">
        <h1 className="font-serif text-4xl">Property not found</h1>
        <Link to="/properties" className="mt-8 inline-block text-accent text-sm uppercase tracking-[0.25em]">
          Back to portfolio
        </Link>
      </div>
    </PageShell>
  ),
});

function PropertyDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(propertyQuery(slug));
  if (!data) return null;
  const { property, media, related } = data;

  const images = media.filter((m) => m.kind === "image");
  const floorPlans = media.filter((m) => m.kind === "floor_plan");
  const brochures = media.filter((m) => m.kind === "brochure");
  const videos = media.filter((m) => m.kind === "video");
  const hero = property.hero_image_url ?? (images[0] ? `/api/public/drive/${images[0].drive_file_id}` : null);

  return (
    <PageShell>
      {/* Breadcrumb */}
      <nav className="px-6 md:px-10 pt-4 text-[10px] uppercase tracking-[0.25em] font-mono text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/properties" className="hover:text-foreground">Portfolio</Link>
        <span className="mx-2">/</span>
        <span className="text-accent">{categoryLabel(property.category)}</span>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-8 pb-16 border-b border-border">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            {hero && (
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={hero} alt={property.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="md:col-span-5">
            <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-6">
              {categoryLabel(property.category)}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif leading-[1.05] text-balance">{property.name}</h1>
            {property.location && (
              <p className="mt-6 text-muted-foreground">{property.location}</p>
            )}
            {property.description && (
              <p className="mt-8 text-muted-foreground leading-relaxed">{property.description}</p>
            )}
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">
              {property.price && <Meta label="Price" value={property.price} />}
              {property.bedrooms && <Meta label="Bedrooms" value={property.bedrooms} />}
              {property.developer && <Meta label="Developer" value={property.developer} />}
              <Meta label="Category" value={categoryLabel(property.category)} />
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/concierge"
                className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] hover:bg-accent/90"
              >
                Request Private Viewing
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-border text-[10px] uppercase tracking-[0.25em] hover:border-accent"
              >
                Speak with Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PropertyGallery items={images} propertyName={property.name} />

      {/* Floor plans */}
      {floorPlans.length > 0 && (
        <section className="px-6 md:px-10 py-20 border-b border-border">
          <h2 className="text-3xl font-serif mb-10">Floor Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {floorPlans.map((m) => (
              <a
                key={m.id}
                href={`/api/public/drive/${m.drive_file_id}`}
                target="_blank"
                rel="noreferrer"
                className="block p-8 border border-border hover:border-accent transition-colors"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">
                  Floor Plan
                </p>
                <p className="font-serif text-xl">Open floor plan {m.position + 1}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="px-6 md:px-10 py-20 border-b border-border">
          <h2 className="text-3xl font-serif mb-10">Video Tour</h2>
          <div className="grid gap-6">
            {videos.map((m) => (
              <video
                key={m.id}
                src={`/api/public/drive/${m.drive_file_id}`}
                controls
                preload="metadata"
                className="w-full max-h-[70vh] bg-black"
              />
            ))}
          </div>
        </section>
      )}

      {/* Brochures */}
      {brochures.length > 0 && (
        <section className="px-6 md:px-10 py-20 border-b border-border">
          <h2 className="text-3xl font-serif mb-10">Brochure</h2>
          <div className="grid gap-6">
            {brochures.map((m) => (
              <BrochureCard
                key={m.id}
                propertyId={property.id}
                driveFileId={m.drive_file_id}
                propertyName={property.name}
              />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="px-6 md:px-10 py-20">
          <h2 className="text-3xl font-serif mb-10">Related Residences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((r, i) => (
              <PropertyCard key={r.slug} property={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
      <dd className="mt-2 font-serif text-lg text-foreground">{value}</dd>
    </div>
  );
}

function BrochureCard({
  propertyId,
  driveFileId,
  propertyName,
}: {
  propertyId: string;
  driveFileId: string;
  propertyName: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [done, setDone] = useState(false);

  const submit = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/public/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, driveFileId, ...form }),
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${propertyName}-brochure.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      captureLead("Brochure download", { property: propertyName, ...form });
      setDone(true);
    },
  });

  return (
    <div className="p-8 border border-border">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">Brochure</p>
          <p className="font-serif text-2xl">{propertyName}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete the form to receive the full brochure.
          </p>
        </div>
        {!open && !done && (
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 px-5 py-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] hover:bg-accent/90"
          >
            Download
          </button>
        )}
        {done && (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-accent">Downloaded</span>
        )}
      </div>
      {open && !done && (
        <form
          className="mt-6 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent"
          />
          <input
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={submit.isPending}
            className="mt-2 px-6 py-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] disabled:opacity-50"
          >
            {submit.isPending ? "Preparing…" : "Send brochure"}
          </button>
          {submit.isError && (
            <p className="text-xs text-destructive">Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
