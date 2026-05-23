/**
 * Placeholder — replace by running at repo root:
 *   npm run db:types
 *
 * Or copy from apps/worker/src/integrations/supabase/types.ts after migration.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
