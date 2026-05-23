import { NavLink, useLocation } from "react-router-dom";
import { Home, Map, Wallet, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", kn: "ಮನೆ", icon: Home },
  { to: "/hub", label: "Smart Hub", kn: "ಹಬ್", icon: Sparkles },
  { to: "/map", label: "Map", kn: "ನಕ್ಷೆ", icon: Map },
  { to: "/gigpay", label: "GigPay", kn: "ಪಾವತಿ", icon: Wallet },
  { to: "/welfare", label: "Welfare", kn: "ಸುರಕ್ಷೆ", icon: ShieldCheck },
];

export const BottomNav = () => {
  const loc = useLocation();
  if (loc.pathname === "/") return null;
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[max(env(safe-area-inset-bottom),0.5rem)] px-3">
      <div className="mx-auto max-w-md glass-card !rounded-2xl border-secondary/30 flex items-center justify-between px-2 py-2 backdrop-blur-2xl">
        {items.map(({ to, label, kn, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all",
                isActive ? "bg-secondary/15 text-secondary" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "drop-shadow-[0_0_10px_hsl(var(--secondary))] scale-110")} />
                <span className="text-[10px] font-medium leading-none">{label}</span>
                <span className="text-[9px] font-kannada leading-none opacity-70">{kn}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
