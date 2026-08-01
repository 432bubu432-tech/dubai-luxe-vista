ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.property_media ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.property_media ADD COLUMN IF NOT EXISTS media_group text;
CREATE INDEX IF NOT EXISTS properties_featured_idx ON public.properties (featured);
CREATE INDEX IF NOT EXISTS properties_category_idx ON public.properties (category);