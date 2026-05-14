import { Link } from "@tanstack/react-router";

const links = [
  { to: "/properties", label: "Properties" },
  { to: "/communities", label: "Communities" },
  { to: "/investment", label: "Intelligence" },
  { to: "/developers", label: "Developers" },
  { to: "/services", label: "Services" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif tracking-tight text-accent italic">
          Aureus<span className="text-foreground/80">&nbsp;Capital</span>
        </Link>
        <div className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/concierge"
          className="hidden md:inline-block px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-500"
        >
          Private Access
        </Link>
      </div>
    </nav>
  );
}
