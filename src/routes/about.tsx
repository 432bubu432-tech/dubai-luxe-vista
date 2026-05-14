import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aureus Capital — Dubai Luxury Real Estate Advisory" },
      { name: "description", content: "We are a private investment advisory specializing in Dubai luxury real estate for international investors. Discretion, intelligence, and access." },
      { property: "og:title", content: "About Aureus Capital" },
      { property: "og:description", content: "Private investment advisory for Dubai luxury real estate." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Firm"
        title={<>A private gateway into <span className="italic">Dubai's most exclusive</span> real estate</>}
        intro="Aureus Capital is an investment advisory built for international principals — combining luxury brand storytelling, institutional-grade intelligence, and concierge-level execution."
      />

      <section className="px-6 md:px-10 py-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { n: "01", t: "Discretion", b: "Off-market access for qualified principals only." },
            { n: "02", t: "Intelligence", b: "Forty-two-point asset analysis and live market data." },
            { n: "03", t: "Access", b: "Direct allocations from EMAAR, DAMAC and Ellington." },
          ].map((p) => (
            <div key={p.n} className="space-y-3">
              <span className="font-mono text-[10px] text-accent">({p.n})</span>
              <h3 className="text-xl font-serif">{p.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif italic mb-6">Begin a private conversation</h2>
          <p className="text-muted-foreground mb-10">
            Our advisory desk is available to qualified investors evaluating exposure to the Dubai luxury market.
          </p>
          <Link to="/concierge" className="inline-block px-8 py-4 bg-accent text-accent-foreground text-xs uppercase tracking-[0.25em] font-medium hover:brightness-110">
            Request Private Access
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
