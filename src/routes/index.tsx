import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { captureLead, whatsappUrl, buildLeadMessage } from "@/lib/contact";
import heroPalm from "@/assets/hero-palm.jpg";
import waterfront from "@/assets/collection-waterfront.jpg";
import skyline from "@/assets/collection-skyline.jpg";
import branded from "@/assets/collection-branded.jpg";
import yieldImg from "@/assets/collection-yield.jpg";
import propSerene from "@/assets/property-serene.jpg";
import propNoir from "@/assets/property-noir.jpg";

const faqs = [
  { q: "Can Americans buy property in Dubai?", a: "Yes. U.S. citizens and entities may acquire freehold property in designated zones across Dubai with no residency requirement, full ownership rights, and clear repatriation of capital." },
  { q: "Is Dubai real estate a good investment?", a: "Dubai offers 0% property and capital gains tax, AED-USD currency stability, gross rental yields of 6–9% in prime districts, and a 10-year Golden Visa for qualifying investors." },
  { q: "What are the best areas to invest in Dubai?", a: "Palm Jumeirah, Downtown Dubai, Dubai Marina, Emirates Hills, Dubai Hills Estate and Business Bay lead on liquidity, scarcity and net yield." },
  { q: "Does Dubai have property tax?", a: "No. There is no annual property tax, no capital gains tax, and no income tax on rental yield for individuals." },
  { q: "Can foreigners own property in Dubai?", a: "Foreign nationals may hold full freehold title in designated freehold zones, with the same protections as UAE nationals." },
];

