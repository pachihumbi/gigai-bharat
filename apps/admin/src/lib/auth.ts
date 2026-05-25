import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const role =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);
  return role === "admin";
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    throw new Error("This account does not have admin access.");
  }
  return data;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAdminSession(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function getAdminSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session && !isAdminUser(data.session.user)) {
    await supabase.auth.signOut();
    return null;
  }
  return data.session;
}
