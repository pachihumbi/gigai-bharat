/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_MAP_STYLE_URL?: string;
  readonly VITE_MAP_DEFAULT_LAT?: string;
  readonly VITE_MAP_DEFAULT_LNG?: string;
  readonly VITE_MAP_DEFAULT_ZOOM?: string;
  readonly VITE_GEO_PROXY_URL?: string;
  readonly VITE_ROUTE_PROXY_URL?: string;
  readonly VITE_EV_PROXY_URL?: string;
  /** Set to "true" to enable investor demo telemetry on production hosts */
  readonly VITE_ALLOW_INVESTOR_DEMO?: string;
  /** Web Push VAPID public key for notification subscriptions */
  readonly VITE_VAPID_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
