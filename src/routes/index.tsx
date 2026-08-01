import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PropertyCard } from "@/components/PropertyCard";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";
import { listFeatured, listProperties } from "@/lib/property-queries.functions";
import { CATEGORIES } from "@/lib/drive";

const featuredQuery = queryOptions({
  queryKey: ["properties", "featured"],
  queryFn: () => listFeatured(),
});

const allQuery = queryOptions({
  queryKey: ["properties", "all"],
  queryFn: () => listProperties(),
});

const faqs = [
  { q: "Can Americans buy property in Dubai?", a: "Yes. U.S. citizens and entities may acquire freehold property in designated zones across Dubai with no residency requirement, full ownership rights, and clear repatriation of capital." },
  { q: "Is Dubai real estate a good investment?", a: "Dubai offers 0% property and capital gains tax, AED-USD currency stability, gross rental yields of 6–9% in prime districts, and a 10-year Golden Visa for qualifying investors." },
  { q: "What are the best areas to invest in Dubai?", a: "Palm Jumeirah, Downtown Dubai, Dubai Marina, Emirates Hills, Dubai Hills Estate and Business Bay lead on liquidity, scarcity and net yield." },
  { q: "Does Dubai have property tax?", a: "No. There is no annual property tax, no capital gains tax, and no income tax on rental yield for individuals." },
  { q: "Can foreigners own property in Dubai?", a: "Foreign nationals may hold full freehold title in designated freehold zones, with the same protections as UAE nationals." },
];

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(featuredQuery),
      context.queryClient.ensureQueryData(allQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Aureus Capital — Dubai Luxury Real Estate Investment" },
      {
        name: "description",
        content:
          "A private gateway into Dubai's most exclusive real estate. Curated waterfront villas, branded residences and high-yield investments for global investors.",
      },
      { property: "og:title", content: "Aureus Capital — Dubai Luxury Real Estate Investment" },
      {
        property: "og:description",
        content:
          "A private gateway into Dubai's most exclusive real estate. Curated waterfront villas, branded residences and high-yield investments.",
      },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-home.jpg" },
      { name: "twitter:image", content: "/og-home.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Aureus Capital",
          description: "Private investment advisory for Dubai luxury real estate.",
          url: "/",
          areaServed: ["AE", "US", "GB"],
          knowsAbout: ["Dubai luxury real estate", "Palm Jumeirah villas", "Branded residences", "UAE Golden Visa"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

const valueStack = [
  { n: "01", title: "USD Stability", body: "The AED-USD peg anchors capital to the world's primary reserve currency." },
  { n: "02", title: "Golden Residency", body: "Investment pathways granting 10-year renewable residency for your household." },
  { n: "03", title: "Global Gateway", body: "Operating between East and West with institutional-grade regulatory oversight." },
  { n: "04", title: "Yield Optimization", body: "Data-driven entry into 6–12% net rental corridors and branded residences." },
];

const zones = [
  { name: "Palm Jumeirah", tag: "Ultra-luxury waterfront" },
  { name: "Downtown Dubai", tag: "Global skyline core" },
  { name: "Dubai Marina", tag: "High-yield rental market" },
  { name: "Emirates Hills", tag: "Ultra-private estates" },
  { name: "Dubai Hills Estate", tag: "Family wealth growth" },
  { name: "Business Bay", tag: "Urban income corridor" },
];

function HomePage() {
  const [leadSent, setLeadSent] = useState(false);
  const { data: featured } = useSuspenseQuery(featuredQuery);
  const { data: all } = useSuspenseQuery(allQuery);

  const covers = CATEGORIES.map((c) => ({
    ...c,
    count: all.filter((p) => p.category === c.key).length,
    image: all.find((p) => p.category === c.key && p.hero_image_url)?.hero_image_url ?? null,
  }));

  function onLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    if (!email) return;
    captureLead("Intelligence Report", { Email: email });
    window.open(whatsappUrl(buildLeadMessage("Intelligence Report Request", { Email: email })), "_blank", "noopener,noreferrer");
    setLeadSent(true);
  }

  return (
    <PageShell>
      <HeroCarousel slides={featured} />

      {/* TRUST */}
      <section className="border-y border-border py-6 px-6 md:px-10">
        <p className="max-w-screen-2xl mx-auto text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Trusted by international investors across the U.S., Europe and the Middle East
        </p>
      </section>

      {/* VALUE STACK */}
      <section className="py-28 px-6 md:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif italic mb-16 max-w-2xl">
            Why sophisticated investors choose Dubai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {valueStack.map((v) => (
              <div key={v.n} className="space-y-4">
                <span className="font-mono text-[10px] text-accent">({v.n})</span>
                <h3 className="text-lg font-serif">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="py-28">
        <div className="px-6 md:px-10 mb-12 flex items-end justify-between max-w-screen-2xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif italic">The Five Collections</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Every asset in our live library, organised by the way capital actually behaves.
            </p>
          </div>
          <Link
            to="/properties"
            className="hidden md:inline text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/30 pb-1"
          >
            View All Assets
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border-y border-border">
          {covers.map((c) => (
            <Link
              key={c.key}
              to="/collections/$category"
              params={{ category: c.key }}
              className="group relative aspect-[3/4] bg-background overflow-hidden block"
            >
              {c.image && (
                <img
                  src={c.image}
                  alt={`${c.label} — Dubai property collection`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent p-8 flex flex-col justify-end">
                <p className="text-[10px] uppercase tracking-[0.25em] text-accent mb-2">
                  {c.count} residences
                </p>
                <h3 className="text-2xl font-serif leading-tight">{c.label}</h3>
                <p className="text-sm text-foreground/60 mt-3 max-w-[28ch] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {c.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED RESIDENCES */}
      <section className="py-28 px-6 md:px-10 bg-foreground/[0.02] border-t border-border">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.4em]">
                Featured Residences
              </span>
              <h2 className="text-3xl md:text-4xl font-serif mt-4 max-w-2xl">
                Currently held on the <span className="italic">private desk</span>
              </h2>
            </div>
            <Link
              to="/properties"
              className="text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1"
            >
              All {all.length} residences
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT ZONES */}
      <section className="py-28 px-6 md:px-10 border-t border-border">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif italic mb-4 max-w-2xl">
            Explore Dubai by opportunity zone
          </h2>
          <p className="text-muted-foreground max-w-xl mb-16">
            Not by listings — by yield corridors, scarcity profiles and capital flows.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border-y border-border">
            {zones.map((z, i) => (
              <Link
                to="/communities"
                key={z.name}
                className="group bg-background p-10 hover:bg-foreground/[0.03] transition-colors"
              >
                <span className="font-mono text-[10px] text-accent">
                  ({String(i + 1).padStart(2, "0")})
                </span>
                <h3 className="text-2xl font-serif mt-4">{z.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{z.tag}</p>
                <span className="inline-block mt-8 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/30 pb-1 group-hover:border-accent">
                  Explore Zone
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="py-32 px-6 md:px-10 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-6">
            Limited Distribution
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic mb-6">
            The Dubai Investment Intelligence Report
          </h2>
          <p className="text-muted-foreground mb-12 leading-relaxed">
            Off-market opportunities, U.S. vs Dubai comparative analysis, tax structuring,
            and our proprietary outlook on the next growth corridors.
          </p>
          {leadSent ? (
            <div className="border border-accent/40 max-w-xl mx-auto p-8">
              <p className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">Confirmed</p>
              <p className="text-base font-serif mt-3">The report is on its way. A senior advisor will follow up via WhatsApp with the secure download.</p>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-0 border border-border max-w-xl mx-auto" onSubmit={onLeadSubmit}>
              <label htmlFor="lead-email" className="sr-only">Email</label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                maxLength={255}
                placeholder="Investment Email Address"
                className="flex-1 bg-transparent px-6 py-4 text-xs uppercase tracking-[0.2em] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="bg-accent text-accent-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all"
              >
                Download Report
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Intelligence tools grid */}
      <section className="py-28 px-6 md:px-10 border-t border-border">
        <div className="max-w-screen-2xl mx-auto">
          <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-6">Intelligence Tools</span>
          <h2 className="text-3xl md:text-5xl font-serif italic mb-14 max-w-3xl">A private terminal for Dubai investment.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            <ToolTile to="/quiz" eyebrow="AI Match" title="Find my ideal Dubai investment" body="A concierge-grade quiz that maps capital, lifestyle and ROI goals to a personalised allocation." />
            <ToolTile to="/heatmap" eyebrow="Heatmap" title="Dubai investment heatmap" body="Yield, appreciation, demand and momentum visualised across prime districts." />
            <ToolTile to="/compare" eyebrow="Compare" title="Community benchmark" body="Side-by-side comparison of up to four luxury communities on twelve metrics." />
            <ToolTile to="/dashboard" eyebrow="Dashboard" title="Investor lounge preview" body="Portfolio NAV, ROI tracking, watchlists and off-market access for qualified clients." />
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-28 px-6 md:px-10 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-6">Investor FAQ</span>
          <h2 className="text-3xl md:text-4xl font-serif italic mb-12">Questions from international investors</h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="cursor-pointer list-none flex items-baseline justify-between gap-6">
                  <span className="text-lg font-serif">{f.q}</span>
                  <span className="font-mono text-accent text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-3xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <span className="font-mono text-accent text-sm">{value}</span>
    </div>
  );
}

function ToolTile({ to, eyebrow, title, body }: { to: string; eyebrow: string; title: string; body: string }) {
  return (
    <Link to={to} className="group bg-background p-10 hover:bg-foreground/[0.03] transition-all">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</span>
      <h3 className="font-serif text-2xl mt-4 italic leading-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{body}</p>
      <span className="inline-block mt-8 text-[10px] uppercase tracking-[0.3em] text-accent border-b border-accent/40 pb-1 group-hover:border-accent">Enter →</span>
    </Link>
  );
}


