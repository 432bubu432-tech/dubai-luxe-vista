import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { ConciergeRail } from "./ConciergeRail";
import { ExitIntent } from "./ExitIntent";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="pt-20">{children}</main>
      <SiteFooter />
      <ConciergeRail />
      <ExitIntent />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <div className="mb-16 max-w-3xl">
      {eyebrow && (
        <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-6">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] text-balance">{title}</h2>
      {intro && <p className="mt-6 text-muted-foreground text-base leading-relaxed max-w-xl">{intro}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
}) {
  return (
    <section className="px-6 md:px-10 pt-16 pb-24 border-b border-border">
      <div className="max-w-screen-2xl mx-auto">
        <span className="block font-mono text-accent text-[10px] uppercase tracking-[0.4em] mb-8 animate-reveal">
          {eyebrow}
        </span>
        <h1 className="text-5xl md:text-7xl font-serif leading-[1.05] text-balance max-w-5xl animate-reveal [animation-delay:150ms]">
          {title}
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed animate-reveal [animation-delay:300ms]">
          {intro}
        </p>
      </div>
    </section>
  );
}
