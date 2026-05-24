import { supabase } from "@/integrations/supabase/client";

/** Ensures a worker_profiles row exists (DB trigger may lag on first signup). */
export async function ensureWorkerProfile(userId: string, name?: string) {
  const { data: existing } = await supabase
    .from("worker_profiles")
    .select("id, onboarded")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("worker_profiles")
    .insert({
      user_id: userId,
      name: name?.trim() || "Driver",
      vehicle_type: "VinFast_MPV7",
      platforms: [],
      onboarded: false,
    })
    .select("id, onboarded")
    .single();

  if (error) throw error;
  return created;
}

export async function resolvePostAuthPath(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/auth";

  try {
    const profile = await ensureWorkerProfile(
      user.id,
      (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0],
    );
    return profile.onboarded ? "/dashboard" : "/onboarding";
  } catch {
    return "/onboarding";
  }
}
