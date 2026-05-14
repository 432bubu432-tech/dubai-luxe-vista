import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Dubai Real Estate Insights & Market Journal — Aureus Capital" },
      { name: "description", content: "Editorial market intelligence on Dubai luxury real estate — capital flows, branded residences, yield analysis, residency, and U.S. investor strategy." },
      { property: "og:title", content: "Dubai Real Estate Insights" },
      { property: "og:description", content: "Editorial intelligence for international investors in Dubai." },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsPage,
});

const articles = [
  { tag: "Market", date: "May 2026", title: "Why Dubai Prime Yields Still Outperform Manhattan", read: "8 min" },
  { tag: "U.S. Investors", date: "Apr 2026", title: "The American's Guide to Acquiring in Dubai Remotely", read: "12 min" },
  { tag: "Branded", date: "Apr 2026", title: "Inside the Branded Residence Premium: Bulgari, Armani, Six Senses", read: "9 min" },
  { tag: "Residency", date: "Mar 2026", title: "Golden Visa: A Tax-Strategic Lens for HNW Families", read: "7 min" },
  { tag: "Capital Flows", date: "Mar 2026", title: "Where Family Offices Are Allocating in 2026", read: "10 min" },
  { tag: "Architecture", date: "Feb 2026", title: "The New Aesthetic of Dubai Ultra-Prime", read: "6 min" },
];

function InsightsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Journal"
        title={<>Editorial intelligence on Dubai <span className="italic">luxury real estate</span></>}
        intro="Long-form analysis written for principals, family offices and institutional allocators — published by the Aureus Capital research desk."
      />
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-screen-2xl mx-auto divide-y divide-border border-y border-border">
          {articles.map((a) => (
            <Link
              key={a.title}
              to="/concierge"
              className="group grid grid-cols-12 items-center gap-6 py-10 hover:bg-foreground/[0.02] transition-colors px-2"
            >
              <span className="col-span-3 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{a.tag}</span>
              <span className="col-span-3 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{a.date}</span>
              <h3 className="col-span-12 md:col-span-7 text-xl md:text-2xl font-serif text-balance group-hover:text-accent transition-colors">
                {a.title}
              </h3>
              <span className="hidden md:block md:col-span-1 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{a.read}</span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
