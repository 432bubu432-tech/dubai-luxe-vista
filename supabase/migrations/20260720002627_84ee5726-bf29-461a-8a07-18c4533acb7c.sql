
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;

GRANT SELECT ON public.property_media TO anon, authenticated;
GRANT ALL ON public.property_media TO service_role;

GRANT INSERT ON public.brochure_leads TO anon, authenticated;
GRANT ALL ON public.brochure_leads TO service_role;

GRANT INSERT ON public.property_events TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.property_events_id_seq TO anon, authenticated;
GRANT ALL ON public.property_events TO service_role;
GRANT ALL ON SEQUENCE public.property_events_id_seq TO service_role;
