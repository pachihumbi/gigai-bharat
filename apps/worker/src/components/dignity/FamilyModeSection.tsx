import { FAMILY_MODE } from "@/lib/dignity-demo";
import { SectionShell } from "./DignityHero";
import { GraduationCap, Heart, PiggyBank, Send, Users } from "lucide-react";
import { toast } from "sonner";

export function FamilyModeSection() {
  const f = FAMILY_MODE;

  const sendHome = () => {
    toast.success("₹2,000 sent to Lakshmi", { description: "Instant UPI · Family dashboard updated" });
  };

  return (
    <SectionShell
      tag="03 · Family Mode"
      title="Money home · education · emergency vault"
      subtitle="Emotional stickiness — workers provide for family through one app"
    >
      <div className="pod-card p-4 mb-4 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-pink-500/15 blur-2xl" />
        <div className="relative flex items-center gap-2 mb-3">
          <Heart className="h-5 w-5 text-pink-400" />
          <p className="text-sm font-bold text-bright">Family dashboard</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[10px] font-mono uppercase text-foreground/50">Sent this month</p>
            <p className="text-2xl font-bold text-pink-300 tabular-nums">₹{f.sentThisMonth.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-foreground/50">Monthly goal</p>
            <p className="text-2xl font-bold text-bright tabular-nums">{f.familyDashboard.savedPct}%</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-black/40 overflow-hidden mb-4">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-400" style={{ width: `${f.familyDashboard.savedPct}%` }} />
        </div>
        <button
          type="button"
          onClick={sendHome}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-500/20 border border-pink-400/35 py-3 font-bold text-sm text-pink-100 active:scale-[0.98] transition"
        >
          <Send className="h-4 w-4" /> Send money home instantly
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="pod-card p-3.5">
          <GraduationCap className="h-4 w-4 text-cyan-300 mb-2" />
          <p className="text-[10px] font-mono uppercase text-foreground/50">Education vault</p>
          <p className="text-lg font-bold text-cyan-300 tabular-nums">₹{f.educationVault.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-foreground/55 mt-1">{f.familyDashboard.childrenEducationFund}</p>
        </div>
        <div className="pod-card p-3.5">
          <PiggyBank className="h-4 w-4 text-emerald-300 mb-2" />
          <p className="text-[10px] font-mono uppercase text-foreground/50">Emergency vault</p>
          <p className="text-lg font-bold text-emerald-300 tabular-nums">₹{f.emergencyVault.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-foreground/55 mt-1">Locked · instant unlock SOS</p>
        </div>
      </div>

      <div className="pod-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-foreground/70" />
          <p className="text-sm font-bold text-bright">Family members</p>
        </div>
        {f.familyMembers.map((m) => (
          <div key={m.name} className="flex justify-between py-2 border-b border-white/[0.06] last:border-0">
            <div>
              <p className="text-sm font-semibold text-bright">{m.name}</p>
              <p className="text-[11px] text-foreground/55">{m.relation}</p>
            </div>
            <p className="text-[11px] font-mono text-foreground/50">{m.phone}</p>
          </div>
        ))}
        <p className="mt-2 text-[11px] text-foreground/55">Last transfer: ₹{f.lastTransfer.amount} → {f.lastTransfer.to} · {f.lastTransfer.when}</p>
      </div>
    </SectionShell>
  );
}
