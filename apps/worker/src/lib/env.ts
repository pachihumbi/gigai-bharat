const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;

export type WorkerEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseProjectId: string | undefined;
  googleMapsKey: string | undefined;
  googleMapsTrackingId: string | undefined;
  allowInvestorDemo: boolean;
};

function readEnv(): WorkerEnv {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    supabaseProjectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    googleMapsKey: import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY,
    googleMapsTrackingId: import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID,
    allowInvestorDemo: import.meta.env.VITE_ALLOW_INVESTOR_DEMO === "true",
  };
}

export function getWorkerEnv(): WorkerEnv {
  return readEnv();
}

export function getMissingEnvKeys(): string[] {
  const env = readEnv();
  return required.filter((key) => {
    const value = key === "VITE_SUPABASE_URL" ? env.supabaseUrl : env.supabaseAnonKey;
    return !value.trim();
  });
}

function isValidSupabaseUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname.endsWith(".supabase.co") || parsed.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

function isValidAnonKey(key: string): boolean {
  const k = key.trim();
  return k.length >= 20 && k !== "your_supabase_anon_or_publishable_key" && k !== "placeholder-anon-key";
}

export function isSupabaseConfigured(): boolean {
  const env = readEnv();
  return (
    getMissingEnvKeys().length === 0 &&
    isValidSupabaseUrl(env.supabaseUrl) &&
    isValidAnonKey(env.supabaseAnonKey)
  );
}
