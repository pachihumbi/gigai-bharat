import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getAdminSession, isAdminUser, onAdminSession } from "@/lib/auth";

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getAdminSession()
      .then((s) => {
        if (mounted) setSession(s);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const unsubscribe = onAdminSession((s) => {
      if (s && !isAdminUser(s.user)) {
        setSession(null);
        return;
      }
      setSession(s);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { session, loading, isAdmin: isAdminUser(session?.user) };
}
