// Reads the property library that was imported once from Google Drive into
// src/data/properties.ts. No runtime Drive or database calls are involved.
import { PROPERTIES, type PropertyRecord, type PropertyMedia } from "@/data/properties";

export type PropertyCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  hero_image_url: string | null;
  price: string | null;
  location: string | null;
  developer: string | null;
  bedrooms: string | null;
  featured: boolean;
};

const card = (p: PropertyRecord): PropertyCard => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  category: p.category,
  hero_image_url: p.hero_image_url,
  price: p.price,
  location: p.location,
  developer: p.developer,
  bedrooms: p.bedrooms,
  featured: p.featured,
});

const byName = (a: PropertyRecord, b: PropertyRecord) => a.name.localeCompare(b.name);
const featuredFirst = (a: PropertyRecord, b: PropertyRecord) =>
  Number(b.featured) - Number(a.featured) || byName(a, b);

export async function listProperties(): Promise<PropertyCard[]> {
  return [...PROPERTIES].sort(featuredFirst).map(card);
}

export async function listFeatured(): Promise<PropertyCard[]> {
  const flagged = PROPERTIES.filter((p) => p.featured && p.hero_image_url);
  const rich = PROPERTIES.filter((p) => !p.featured && p.hero_image_url)
    .slice()
    .sort((a, b) => b.media.length - a.media.length);
  return [...flagged, ...rich].slice(0, 6).map(card);
}

export async function listByCategory({
  data,
}: {
  data: { category: string };
}): Promise<PropertyCard[]> {
  return PROPERTIES.filter((p) => p.category === data.category)
    .sort(featuredFirst)
    .map(card);
}

export type PropertyDetail = {
  property: PropertyCard & { description: string };
  media: PropertyMedia[];
  related: PropertyCard[];
};

export async function getProperty({
  data,
}: {
  data: { slug: string };
}): Promise<PropertyDetail | null> {
  const found = PROPERTIES.find((p) => p.slug === data.slug);
  if (!found) return null;
  const related = PROPERTIES.filter(
    (p) => p.category === found.category && p.slug !== found.slug && p.hero_image_url,
  )
    .sort(featuredFirst)
    .slice(0, 4)
    .map(card);
  return {
    property: { ...card(found), description: found.description },
    media: found.media,
    related,
  };
}
