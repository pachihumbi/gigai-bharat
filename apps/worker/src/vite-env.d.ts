/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY?: string;
  readonly VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID?: string;
  /** Set to "true" to enable investor demo telemetry on production hosts */
  readonly VITE_ALLOW_INVESTOR_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
