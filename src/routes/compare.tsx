import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Dubai Communities — Aureus Capital" },
      { name: "description", content: "Side-by-side comparison of Dubai's prime luxury communities: yield, appreciation, lifestyle, privacy and investment stability." },
      { property: "og:title", content: "Compare Dubai Communities" },
      { property: "og:description", content: "Side-by-side comparison of Dubai's prime luxury communities." },
      { property: "og:url", content: "/compare" },
    ],
    links: [{ rel: "canonical", href: "/compare" }],
  }),
  component: ComparePage,
});

type Community = {
  id: string; name: string;
  avgPrice: string; yield: number; appreciation: number;
  lifestyle: number; family: number; privacy: number; luxury: number; stability: number; airbnb: number; walkability: number; waterfront: number; golf: number;
};

const all: Community[] = [
  { id: "palm", name: "Palm Jumeirah", avgPrice: "$1,650/sqft", yield: 7.2, appreciation: 12, lifestyle: 96, family: 88, privacy: 90, luxury: 99, stability: 95, airbnb: 94, walkability: 70, waterfront: 100, golf: 20 },
  { id: "downtown", name: "Downtown Dubai", avgPrice: "$1,200/sqft", yield: 6.8, appreciation: 10, lifestyle: 94, family: 75, privacy: 60, luxury: 95, stability: 96, airbnb: 92, walkability: 95, waterfront: 30, golf: 10 },
  { id: "marina", name: "Dubai Marina", avgPrice: "$900/sqft", yield: 8.5, appreciation: 9, lifestyle: 92, family: 72, privacy: 55, luxury: 86, stability: 90, airbnb: 96, walkability: 90, waterfront: 88, golf: 15 },
  { id: "emirates", name: "Emirates Hills", avgPrice: "$1,400/sqft", yield: 4.8, appreciation: 9, lifestyle: 80, family: 96, privacy: 99, luxury: 97, stability: 92, airbnb: 40, walkability: 30, waterfront: 10, golf: 95 },
  { id: "hills", name: "Dubai Hills Estate", avgPrice: "$850/sqft", yield: 6.0, appreciation: 11, lifestyle: 88, family: 95, privacy: 85, luxury: 88, stability: 93, airbnb: 72, walkability: 60, waterfront: 5, golf: 90 },
  { id: "bay", name: "Business Bay", avgPrice: "$780/sqft", yield: 7.5, appreciation: 8, lifestyle: 82, family: 65, privacy: 50, luxury: 78, stability: 88, airbnb: 90, walkability: 85, waterfront: 60, golf: 5 },
  { id: "bluewaters", name: "Bluewaters Island", avgPrice: "$1,500/sqft", yield: 7.8, appreciation: 11, lifestyle: 94, family: 85, privacy: 80, luxury: 92, stability: 91, airbnb: 88, walkability: 80, waterfront: 100, golf: 5 },
];

const metrics: { key: keyof Community; label: string; format?: (v: number) => string }[] = [
  { key: "avgPrice", label: "Avg. price" },
  { key: "yield", label: "Gross yield", format: (v) => `${v.toFixed(1)}%` },
  { key: "appreciation", label: "Appreciation", format: (v) => `${v}%` },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "family", label: "Family" },
  { key: "privacy", label: "Privacy" },
  { key: "luxury", label: "Luxury" },
  { key: "stability", label: "Stability" },
  { key: "airbnb", label: "STR potential" },
  { key: "walkability", label: "Walkability" },
  { key: "waterfront", label: "Waterfront" },
  { key: "golf", label: "Golf access" },
];

function ComparePage() {
  const [selected, setSelected] = useState<string[]>(["palm", "downtown", "marina"]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? [...prev.slice(1), id] : [...prev, id]
    );
  }

  const cols = all.filter((c) => selected.includes(c.id));

  return (
    <PageShell>
      <PageHero
        eyebrow="Community Intelligence"
        title={<>Compare Dubai's <span className="italic">prime communities</span></>}
        intro="Select up to four districts and benchmark yield, appreciation, lifestyle and investment stability side-by-side."
      />
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            {all.map((c) => {
              const on = selected.includes(c.id);
              return (
                <button key={c.id} onClick={() => toggle(c.id)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.25em] border transition-all ${on ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}>
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto -mx-6 md:mx-0">
            <div className="min-w-[640px] px-6 md:px-0">
              <div className="grid border border-border" style={{ gridTemplateColumns: `200px repeat(${cols.length}, minmax(140px, 1fr))` }}>
                <div className="p-5 bg-foreground/[0.03] border-b border-border">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Metric</span>
                </div>
                {cols.map((c) => (
                  <div key={c.id} className="p-5 bg-foreground/[0.03] border-b border-l border-border">
                    <span className="block font-serif text-lg italic">{c.name}</span>
                  </div>
                ))}
                {metrics.map((m, i) => (
                  <Row key={m.key as string} label={m.label} cols={cols} mkey={m.key} format={m.format} alt={i % 2 === 1} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/quiz" className="px-6 py-4 border border-border text-foreground text-[11px] uppercase tracking-[0.3em] hover:border-accent hover:text-accent transition-all">
              Take the AI Investor Quiz
            </Link>
            <Link to="/concierge" className="px-6 py-4 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.3em] hover:brightness-110">
              Discuss with an Advisor
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, cols, mkey, format, alt }: { label: string; cols: Community[]; mkey: keyof Community; format?: (v: number) => string; alt: boolean }) {
  const numeric = cols.every((c) => typeof c[mkey] === "number");
  const max = numeric ? Math.max(...cols.map((c) => c[mkey] as number)) : 0;
  return (
    <>
      <div className={`p-5 border-t border-border ${alt ? "bg-foreground/[0.02]" : ""}`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      </div>
      {cols.map((c) => {
        const v = c[mkey];
        const display = typeof v === "number" ? (format ? format(v) : String(v)) : String(v);
        const pct = numeric ? ((v as number) / max) * 100 : 0;
        return (
          <div key={c.id} className={`p-5 border-t border-l border-border ${alt ? "bg-foreground/[0.02]" : ""}`}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-serif text-lg">{display}</span>
              {numeric && (v as number) === max && <span className="font-mono text-[9px] text-accent uppercase tracking-[0.2em]">Top</span>}
            </div>
            {numeric && (
              <div className="h-px bg-border relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
