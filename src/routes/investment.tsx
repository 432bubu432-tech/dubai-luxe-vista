import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/investment")({
  head: () => ({
    meta: [
      { title: "Dubai Real Estate Investment Intelligence — Aureus Capital" },
      {
        name: "description",
        content:
          "Institutional-grade analysis of Dubai real estate: ROI corridors, tax structure, residency pathways, and U.S. investor guidance.",
      },
      { property: "og:title", content: "Dubai Real Estate Investment Intelligence" },
      { property: "og:description", content: "ROI corridors, tax structure, residency pathways and U.S. investor guidance." },
      { property: "og:url", content: "/investment" },
    ],
    links: [{ rel: "canonical", href: "/investment" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Can Americans buy property in Dubai?", acceptedAnswer: { "@type": "Answer", text: "Yes — U.S. citizens can legally purchase property in designated freehold zones across Dubai." } },
            { "@type": "Question", name: "Does Dubai have property tax?", acceptedAnswer: { "@type": "Answer", text: "No annual property tax system like the United States." } },
            { "@type": "Question", name: "Is Dubai real estate a good investment?", acceptedAnswer: { "@type": "Answer", text: "Dubai offers strong rental yields (6–12%), tax efficiency and global demand." } },
            { "@type": "Question", name: "What are the best ROI areas in Dubai?", acceptedAnswer: { "@type": "Answer", text: "Palm Jumeirah, Downtown Dubai, Dubai Marina and Business Bay lead on ROI and liquidity." } },
          ],
        }),
      },
    ],
  }),
  component: InvestmentPage,
});

const reports = [
  { tag: "Market Report", title: "Dubai Luxury Market Trends 2026", body: "Capital flows, supply pipelines and yield compression across prime districts." },
  { tag: "U.S. Investor", title: "Can Americans Buy Property in Dubai?", body: "Legal framework, tax treatment and remote-acquisition workflow." },
  { tag: "ROI", title: "Dubai vs Miami Investment", body: "Side-by-side: net yield, holding cost, currency exposure and liquidity." },
  { tag: "Residency", title: "Golden Visa Pathways", body: "Investment thresholds and household coverage for 10-year residency." },
];

const faqs = [
  { q: "Can foreigners buy property in Dubai?", a: "Yes, in designated freehold areas, with full ownership rights." },
  { q: "Is Dubai real estate a good investment?", a: "Dubai offers strong rental yields, tax efficiency and global demand." },
  { q: "Best area to invest in Dubai?", a: "Palm Jumeirah, Downtown Dubai and Dubai Marina lead premium investment activity." },
  { q: "Does Dubai have property tax?", a: "No annual property tax system." },
  { q: "Can I invest remotely?", a: "Yes — most acquisitions can be completed digitally with advisory support." },
];

function InvestmentPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Intelligence Hub"
        title={<>Dubai Real Estate <span className="italic">Investment Intelligence</span></>}
        intro="An authoritative library of market reports, ROI guidance, tax analysis and residency pathways — written for institutional and high-net-worth international investors."
      />

      <section className="px-6 md:px-10 py-20 border-b border-border">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-y border-border">
          {reports.map((r) => (
            <article key={r.title} className="bg-background p-12 hover:bg-foreground/[0.02] transition-colors">
              <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em]">{r.tag}</span>
              <h3 className="text-2xl font-serif mt-4">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{r.body}</p>
              <Link to="/concierge" className="inline-block mt-8 text-[10px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-1">
                Download Report
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-28">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.4em]">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-serif italic mt-4 mb-12">
            Investor questions, answered
          </h2>
          <dl className="divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <div key={f.q} className="py-8">
                <dt className="text-lg font-serif">{f.q}</dt>
                <dd className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
