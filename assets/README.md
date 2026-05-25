# Assets

Static assets ship inside each app's `public/` folder (Vercel/CDN serves them).

| App | Path | Notable files |
|-----|------|---------------|
| Marketing | `apps/marketing/public/` | `favicon.svg`, `sitemap.xml`, `robots.txt`, `og-image` refs |
| Worker | `apps/worker/public/` | PWA icons (`icons/`), `manifest.webmanifest`, `favicon.svg` |
| Admin | `apps/admin/public/` | `favicon.ico` |

## Image optimization

- Prefer **SVG** for logos and icons (already used on marketing).
- Use WebP/AVIF for photos when added; Vercel Image Optimization available if you migrate hero assets to `next/image` patterns later.
- Keep hero meshes as CSS gradients (current approach) for Lighthouse performance.

## Brand

- Primary palette: graphite + Bharat saffron + electric cyan (`apps/marketing/src/styles.css`)
- Fonts: EB Garamond (display), Inter (body), JetBrains Mono (labels) — Google Fonts CDN on marketing
