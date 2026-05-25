import { NavLink, useLocation } from "react-router-dom";
import { Bot, Car, Home, LayoutGrid, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import { MoreModulesSheet } from "./MoreModulesSheet";

const primaryItems = [
  { to: "/dashboard", labelKey: "home" as const, icon: Home },
  { to: "/gigpay", labelKey: "gigpay" as const, icon: Wallet },
  { to: "/ev-command", labelKey: "ev" as const, icon: Car },
  { to: "/dispatch", labelKey: "dispatch" as const, icon: Bot },
] as const;

const hiddenPaths = ["/", "/auth", "/onboarding", "/welcome", "/offline"];

export const BottomNav = () => {
  const loc = useLocation();
  const { t } = useI18n();

  if (hiddenPaths.some((p) => loc.pathname === p || loc.pathname.startsWith("/auth"))) return null;

  const labels: Record<(typeof primaryItems)[number]["labelKey"], string> = {
    home: t.nav.home,
    gigpay: t.nav.gigpay,
    ev: "GigEV",
    dispatch: t.nav.dispatch,
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[max(env(safe-area-inset-bottom),0.5rem)] px-3">
      <div className="mx-auto flex max-w-md items-stretch gap-1 rounded-2xl border border-primary/25 bg-background/90 px-1 py-2 shadow-[0_-12px_40px_hsl(var(--background)/0.9),0_0_24px_-8px_hsl(var(--primary)/0.35)] backdrop-blur-2xl">
        {primaryItems.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary shadow-[inset_0_0_20px_hsl(var(--primary)/0.15)]"
                  : "text-muted-foreground active:scale-95 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                )}
                <Icon className={cn("h-5 w-5", isActive && "scale-110 drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
                <span className="text-[9px] font-bold leading-none tracking-wide">{labels[labelKey]}</span>
              </>
            )}
          </NavLink>
        ))}
        <MoreModulesSheet
          trigger={
            <button
              type="button"
              className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-muted-foreground transition-all hover:bg-muted/30 hover:text-foreground active:scale-95"
              aria-label="More modules"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="text-[9px] font-bold leading-none">More</span>
            </button>
          }
        />
      </div>
    </nav>
  );
};
