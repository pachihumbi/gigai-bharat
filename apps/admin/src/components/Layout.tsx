import { cn } from "@gigai/ui";
import { Activity, LayoutDashboard, Shield, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/workers", label: "Workers", icon: Users },
  { to: "/audit", label: "Audit log", icon: Shield },
];

export function Layout() {
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
        <p className="mt-8 text-xs text-slate-500">
          City ops &amp; compliance console. Restrict access via Supabase RLS + admin role.
        </p>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
