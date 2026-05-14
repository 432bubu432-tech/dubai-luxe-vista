import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import waterfront from "@/assets/collection-waterfront.jpg";
import skyline from "@/assets/collection-skyline.jpg";
import branded from "@/assets/collection-branded.jpg";
import yieldImg from "@/assets/collection-yield.jpg";
import propSerene from "@/assets/property-serene.jpg";
import propNoir from "@/assets/property-noir.jpg";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Curated Dubai Luxury Real Estate Portfolio — Aureus Capital" },
      {
        name: "description",
        content:
          "A hand-selected portfolio of Dubai's most exclusive residential and investment-grade properties. Waterfront villas, branded residences, skyline penthouses.",
      },
      { property: "og:title", content: "Curated Dubai Luxury Real Estate Portfolio" },
      { property: "og:description", content: "Hand-selected Dubai investment-grade properties." },
      { property: "og:url", content: "/properties" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
  component: PropertiesPage,
});

const filters = [
  { label: "Lifestyle", options: ["Waterfront", "Skyline", "Golf", "Branded"] },
  { label: "Strategy", options: ["Yield", "Appreciation", "Hybrid"] },
  { label: "Privacy", options: ["Ultra Private", "Semi-Private", "Active Urban"] },
  { label: "Ownership", options: ["End Use", "Investment", "Vacation"] },
];

const items = [
  { name: "The Serene Shore Villa", area: "Palm Jumeirah", price: "$14.2M", roi: "7.2%", img: propSerene },
  { name: "Penthouse Noir", area: "Downtown Dubai", price: "$8.5M", roi: "9.1%", img: propNoir },
  { name: "Marina Light Residence", area: "Dubai Marina", price: "$4.9M", roi: "8.6%", img: skyline },
  { name: "Hills Private Estate", area: "Emirates Hills", price: "$22.0M", roi: "5.4%", img: waterfront },
  { name: "The Atelier Branded", area: "Business Bay", price: "$3.7M", roi: "9.4%", img: branded },
  { name: "Tower Yield 14", area: "Business Bay", price: "$1.8M", roi: "11.2%", img: yieldImg },
];

function PropertiesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Portfolio"
        title={<>Curated Dubai Luxury <span className="italic">Real Estate</span></>}
        intro="A hand-selected portfolio of Dubai's most exclusive residential and investment-grade properties — vetted across 42 financial and architectural criteria."
      />

      {/* Filters */}
      <section className="px-6 md:px-10 py-12 border-b border-border">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {filters.map((f) => (
            <div key={f.label}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-mono mb-3">
                {f.label}
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {f.options.map((o) => (
                  <li key={o}>
                    <button className="hover:text-foreground transition-colors text-left">
                      {o}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border-y border-border">
          {items.map((p) => (
            <article key={p.name} className="group bg-background overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                  <span>{p.area}</span>
                  <span className="text-accent">ROI {p.roi}</span>
                </div>
                <h3 className="text-2xl font-serif mt-4">{p.name}</h3>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-serif text-accent">{p.price}</span>
                  <Link to="/concierge" className="text-[10px] uppercase tracking-[0.25em] border-b border-accent/40 pb-1 hover:text-accent">
                    Request Access
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
