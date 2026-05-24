import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { getMissingEnvKeys, isSupabaseConfigured } from "@/lib/env";

export function ConfigGuard({ children }: { children: ReactNode }) {
  if (isSupabaseConfigured()) return <>{children}</>;

  const missing = getMissingEnvKeys();

  return (
    <div className="min-h-screen grid place-items-center bg-[#020810] px-6">
      <div className="glass-card max-w-md p-6 text-center space-y-4">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
        <h1 className="text-xl font-bold text-white">Configuration required</h1>
        <p className="text-sm text-muted-foreground">
          Supabase environment variables are missing in this deployment. Add them in Vercel →
          Worker Project → Environment Variables, then redeploy.
        </p>
        <ul className="text-left text-xs font-mono text-amber-200/90 space-y-1">
          {missing.map((key) => (
            <li key={key}>• {key}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