export const Route = createFileRoute("/")({
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

const collections = [
  {
    title: "The Waterfront",
    sub: "Private Island Living",
    body: "Beachfront villas across Palm Jumeirah and exclusive coastal districts.",
    img: waterfront,
  },
  {
    title: "The Skyline",
    sub: "Urban Apex Portfolio",
    body: "Ultra-luxury penthouses in Downtown Dubai and Marina towers.",
    img: skyline,
  },
  {
    title: "Branded Homes",
    sub: "Hotel Heritage Assets",
    body: "Residences in partnership with global luxury and hospitality brands.",
    img: branded,
  },
  {
    title: "Yield Portfolio",
    sub: "Performance Driven",
    body: "Pre-vetted high-return investment properties with strong rental metrics.",
    img: yieldImg,
  },
];

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

const properties = [
  {
    name: "The Serene Shore Villa",
    location: "Palm Jumeirah · Frond G",
    price: "$14,200,000",
    yield: "Yield 7.2%",
    liquidity: "Liquidity A+",
    strategy: "Appreciation",
    body: "Sunset-aspect villa on the exclusive Frond G of Palm Jumeirah with bespoke Italian interiors and a private beach.",
    img: propSerene,
  },
  {
    name: "Penthouse Noir",
    location: "Downtown Dubai · Sky Residence",
    price: "$8,500,000",
    yield: "Yield 9.1%",
    liquidity: "Liquidity S",
    strategy: "High-Yield",
    body: "Dual-aspect sky residence in Downtown Dubai with a private lap pool and direct Burj Khalifa vistas.",
    img: propNoir,
  },
];

function HomePage() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative -mt-20 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-vault">
          <img
            src={heroPalm}
            alt="Aerial view of Palm Jumeirah at golden hour"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-6 animate-reveal [animation-delay:200ms]">
            A Private Portfolio
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-balance leading-[1.05] mb-10 animate-reveal [animation-delay:400ms]">
            Invest in Dubai's Most Exclusive{" "}
            <span className="italic">Luxury Real Estate</span> Opportunities
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-reveal [animation-delay:500ms]">
            A curated portfolio of waterfront villas, branded residences, and high-yield
            investment properties for global investors seeking tax-efficient wealth and
            world-class living.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal [animation-delay:600ms]">
            <Link
              to="/concierge"
              className="px-8 py-4 bg-accent text-accent-foreground text-xs uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all"
            >
              Request Private Access
            </Link>
            <Link
              to="/properties"
              className="px-8 py-4 bg-foreground/5 backdrop-blur-md border border-foreground/20 text-foreground text-xs uppercase tracking-[0.2em] font-medium hover:bg-foreground/15 transition-all"
            >
              Explore Curated Properties
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 md:left-12 hidden md:flex gap-12 border-l border-accent/40 pl-8 z-10">
          <div className="animate-reveal [animation-delay:800ms]">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.25em]">Market Performance</p>
            <p className="text-xl font-serif">6–12% Net Yields</p>
          </div>
          <div className="animate-reveal [animation-delay:900ms]">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.25em]">Fiscal Structure</p>
            <p className="text-xl font-serif italic">0% Property Tax</p>
          </div>
        </div>
      </section>

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
            <h2 className="text-3xl md:text-4xl font-serif italic">Curated Collections</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Precision-selected assets categorized by investment profile and lifestyle.
            </p>
          </div>
          <Link
            to="/properties"
            className="hidden md:inline text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/30 pb-1"
          >
            View All Assets
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border-y border-border">
          {collections.map((c) => (
            <Link
              key={c.title}
              to="/properties"
              className="group relative aspect-[3/4] bg-background overflow-hidden block"
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent p-8 flex flex-col justify-end">
                <p className="text-[10px] uppercase tracking-[0.25em] text-accent mb-2">{c.sub}</p>
                <h3 className="text-2xl font-serif">{c.title}</h3>
                <p className="text-sm text-foreground/60 mt-3 max-w-[28ch] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {c.body}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTELLIGENCE PROPERTIES */}
      <section className="py-28 px-6 md:px-10 bg-foreground/[0.02]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/3 lg:sticky lg:top-32 h-fit">
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.4em]">Intelligence Engine</span>
              <h2 className="text-3xl md:text-4xl font-serif mt-4 mb-6">
                Market <span className="italic">Intelligence</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Every asset is vetted through a 42-point analysis: historical liquidity,
                neighborhood gentrification curves and net operational yield projections.
              </p>
              <div className="space-y-4 border-t border-border pt-8">
                <Row label="Average ROI (Premium)" value="8.4%" />
                <Row label="Supply Scarcity Score" value="High" />
                <Row label="Demand Liquidity" value="A+" />
              </div>
              <Link
                to="/investment"
                className="inline-block mt-10 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1"
              >
                Get Personalized Analysis
              </Link>
            </div>

            <div className="w-full lg:w-2/3 space-y-24">
              {properties.map((p) => (
                <article key={p.name} className="group flex flex-col md:flex-row gap-10">
                  <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-accent/10 border border-accent/30 text-[9px] text-accent uppercase font-mono tracking-tight">
                        {p.yield}
                      </span>
                      <span className="px-3 py-1 bg-foreground/5 border border-border text-[9px] text-muted-foreground uppercase font-mono tracking-tight">
                        {p.liquidity}
                      </span>
                      <span className="px-3 py-1 bg-foreground/5 border border-border text-[9px] text-muted-foreground uppercase font-mono tracking-tight">
                        {p.strategy}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif mb-2">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{p.location}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-8">{p.body}</p>
                    <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Investment</p>
                        <p className="text-lg font-serif mt-1">{p.price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Strategy</p>
                        <p className="text-lg font-serif italic mt-1">{p.strategy}</p>
                      </div>
                    </div>
                    <Link
                      to="/concierge"
                      className="w-fit text-[10px] uppercase tracking-[0.25em] font-medium border-b border-accent pb-1 hover:text-accent transition-colors"
                    >
                      Request Full Financial Breakdown
                    </Link>
                  </div>
                </article>
              ))}
            </div>
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
          <form className="flex flex-col sm:flex-row gap-0 border border-border max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="lead-email" className="sr-only">Email</label>
            <input
              id="lead-email"
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
