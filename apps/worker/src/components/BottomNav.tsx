import { NavLink, useLocation } from "react-router-dom";
import { Home, Wallet, BookOpen, Camera, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export const BottomNav = () => {
  const loc = useLocation();
  const { t } = useI18n();

  const items = [
    { to: "/dashboard", label: t.nav.home, icon: Home },
    { to: "/ledger", label: t.nav.ledger, icon: BookOpen },
    { to: "/ocr", label: "OCR", icon: Camera },
    { to: "/welfare", label: t.nav.welfare, icon: Landmark },
    { to: "/gigpay", label: t.nav.gigpay, icon: Wallet },
  ];

  if (loc.pathname === "/" || loc.pathname === "/auth" || loc.pathname === "/onboarding") return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[max(env(safe-area-inset-bottom),0.5rem)] px-3">
      <div className="mx-auto max-w-md glass-card !rounded-2xl border-secondary/30 flex items-center justify-between px-1 py-2 backdrop-blur-2xl">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2 min-h-[44px] rounded-xl transition-all",
                isActive ? "bg-secondary/15 text-secondary" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "drop-shadow-[0_0_10px_hsl(var(--secondary))] scale-110")} />
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
