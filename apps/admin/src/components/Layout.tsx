import { cn } from "@gigai/ui";
import { Activity, BarChart3, LayoutDashboard, LogOut, Map, Shield, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { signOutAdmin } from "@/lib/auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/map", label: "Ops map", icon: Map },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/workers", label: "Workers", icon: Users },
  { to: "/audit", label: "Audit log", icon: Shield },
];

export function Layout() {
  const { session } = useAdminAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-white/10 bg-black/40 p-4">
        <div className="mb-8 flex items-center gap-2">
          <Activity className="h-5 w-5 text-brand-saffron" />
          <span className="text-sm font-semibold tracking-wide">GigAI Admin</span>
        </div>
        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 space-y-3">
          <p className="text-xs text-slate-500">
            City ops console · admin RLS policies
          </p>
          {session?.user.email && (
            <p className="truncate text-[11px] text-slate-400">{session.user.email}</p>
          )}
          <button
            type="button"
            onClick={() => signOutAdmin()}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
