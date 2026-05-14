import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import heroPalm from "@/assets/hero-palm.jpg";
import skyline from "@/assets/collection-skyline.jpg";
import waterfront from "@/assets/collection-waterfront.jpg";
import branded from "@/assets/collection-branded.jpg";
import yieldImg from "@/assets/collection-yield.jpg";
import propNoir from "@/assets/property-noir.jpg";

export const Route = createFileRoute("/communities")({
  head: () => ({
    meta: [
      { title: "Dubai Luxury Communities & Investment Zones — Aureus Capital" },
      {
        name: "description",
        content:
          "Explore Dubai's most exclusive communities — Palm Jumeirah, Downtown Dubai, Emirates Hills, Dubai Hills Estate. Each zone analyzed for ROI and lifestyle.",
      },
      { property: "og:title", content: "Dubai Luxury Communities & Investment Zones" },
      { property: "og:description", content: "Investment-zone analysis across Dubai's most exclusive districts." },
      { property: "og:url", content: "/communities" },
    ],
    links: [{ rel: "canonical", href: "/communities" }],
  }),
  component: CommunitiesPage,
});

const communities = [
  { name: "Palm Jumeirah", body: "Dubai's most iconic ultra-luxury waterfront community.", img: heroPalm, tier: "Capital Preservation" },
  { name: "Downtown Dubai", body: "The global skyline core, anchored by the Burj Khalifa.", img: propNoir, tier: "Appreciation" },
  { name: "Dubai Marina", body: "Dense yield corridor with strong short-term rental demand.", img: skyline, tier: "High-Yield" },
  { name: "Emirates Hills", body: "Ultra-private gated estates for legacy wealth.", img: waterfront, tier: "Legacy" },
  { name: "Dubai Hills Estate", body: "Family-oriented growth zone with new infrastructure.", img: branded, tier: "Growth" },
  { name: "Business Bay", body: "Urban income corridor with growing branded inventory.", img: yieldImg, tier: "Income" },
];

function CommunitiesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Investment Zones"
        title={<>Communities for the <span className="italic">global investor</span></>}
        intro="Each district is a discrete market with its own liquidity profile, demand drivers and architectural identity. We analyze them as you would a sector."
      />
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-y border-border">
          {communities.map((c) => (
            <article key={c.name} className="group bg-background relative overflow-hidden aspect-[16/10]">
              <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-10 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-mono">{c.tier}</span>
                <h3 className="text-3xl font-serif mt-3">{c.name}</h3>
                <p className="text-sm text-foreground/70 mt-3 max-w-md">{c.body}</p>
                <Link to="/properties" className="mt-6 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1 w-fit">
                  Browse Listings
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
