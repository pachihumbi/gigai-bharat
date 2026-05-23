import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Home, Landmark, Map, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export const BottomNav = () => {
  const loc = useLocation();
  const { t } = useI18n();

  const items = [
    { to: "/dashboard", label: t.nav.home, icon: Home },
    { to: "/dispatch", label: t.nav.dispatch, icon: Map },
    { to: "/ledger", label: t.nav.ledger, icon: BookOpen },
    { to: "/welfare", label: t.nav.welfare, icon: Landmark },
    { to: "/gigpay", label: t.nav.gigpay, icon: Wallet },
  ];

  if (loc.pathname === "/" || loc.pathname === "/auth" || loc.pathname === "/onboarding") return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[max(env(safe-area-inset-bottom),0.5rem)] px-3">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-primary/20 bg-background/80 px-1 py-2 shadow-[0_-8px_32px_hsl(var(--background)/0.8)] backdrop-blur-2xl">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-all",
                isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110 drop-shadow-[0_0_10px_hsl(var(--primary))]",
                  )}
                />
                <span className="text-[9px] font-semibold leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
