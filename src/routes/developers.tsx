import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Dubai's Premier Real Estate Developers — Aureus Capital" },
      { name: "description", content: "Profiles of Dubai's leading developers — Emaar, Damac, Nakheel, Sobha, Meraas, Omniyat, Select Group — with delivery records, brand standing and investor suitability." },
      { property: "og:title", content: "Dubai's Premier Real Estate Developers" },
      { property: "og:description", content: "Institutional profiles of Dubai's most significant developers." },
      { property: "og:url", content: "/developers" },
    ],
    links: [{ rel: "canonical", href: "/developers" }],
  }),
  component: DevelopersPage,
});

const developers = [
  { name: "Emaar Properties", focus: "Downtown · Dubai Hills · Creek Harbour", note: "Author of Burj Khalifa and Dubai's most liquid prime inventory.", tier: "Tier I" },
  { name: "Damac", focus: "Branded residences · Golf communities", note: "Aligned with Cavalli, Versace, de GRISOGONO for branded inventory.", tier: "Tier I" },
  { name: "Nakheel", focus: "Palm Jumeirah · Palm Jebel Ali", note: "Master developer of Dubai's iconic waterfront archipelagos.", tier: "Tier I" },
  { name: "Sobha Realty", focus: "Sobha Hartland · MBR City", note: "In-house construction with reputation for build quality and finish.", tier: "Tier I" },
  { name: "Meraas", focus: "Bluewaters · City Walk · La Mer", note: "Lifestyle-led urban districts with strong rental performance.", tier: "Tier I" },
  { name: "Omniyat", focus: "Ultra-luxury · One Palm · Lana Dorchester", note: "Designer-led ultra-prime towers with branded hospitality.", tier: "Boutique" },
  { name: "Select Group", focus: "Dubai Marina · Six Senses Residences", note: "Waterfront specialists with award-winning marina towers.", tier: "Boutique" },
  { name: "Ellington Properties", focus: "Design-driven mid-prime", note: "Architectural rigor and considered residential design.", tier: "Boutique" },
];

function DevelopersPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Developer Intelligence"
        title={<>Dubai's most significant <span className="italic">developers</span></>}
        intro="A curated reference of Dubai's master developers and boutique houses — evaluated on delivery record, build quality, brand alignment and investor liquidity."
      />
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-y border-border">
          {developers.map((d) => (
            <article key={d.name} className="bg-background p-10">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-serif">{d.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{d.tier}</span>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">{d.focus}</p>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{d.note}</p>
              <Link to="/concierge" className="inline-block mt-8 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1">
                Request Developer Brief
              </Link>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
