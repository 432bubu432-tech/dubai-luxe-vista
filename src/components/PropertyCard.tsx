import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { categoryLabel } from "@/lib/drive";
import { useSaved } from "@/hooks/useSaved";

export type PropertyCardData = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  hero_image_url: string | null;
  price?: string | null;
  location?: string | null;
  developer?: string | null;
  bedrooms?: string | null;
  featured?: boolean | null;
};

export function PropertyCard({ property, index = 0 }: { property: PropertyCardData; index?: number }) {
  const { isSaved, toggle } = useSaved();

  return (
    <article className="group relative">
      <Link to="/properties/$slug" params={{ slug: property.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {property.hero_image_url ? (
            <img
              src={property.hero_image_url}
              alt={`${property.name} — ${categoryLabel(property.category)}, ${property.location ?? "Dubai"}`}
              loading={index < 4 ? "eager" : "lazy"}
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-vault)] group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-muted-foreground">
              {property.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
          {property.featured && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground font-mono text-[9px] uppercase tracking-[0.3em]">
              Featured
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">
              {categoryLabel(property.category)}
            </p>
            <h3 className="mt-2 font-serif text-2xl leading-tight text-balance">{property.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {[property.location, property.developer].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={isSaved(property.slug) ? "Remove from shortlist" : "Save to shortlist"}
        onClick={() => toggle(property.slug)}
        className="absolute top-4 right-4 p-2 bg-background/70 backdrop-blur-sm border border-border hover:border-accent transition-colors"
      >
        <Heart
          className={`w-4 h-4 ${isSaved(property.slug) ? "fill-accent text-accent" : "text-foreground"}`}
        />
      </button>
      <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
        <span>{property.price ?? "Price on application"}</span>
        <Link
          to="/properties/$slug"
          params={{ slug: property.slug }}
          className="text-accent hover:underline"
        >
          View dossier
        </Link>
      </div>
    </article>
  );
}
