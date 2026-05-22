import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Investor Dashboard — Aureus Capital" },
      { name: "description", content: "A preview of the Aureus private investor dashboard: portfolio performance, ROI tracking, watchlists and off-market access." },
      { property: "og:title", content: "Aureus Investor Dashboard" },
      { property: "og:description", content: "Private investor dashboard preview for Dubai luxury real estate." },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

const portfolio = [
  { name: "Palm Jumeirah Villa", value: 14200000, change: +8.4 },
  { name: "Downtown Penthouse", value: 6800000, change: +4.1 },
  { name: "Creek Harbour Off-plan", value: 2200000, change: +12.7 },
];

const watchlist = [
  { name: "Bulgari Lighthouse Residence", price: "$9.4M", yield: "6.2%" },
  { name: "One Za'abeel — Sky Mansion", price: "$23.0M", yield: "5.4%" },
  { name: "Six Senses Residences Palm", price: "$11.6M", yield: "7.1%" },
];

function spark(values: number[]) {
  const max = Math.max(...values); const min = Math.min(...values);
  const span = max - min || 1;
  return values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - ((v - min) / span) * 100}`).join(" ");
}

function DashboardPage() {
  const total = portfolio.reduce((s, p) => s + p.value, 0);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <PageShell>
      <PageHero
        eyebrow="Investor Lounge — Preview"
        title={<>Your <span className="italic">private terminal</span></>}
        intro="An interactive preview of the Aureus dashboard: live portfolio performance, ROI tracking, off-market access and concierge intelligence — issued to qualified clients only."
      />

      <section className="px-6 md:px-10 py-16">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-px bg-border border border-border">
          <Card span="col-span-12 md:col-span-8">
            <Eyebrow>Portfolio NAV</Eyebrow>
            <div className="flex items-end justify-between mt-3">
              <p className="font-serif text-5xl">{fmt(total)}</p>
              <span className="font-mono text-xs text-accent">+7.9% YTD</span>
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-32 mt-8">
              <defs>
                <linearGradient id="navGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={spark([60, 58, 64, 62, 70, 72, 78, 76, 82, 88, 90, 94])} fill="none" stroke="currentColor" strokeWidth="0.6" className="text-accent" vectorEffect="non-scaling-stroke" />
              <polygon points={`${spark([60, 58, 64, 62, 70, 72, 78, 76, 82, 88, 90, 94])} 100,100 0,100`} fill="url(#navGrad)" className="text-accent" />
            </svg>
          </Card>
          <Card span="col-span-12 md:col-span-4">
            <Eyebrow>YTD ROI</Eyebrow>
            <p className="font-serif text-5xl mt-3">12.4%</p>
            <p className="text-xs text-muted-foreground mt-2">Yield + appreciation, net of opex.</p>
            <div className="mt-8 space-y-3">
              <Bar label="Yield" v={62} />
              <Bar label="Appreciation" v={88} />
              <Bar label="FX" v={32} />
            </div>
          </Card>

          <Card span="col-span-12 md:col-span-7">
            <Eyebrow>Holdings</Eyebrow>
            <ul className="mt-6 divide-y divide-border">
              {portfolio.map((p) => (
                <li key={p.name} className="py-4 flex items-center justify-between">
                  <span className="font-serif text-lg">{p.name}</span>
                  <div className="text-right">
                    <span className="block font-mono text-sm">{fmt(p.value)}</span>
                    <span className="text-xs text-accent">+{p.change}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card span="col-span-12 md:col-span-5">
            <Eyebrow>Off-market Watchlist</Eyebrow>
            <ul className="mt-6 space-y-4">
              {watchlist.map((w) => (
                <li key={w.name} className="border border-border p-4 hover:border-accent transition-all">
                  <span className="block font-serif text-lg">{w.name}</span>
                  <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
                    <span>{w.price}</span><span className="text-accent">Yield {w.yield}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card span="col-span-6 md:col-span-3">
            <Eyebrow>Reports</Eyebrow>
            <p className="font-serif text-3xl mt-3">12</p>
            <p className="text-xs text-muted-foreground">Available to download</p>
          </Card>
          <Card span="col-span-6 md:col-span-3">
            <Eyebrow>Consultations</Eyebrow>
            <p className="font-serif text-3xl mt-3">4</p>
            <p className="text-xs text-muted-foreground">Scheduled this quarter</p>
          </Card>
          <Card span="col-span-12 md:col-span-6">
            <Eyebrow>AI Recommendation</Eyebrow>
            <p className="font-serif text-xl mt-3 italic leading-snug">"Reallocate 12% of Downtown exposure to Creek Harbour off-plan — projected +3.4% IRR over 5 years."</p>
          </Card>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/concierge" className="px-6 py-4 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.3em] hover:brightness-110">
            Request Investor Access
          </Link>
          <Link to="/quiz" className="px-6 py-4 border border-border text-foreground text-[11px] uppercase tracking-[0.3em] hover:border-accent hover:text-accent">
            Build My Portfolio
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Card({ children, span }: { children: React.ReactNode; span: string }) {
  return <div className={`${span} bg-background p-8 md:p-10`}>{children}</div>;
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{children}</span>;
}
function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1">
        <span>{label}</span><span>{v}</span>
      </div>
      <div className="h-px bg-border relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
