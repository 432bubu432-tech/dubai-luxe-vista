import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { categoryLabel } from "@/lib/drive";
import type { PropertyCardData } from "./PropertyCard";

/**
 * Cinematic homepage hero: slow cross-fading Ken Burns carousel built from
 * real property imagery streamed out of the Drive library.
 */
export function HeroCarousel({ slides }: { slides: PropertyCardData[] }) {
  const usable = slides.filter((s) => s.hero_image_url);
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (usable.length < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % usable.length), 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [usable.length]);

  const active = usable[i];

  return (
    <section className="relative h-[92vh] min-h-[620px] overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        {usable.map((s, idx) => (
          <img
            key={s.slug}
            src={s.hero_image_url as string}
            alt={`${s.name} — ${categoryLabel(s.category)} in ${s.location ?? "Dubai"}`}
            loading={idx === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-[var(--ease-vault)] ${
              idx === i ? "opacity-100 animate-kenburns" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25" />
      </div>

      <div className="relative h-full max-w-screen-2xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-20">
        <span className="font-mono text-accent text-[10px] uppercase tracking-[0.45em] mb-8 animate-reveal">
          Dubai · Private Client Real Estate
        </span>
        <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.98] text-balance animate-reveal">
          The city's most consequential addresses, held privately.
        </h1>
        <p className="mt-8 max-w-xl text-muted-foreground leading-relaxed animate-reveal">
          A live portfolio of villas, branded residences, skyline towers and waterfront assets — each
          with full architectural media, floor plates and developer documentation on file.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4 animate-reveal">
          <Link
            to="/properties"
            className="px-7 py-4 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-accent/90 transition-colors"
          >
            Enter the portfolio
          </Link>
          <Link
            to="/concierge"
            className="px-7 py-4 border border-border text-[10px] uppercase tracking-[0.3em] hover:border-accent transition-colors"
          >
            Request private access
          </Link>
        </div>

        {active && (
          <div className="mt-14 flex items-end justify-between gap-6 border-t border-border pt-6">
            <Link to="/properties/$slug" params={{ slug: active.slug }} className="group">
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-accent">
                Now viewing · {categoryLabel(active.category)}
              </p>
              <p className="mt-2 font-serif text-2xl group-hover:text-accent transition-colors">
                {active.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {[active.location, active.developer].filter(Boolean).join(" · ")}
              </p>
            </Link>
            <div className="hidden md:flex gap-2">
              {usable.map((s, idx) => (
                <button
                  key={s.slug}
                  type="button"
                  aria-label={`Show ${s.name}`}
                  onClick={() => setI(idx)}
                  className={`h-[2px] w-10 transition-colors ${idx === i ? "bg-accent" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
