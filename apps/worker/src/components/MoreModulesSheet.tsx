import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Bot,
  Car,
  GraduationCap,
  Landmark,
  LayoutGrid,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const modules = [
  { to: "/ledger", label: "Earnings", icon: LayoutGrid, color: "text-primary" },
  { to: "/gurukul", label: "Learn", icon: GraduationCap, color: "text-green-400" },
  { to: "/welfare", label: "ShramSetu", icon: Landmark, color: "text-orange-400" },
  { to: "/insurance", label: "Insurance", icon: Shield, color: "text-red-400" },
  { to: "/co-living", label: "Smart housing", icon: BedDouble, color: "text-violet-400" },
  { to: "/fleet", label: "Fleet OS", icon: Car, color: "text-cyan-400" },
  { to: "/community", label: "Community", icon: Users, color: "text-pink-400" },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy, color: "text-amber-400" },
  { to: "/dignity#copilot", label: "AI assistant", icon: Bot, color: "text-[#00F5D4]" },
];

export function MoreModulesSheet({ trigger }: { trigger: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl border-primary/20 bg-background/95 pb-8 backdrop-blur-2xl">
        <SheetHeader>
          <SheetTitle className="text-left font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Worker OS modules
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {modules.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
            >
              <Icon className={cn("h-6 w-6", color)} />
              <span className="text-center text-[10px] font-semibold leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
