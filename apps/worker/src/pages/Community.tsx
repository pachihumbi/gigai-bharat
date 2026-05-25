import { AppShell } from "@/components/AppShell";
import { OsCard, HudLabel } from "@/os/OsCard";
import { Users, MessageCircle, Radio } from "lucide-react";

const posts = [
  { author: "Ravi · Rapido", msg: "Whitefield surge till 11pm — ORR route safer", time: "4m", likes: 12 },
  { author: "Priya · Swiggy", msg: "GigPods Koramangala — charging free for EV riders tonight", time: "18m", likes: 28 },
  { author: "Suresh · Uber", msg: "Rest-Lock saved me — 11h shift, took pod break", time: "1h", likes: 45 },
];

export default function Community() {
  return (
    <AppShell title="Community" kn="ಸಮುದಾಯ · Worker solidarity network">
      <OsCard className="mb-4">
        <div className="flex items-center justify-between">
          <HudLabel>Live worker channel</HudLabel>
          <span className="flex items-center gap-1 font-mono text-[10px] text-primary">
            <Radio className="h-3 w-3 animate-pulse" /> 2.4K online
          </span>
        </div>
      </OsCard>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.msg} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{p.author}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">{p.time}</span>
            </div>
            <p className="mt-2 text-sm text-foreground/85">{p.msg}</p>
            <p className="mt-2 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <MessageCircle className="h-3 w-3" /> {p.likes} supports
            </p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
