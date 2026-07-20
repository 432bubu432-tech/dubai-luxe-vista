## Scope reality check

Your Drive folder contains **~85 property subfolders across 6 existing collection categories** (Featured, Signature Villas & Mansions, Branded, Skyline, Waterfront, Affordable). Each folder has images, brochures (PDF), floor plans, and sometimes videos.

I want to be straight with you before spending your credits: importing "all of it, fully automated, with brochure OCR → auto-filled specs, per-property AI assistant trained on each brochure, live Drive sync, email delivery of brochures, and Lighthouse 100" is not a single-turn job — it is a multi-turn build with real backend infrastructure. I'll do it in stages so you get value early and can steer.

The existing design system, routes, nav, homepage, SEO scaffolding, components, and animations are **not touched**. Everything below extends them.

## Categories → existing routes

Your six Drive folders map cleanly onto existing categories. No new categories needed:

```text
Featured Properties           → /properties (featured section)
Signature Villa & Mansions    → collection: signature-villas
The Branded Properties        → collection: branded
The Skyline Properties        → collection: skyline
The Waterfront Collection     → collection: waterfront
Affordable collection         → collection: yield
```

## Stage 1 — Foundation (this turn)

1. Enable Lovable Cloud (needed for brochure download lead capture, CRM, analytics, and eventual sync).
2. Create DB tables: `properties`, `property_media`, `brochure_leads`, `property_analytics_events`. Grants + RLS.
3. Storage buckets: `property-images` (public), `brochures` (private, signed URLs after lead capture).
4. Drive import server function (`src/lib/drive-import.functions.ts`, admin-only): walks the Drive folder tree, upserts a `properties` row per subfolder, downloads images + brochures into Storage, records media rows. Idempotent by Drive file ID.
5. Dynamic route `src/routes/properties.$slug.tsx` using the existing `PageShell`, typography, gold/charcoal tokens, and animation classes — hero image, gallery grid (existing card style), specs sidebar, brochure preview card, inquiry form wired to `captureLead()`, related-properties strip.
6. Update `/properties` and each collection landing to list DB-driven properties (falling back to existing static cards so nothing breaks if the import hasn't run).
7. Brochure download flow: click → existing lead form (name, email, phone) → insert `brochure_leads` → signed Storage URL returned → download starts.
8. Sitemap + JSON-LD `RealEstateListing` per property page. Meta title / description / OG derived from property name + category. Breadcrumbs.
9. Admin trigger: `/admin/import` page (gated) with "Run Drive import" button that calls the server function and streams progress.

Deliverable end of Stage 1: import all 85 folders, property pages live, brochures gated behind lead form, leads in DB.

## Stage 2 — Content extraction

- PDF brochure text extraction → auto-fill description, amenities, bedrooms, price, developer. Runs inside the import server function via `pdf-parse` (Worker-compatible) or a fallback prompt to Lovable AI on extracted text.
- Duplicate detection (image hash + folder name), best-hero heuristic, alt text via AI, WebP conversion at upload.
- Featured Snippet FAQ section per property, generated once from brochure text and cached.

## Stage 3 — Nice-to-haves

- Per-property AI assistant (chat over that property's brochure text via Lovable AI, RAG over the extracted text — not a fine-tune).
- Analytics events (brochure download, gallery open, tour click, WhatsApp click).
- Auto-sync: pg_cron every 6h calls the import function (Drive push notifications need a public HTTPS endpoint and channel renewal — cron is simpler and reliable).
- Favorites (requires auth) — flag for user confirmation before adding auth.

## Things I will not silently promise

- **Lighthouse 100 across the board** with 85 image-heavy pages is aspirational, not guaranteed. I'll do WebP, lazy loading, responsive sizes, and keep the existing lean layout; real scores depend on network and image counts.
- **Emailing brochures** requires the Lovable email domain flow (separate setup). Stage 1 delivers the download; email delivery is Stage 2 once you confirm you want to set up the email domain.
- **Drive push-sync in real time** is significantly more infra than 6-hourly cron; cron is the default unless you ask otherwise.

## Technical notes (safe to skip)

- Import runs server-side via `createServerFn` using the linked `google_drive` connector gateway. No secrets in client bundles.
- Storage: images public with long cache; brochures private, 15-min signed URLs issued only after `brochure_leads` insert succeeds.
- Slugs derived from folder name (kebab-cased, deduped). Property URL: `/properties/<slug>`.
- Existing static `/properties` grid stays; DB rows are appended above it and eventually replace it once import is verified.
- No changes to homepage, nav, footer, `SiteNav`, `PageShell`, `ConciergeRail`, `AIConcierge`, colors, fonts, or existing routes' metadata.

Confirm and I'll start Stage 1.
