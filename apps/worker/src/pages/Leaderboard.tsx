import { AppShell } from "@/components/AppShell";
import { OsCard, HudLabel } from "@/os/OsCard";
import { Trophy, Medal } from "lucide-react";

const leaders = [
  { rank: 1, name: "Anil K.", city: "Bengaluru", earnings: "₹4,820", badge: "gold" },
  { rank: 2, name: "Meena R.", city: "Bengaluru", earnings: "₹4,610", badge: "silver" },
  { rank: 3, name: "Vikram S.", city: "Bengaluru", earnings: "₹4,390", badge: "bronze" },
  { rank: 4, name: "You", city: "Bengaluru", earnings: "₹2,840", badge: "you" },
  { rank: 5, name: "Deepa M.", city: "Bengaluru", earnings: "₹2,720", badge: "" },
];

export default function Leaderboard() {
  return (
    <AppShell title="Leaderboard" kn="ಲೀಡರ್‌ಬೋರ್ಡ್ · City earnings rank">
      <OsCard className="mb-4">
        <HudLabel>Bengaluru · Today</HudLabel>
        <p className="mt-2 font-serif text-2xl text-primary">Top 500 earners</p>
      </OsCard>
      <ul className="space-y-2">
        {leaders.map((l) => (
          <li
            key={l.rank}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
              l.badge === "you" ? "border-primary/50 bg-primary/10" : "border-border/60 bg-card/30"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center font-mono text-sm font-bold text-muted-foreground">
              {l.rank <= 3 ? <Medal className="h-5 w-5 text-amber-400" /> : l.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{l.name}</p>
              <p className="text-xs text-muted-foreground">{l.city}</p>
            </div>
            <p className="font-mono text-sm font-bold text-primary">{l.earnings}</p>
            {l.rank === 1 && <Trophy className="h-5 w-5 text-amber-400" />}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
