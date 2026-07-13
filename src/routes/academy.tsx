import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Investor Academy — Aureus Capital" },
      { name: "description", content: "A private curriculum for global investors: Dubai market fundamentals, Golden Visa, tax structuring, off-plan strategy and portfolio diversification." },
      { property: "og:title", content: "Aureus Investor Academy" },
      { property: "og:description", content: "Institutional-grade education for Dubai real estate investors." },
      { property: "og:url", content: "/academy" },
    ],
    links: [{ rel: "canonical", href: "/academy" }],
  }),
  component: AcademyPage,
});

const modules = [
  { n: "01", title: "Dubai Market Fundamentals", body: "Freehold zones, historic price cycles, supply/demand dynamics and the AED-USD peg.", length: "6 lessons · 42 min" },
  { n: "02", title: "The U.S. Investor Playbook", body: "Cross-border tax treatment, LLC structuring, capital repatriation and FBAR compliance.", length: "5 lessons · 38 min" },
  { n: "03", title: "Golden Visa Pathway", body: "Qualifying thresholds, family inclusion, renewal, and property-backed vs deposit routes.", length: "4 lessons · 28 min" },
  { n: "04", title: "Yield vs Appreciation", body: "Modeling net yield after service charges, STR management, and long-hold appreciation curves.", length: "5 lessons · 34 min" },
  { n: "05", title: "Off-Plan Strategy", body: "Developer risk grading, payment plan optimization, handover premiums and resale timing.", length: "6 lessons · 45 min" },
  { n: "06", title: "Branded Residences", body: "Why hotel-branded assets command 30–50% premiums — and when they don't.", length: "3 lessons · 22 min" },
  { n: "07", title: "Portfolio Diversification", body: "Balancing waterfront trophy assets with high-yield income cores and off-plan optionality.", length: "4 lessons · 31 min" },
  { n: "08", title: "Exit Strategy", body: "Liquidity signals, private off-market resale channels, and generational wealth transfer.", length: "3 lessons · 24 min" },
];

function AcademyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Private Curriculum"
        title={<>The Aureus <span className="italic">Investor Academy</span></>}
        intro="A structured, institutional-grade curriculum on Dubai real estate — authored by our advisors, legal partners and market strategists."
      />

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {modules.map((m) => (
            <article key={m.n} className="bg-background p-10 group hover:bg-foreground/[0.03] transition-colors">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Module {m.n}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{m.length}</span>
              </div>
              <h3 className="text-2xl font-serif italic">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">{m.body}</p>
              <Link to="/concierge" className="inline-block mt-8 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1">
                Request Access
              </Link>
            </article>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Complimentary Enrollment</span>
          <h2 className="text-4xl font-serif italic mt-4 mb-6">Reserved for qualified investors.</h2>
          <p className="text-muted-foreground mb-10">Enrollment includes quarterly market briefings, private webinars with our strategists, and priority access to off-market inventory.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/concierge" className="px-8 py-4 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.3em] hover:brightness-110">Enroll Privately</Link>
            <Link to="/vault" className="px-8 py-4 border border-border text-foreground text-[11px] uppercase tracking-[0.3em] hover:border-accent hover:text-accent">Off-Market Vault</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
