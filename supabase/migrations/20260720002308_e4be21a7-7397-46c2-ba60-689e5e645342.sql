
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  drive_folder_id text UNIQUE NOT NULL,
  description text,
  price text,
  bedrooms text,
  developer text,
  location text,
  hero_image_url text,
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published properties are public" ON public.properties FOR SELECT USING (published = true);

CREATE TABLE public.property_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  drive_file_id text NOT NULL,
  kind text NOT NULL,
  storage_path text NOT NULL,
  mime text,
  size_bytes bigint,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, drive_file_id)
);
GRANT SELECT ON public.property_media TO anon, authenticated;
GRANT ALL ON public.property_media TO service_role;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media of published properties is public" ON public.property_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.published = true));
CREATE INDEX ON public.property_media(property_id);
CREATE INDEX ON public.property_media(kind);

CREATE TABLE public.brochure_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.brochure_leads TO anon, authenticated;
GRANT ALL ON public.brochure_leads TO service_role;
ALTER TABLE public.brochure_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.brochure_leads FOR INSERT
  WITH CHECK (char_length(name) BETWEEN 1 AND 120 AND email ~* '^.+@.+\..+$' AND char_length(email) <= 200);

CREATE TABLE public.property_events (
  id bigserial PRIMARY KEY,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  event text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.property_events TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.property_events_id_seq TO anon, authenticated;
GRANT ALL ON public.property_events TO service_role;
GRANT ALL ON SEQUENCE public.property_events_id_seq TO service_role;
ALTER TABLE public.property_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log an event" ON public.property_events FOR INSERT
  WITH CHECK (char_length(event) BETWEEN 1 AND 60);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER properties_set_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
