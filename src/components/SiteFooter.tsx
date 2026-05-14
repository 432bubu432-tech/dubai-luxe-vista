import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="py-20 px-6 md:px-10 border-t border-border bg-background">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <span className="text-2xl font-serif tracking-tight text-accent italic mb-6 block">
            Aureus Capital
          </span>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            A private gateway into Dubai's most exclusive real estate
            investments — curated for international institutional and
            private capital.
          </p>
        </div>
        <div className="space-y-4">
          <h5 className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium">Portfolios</h5>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/properties" className="hover:text-foreground transition-colors">Waterfront Villas</Link></li>
            <li><Link to="/properties" className="hover:text-foreground transition-colors">Skyline Penthouses</Link></li>
            <li><Link to="/properties" className="hover:text-foreground transition-colors">Branded Residences</Link></li>
            <li><Link to="/investment" className="hover:text-foreground transition-colors">Yield Portfolio</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium">Headquarters</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DIFC Precinct Building 4<br />
            Level 12, Gate District<br />
            Dubai, United Arab Emirates
          </p>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.25em]">
          © 2026 Aureus Capital Advisory. All Rights Reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.25em] hover:text-accent">Privacy</a>
          <a href="#" className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.25em] hover:text-accent">Terms of Engagement</a>
        </div>
      </div>
    </footer>
  );
}
