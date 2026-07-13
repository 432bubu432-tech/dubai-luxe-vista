import { useEffect, useState } from "react";

const feed = [
  "Private acquisition — Palm Jumeirah villa, $14.2M",
  "New off-market — Bulgari Lighthouse residence",
  "U.S. investor onboarded — California family office",
  "Portfolio rebalanced — Downtown → Creek Harbour",
  "Golden Visa issued — 10-year residency, family of four",
  "Yield closing — Marina 2-bed at 9.1% net",
  "VIP viewing scheduled — Emirates Hills estate",
  "Off-plan launch — Six Senses Residences Palm",
];

export function ActivityTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % feed.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden md:flex items-center gap-3 px-4 py-2 border border-border bg-background/70 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Live</span>
      <span key={i} className="text-xs text-foreground/80 animate-reveal">{feed[i]}</span>
    </div>
  );
}
