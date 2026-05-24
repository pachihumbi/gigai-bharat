import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth";
import { toast } from "sonner";

/**
 * Legacy Lovable broker path (`/~oauth/initiate`, `/oauth/initiate`).
 * On Vercel the broker is unavailable — restart via Supabase Google OAuth.
 */
const OAuthInitiate = () => {
  const nav = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error("OAuth initiate failed:", err);
        toast.error("Google sign-in failed. Redirecting to login…");
        nav("/auth", { replace: true });
      }
    })();
  }, [nav]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-hero">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Redirecting to Google…</p>
      </div>
    </div>
  );
};

export default OAuthInitiate;
