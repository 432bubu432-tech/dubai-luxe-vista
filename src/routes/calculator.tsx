import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Dubai Real Estate ROI Calculator — Aureus Capital" },
      { name: "description", content: "Model net yield, cash flow and 5-year appreciation for a Dubai luxury real estate investment with the Aureus Capital ROI calculator." },
      { property: "og:title", content: "Dubai Real Estate ROI Calculator" },
      { property: "og:description", content: "Model net yield, cash flow and appreciation on Dubai luxury property." },
      { property: "og:url", content: "/calculator" },
    ],
    links: [{ rel: "canonical", href: "/calculator" }],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const [price, setPrice] = useState(5_000_000);
  const [grossYield, setGrossYield] = useState(8);
  const [opex, setOpex] = useState(15);
  const [appreciation, setAppreciation] = useState(7);

  const numbers = useMemo(() => {
    const grossAnnual = price * (grossYield / 100);
    const netAnnual = grossAnnual * (1 - opex / 100);
    const fiveYearValue = price * Math.pow(1 + appreciation / 100, 5);
    const fiveYearGain = fiveYearValue - price;
    const totalReturn = (netAnnual * 5) + fiveYearGain;
    const irr = (totalReturn / price / 5) * 100;
    return { grossAnnual, netAnnual, fiveYearValue, fiveYearGain, irr };
  }, [price, grossYield, opex, appreciation]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Intelligence Tool"
        title={<>Dubai <span className="italic">ROI</span> calculator</>}
        intro="A directional model for net yield, holding cost and 5-year appreciation. Engage an advisor for a property-specific underwriting."
      />
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <Slider label="Acquisition Price (USD)" value={price} min={500_000} max={50_000_000} step={100_000} format={fmtUsd} onChange={setPrice} />
            <Slider label="Gross Rental Yield" value={grossYield} min={3} max={14} step={0.1} format={(v) => `${v.toFixed(1)}%`} onChange={setGrossYield} />
            <Slider label="Operating Cost (% of gross)" value={opex} min={5} max={40} step={1} format={(v) => `${v}%`} onChange={setOpex} />
            <Slider label="Annual Appreciation" value={appreciation} min={0} max={15} step={0.5} format={(v) => `${v.toFixed(1)}%`} onChange={setAppreciation} />
          </div>
          <div className="bg-foreground/[0.03] border border-border p-10 space-y-8">
            <Result label="Gross Annual Income" value={fmtUsd(numbers.grossAnnual)} />
            <Result label="Net Annual Income" value={fmtUsd(numbers.netAnnual)} />
            <Result label="5-Year Property Value" value={fmtUsd(numbers.fiveYearValue)} />
            <Result label="5-Year Capital Gain" value={fmtUsd(numbers.fiveYearGain)} />
            <Result label="Indicative Annualized Return" value={`${numbers.irr.toFixed(2)}%`} accent />
            <Link to="/concierge" className="block text-center mt-10 px-6 py-4 border border-accent/50 text-accent text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-accent-foreground transition-all duration-500">
              Underwrite a Specific Property
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function Slider({ label, value, min, max, step, format, onChange }: { label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{label}</span>
        <span className="font-serif text-xl">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(var(--accent))]"
      />
    </div>
  );
}

function Result({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <span className={`font-serif text-2xl ${accent ? "text-accent" : ""}`}>{value}</span>
    </div>
  );
}
