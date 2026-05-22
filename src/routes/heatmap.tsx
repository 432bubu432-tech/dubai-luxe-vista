import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Dubai Investment Heatmap — Aureus Capital" },
      { name: "description", content: "Interactive Dubai luxury investment heatmap. Yield, appreciation, demand and luxury scores by district." },
      { property: "og:title", content: "Dubai Investment Heatmap" },
      { property: "og:description", content: "Yield, appreciation, demand and luxury scores by Dubai district." },
      { property: "og:url", content: "/heatmap" },
    ],
    links: [{ rel: "canonical", href: "/heatmap" }],
  }),
  component: HeatmapPage,
});

type District = {
  id: string; name: string; x: number; y: number; r: number;
  yield: number; appreciation: number; demand: number; luxury: number; momentum: number; tag: string;
};

// Stylised coordinates on a 1000x600 canvas — not geographically exact.
const districts: District[] = [
  { id: "palm", name: "Palm Jumeirah", x: 240, y: 290, r: 60, yield: 7.2, appreciation: 12, demand: 95, luxury: 99, momentum: 92, tag: "Ultra-luxury" },
  { id: "marina", name: "Dubai Marina", x: 330, y: 330, r: 48, yield: 8.5, appreciation: 9, demand: 90, luxury: 86, momentum: 84, tag: "Yield + Liquidity" },
  { id: "bluewaters", name: "Bluewaters Island", x: 290, y: 260, r: 38, yield: 7.8, appreciation: 11, demand: 88, luxury: 92, momentum: 89, tag: "Scarcity" },
  { id: "downtown", name: "Downtown Dubai", x: 540, y: 360, r: 55, yield: 6.8, appreciation: 10, demand: 94, luxury: 95, momentum: 88, tag: "Trophy core" },
  { id: "business-bay", name: "Business Bay", x: 580, y: 410, r: 44, yield: 7.5, appreciation: 8, demand: 82, luxury: 78, momentum: 80, tag: "Cash flow" },
  { id: "hills", name: "Dubai Hills Estate", x: 470, y: 460, r: 50, yield: 6.0, appreciation: 11, demand: 86, luxury: 88, momentum: 90, tag: "Family estate" },
  { id: "emirates-hills", name: "Emirates Hills", x: 400, y: 430, r: 42, yield: 4.8, appreciation: 9, demand: 78, luxury: 97, momentum: 75, tag: "Private estate" },
  { id: "jvc", name: "JVC", x: 520, y: 510, r: 36, yield: 9.4, appreciation: 7, demand: 80, luxury: 60, momentum: 82, tag: "High yield" },
  { id: "creek", name: "Creek Harbour", x: 720, y: 380, r: 48, yield: 7.0, appreciation: 13, demand: 84, luxury: 84, momentum: 95, tag: "Emerging" },
];

function HeatmapPage() {
  const [active, setActive] = useState<District>(districts[0]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Market Intelligence"
        title={<>Dubai <span className="italic">investment heatmap</span></>}
        intro="A live cartography of yield, appreciation, demand and luxury concentration across Dubai's prime districts."
      />
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="relative bg-foreground/[0.03] border border-border overflow-hidden">
            <svg viewBox="0 0 1000 600" className="w-full h-auto block">
              <defs>
                {districts.map((d) => (
                  <radialGradient key={d.id} id={`g-${d.id}`}>
                    <stop offset="0%" stopColor={heatColor(d.momentum)} stopOpacity="0.9" />
                    <stop offset="60%" stopColor={heatColor(d.momentum)} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={heatColor(d.momentum)} stopOpacity="0" />
                  </radialGradient>
                ))}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity="0.06" />
                </pattern>
              </defs>
              <rect width="1000" height="600" fill="url(#grid)" className="text-foreground" />
              {/* Stylised coastline */}
              <path d="M0,200 C150,180 220,240 280,260 C340,280 380,320 460,330 C560,340 640,380 740,360 C840,340 940,360 1000,340 L1000,600 L0,600 Z"
                fill="currentColor" className="text-foreground/[0.04]" stroke="currentColor" strokeOpacity="0.1" />
              {districts.map((d) => (
                <g key={d.id} onClick={() => setActive(d)} onMouseEnter={() => setActive(d)} className="cursor-pointer">
                  <circle cx={d.x} cy={d.y} r={d.r * 1.6} fill={`url(#g-${d.id})`} />
                  <circle cx={d.x} cy={d.y} r={6} fill={heatColor(d.momentum)} />
                  <circle cx={d.x} cy={d.y} r={active.id === d.id ? 14 : 10} fill="none" stroke={heatColor(d.momentum)} strokeOpacity="0.7" />
                  <text x={d.x + 14} y={d.y + 4} className="fill-foreground" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    {d.name.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
              <span>Momentum index</span>
              <div className="flex items-center gap-2">
                <span>Low</span>
                <div className="h-1 w-32 rounded-full" style={{ background: "linear-gradient(90deg, #2c4a6e, #c9a84c, #e85d3a)" }} />
                <span>High</span>
              </div>
            </div>
          </div>

          <aside className="border border-border p-8 bg-foreground/[0.02] h-fit lg:sticky lg:top-28">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{active.tag}</span>
            <h3 className="text-3xl font-serif italic mt-3">{active.name}</h3>
            <div className="mt-8 space-y-5">
              <Metric label="Gross Rental Yield" value={`${active.yield.toFixed(1)}%`} score={active.yield * 10} />
              <Metric label="Annual Appreciation" value={`${active.appreciation}%`} score={active.appreciation * 7} />
              <Metric label="Demand Index" value={`${active.demand}`} score={active.demand} />
              <Metric label="Luxury Score" value={`${active.luxury}`} score={active.luxury} />
              <Metric label="Momentum" value={`${active.momentum}`} score={active.momentum} />
            </div>
            <Link to="/concierge" className="block text-center mt-10 px-6 py-4 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.3em] hover:brightness-110">
              Explore Opportunities Here
            </Link>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Metric({ label, value, score }: { label: string; value: string; score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
        <span className="font-serif text-lg">{value}</span>
      </div>
      <div className="h-px bg-border relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function heatColor(m: number) {
  if (m >= 90) return "#e85d3a";
  if (m >= 82) return "#c9a84c";
  return "#5a7fa8";
}
