// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

/** Vercel sets VERCEL=1 automatically; override with DEPLOY_TARGET=cloudflare for Wrangler. */
const isVercel =
  process.env.DEPLOY_TARGET === "vercel" || process.env.VERCEL === "1";
/** Spaceship shared hosting: SPA shell + optional route prerender (LiteSpeed, no Node SSR). */
const isSpaceship = process.env.DEPLOY_TARGET === "spaceship";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    ...(isSpaceship
      ? {
          spa: {
            enabled: true,
            prerender: {
              enabled: true,
              crawlLinks: true,
            },
          },
          prerender: {
            enabled: true,
            crawlLinks: true,
            failOnError: false,
          },
        }
      : {}),
  },
  cloudflare: isVercel || isSpaceship ? false : undefined,
  plugins: isVercel ? [nitro({ preset: "vercel" })] : [],
  preview: isSpaceship ? { host: "127.0.0.1" } : undefined,
  vite: {
    server: {
      port: 5173,
      strictPort: false,
      host: true,
    },
  },
});
