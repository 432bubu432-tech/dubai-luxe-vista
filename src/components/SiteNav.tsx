import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { CATEGORIES } from "@/lib/drive";

const links = [
  { to: "/properties", label: "Portfolio" },
  { to: "/vault", label: "Vault" },
  { to: "/heatmap", label: "Heatmap" },
  { to: "/compare", label: "Compare" },
  { to: "/quiz", label: "AI Match" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif tracking-tight text-accent italic">
          Aureus<span className="text-foreground/80">&nbsp;Capital</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          <div className="group relative">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors cursor-default">
              Collections
            </span>
            <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="w-72 border border-border bg-background/95 backdrop-blur-md p-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    to="/collections/$category"
                    params={{ category: c.key }}
                    className="block px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <span className="block text-[11px] uppercase tracking-[0.2em]">{c.label}</span>
                    <span className="block mt-1 text-[10px] text-muted-foreground">{c.tagline}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/concierge"
            className="hidden md:inline-block px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-500"
          >
            Private Access
          </Link>
        </div>
      </div>
    </nav>
  );
}
