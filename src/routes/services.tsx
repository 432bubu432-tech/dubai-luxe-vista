import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Private Client Services — Aureus Capital Dubai" },
      { name: "description", content: "End-to-end advisory: acquisition, portfolio structuring, residency, property management, citizenship, exit strategy and concierge for international investors in Dubai." },
      { property: "og:title", content: "Private Client Services — Dubai Real Estate" },
      { property: "og:description", content: "Acquisition, residency, portfolio structuring, exit and concierge." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  { n: "01", title: "Acquisition Advisory", body: "Sourcing, valuation, off-market access and full negotiation across Dubai's prime districts." },
  { n: "02", title: "Portfolio Structuring", body: "Holding entity design, jurisdictional planning and capital allocation across yield, growth and lifestyle assets." },
  { n: "03", title: "Golden Visa & Residency", body: "10-year residency pathways for principal, spouse, children and household — coordinated with legal counsel." },
  { n: "04", title: "Property & Asset Management", body: "Tenancy, maintenance, short-let optimization, refurbishment and net-yield reporting." },
  { n: "05", title: "Mortgage & Financing", body: "Introductions to private banks and Dubai lenders for non-resident financing structures." },
  { n: "06", title: "Exit & Liquidity", body: "Disposal strategy, market timing, off-market buyer matching and tax-efficient repatriation." },
  { n: "07", title: "Citizenship Advisory", body: "Coordination with global residency-by-investment partners across CBI/RBI programs." },
  { n: "08", title: "Lifestyle Concierge", body: "School placement, household staff, yacht berths, jet partners and private member introductions." },
];

function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Private Client"
        title={<>A single advisor for the <span className="italic">entire investment lifecycle</span></>}
        intro="Aureus Capital operates as your private office for Dubai — from first acquisition through residency, asset management and eventual exit."
      />
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-y border-border">
          {services.map((s) => (
            <article key={s.title} className="bg-background p-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{s.n}</span>
              <h3 className="text-2xl font-serif mt-4">{s.title}</h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </article>
          ))}
        </div>
        <div className="max-w-screen-2xl mx-auto mt-20 text-center">
          <Link to="/concierge" className="inline-block px-10 py-4 border border-accent/50 text-accent text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-accent-foreground transition-all duration-500">
            Engage a Private Advisor
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
