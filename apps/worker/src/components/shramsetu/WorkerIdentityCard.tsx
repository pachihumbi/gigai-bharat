import { BadgeCheck, Shield, Star } from "lucide-react";
import type { WorkerProfile } from "@/hooks/useLedger";
import { DEMO_SHRAMSETU_PROFILE } from "@/lib/shramsetu-demo";

type WorkerIdentityCardProps = {
  worker: WorkerProfile | null;
  verified?: boolean;
};

export function WorkerIdentityCard({ worker, verified = true }: WorkerIdentityCardProps) {
  const name = worker?.name ?? "Prashanth Gowda";
  const initial = name[0]?.toUpperCase() ?? "G";
  const profile = DEMO_SHRAMSETU_PROFILE;

  return (
    <div className="govtech-card relative overflow-hidden p-5 sm:p-6 animate-scale-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-white/80 to-emerald-500 opacity-90" />
      <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl" />

      <div className="relative flex gap-4">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/30 to-emerald-500/20 text-2xl font-extrabold text-bright border border-white/15 shadow-[0_0_32px_rgba(255,140,0,0.15)]">
            {initial}
          </div>
          {verified && (
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-[#0a1218]">
              <BadgeCheck className="h-3.5 w-3.5 text-white" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-bright truncate">{name}</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-400/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
              <Shield className="h-3 w-3" />
              Verified Worker
            </span>
          </div>
          <p className="text-[11px] font-mono text-cyan-200/75">{profile.workerId}</p>
          <p className="text-xs text-foreground/75">
            {worker?.vehicle_type ?? "VinFast MPV7"} · {profile.city}, {profile.state}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.platforms.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-foreground/85"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/[0.08] bg-black/30 p-3.5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400/30" />
            <span className="text-xs font-semibold text-bright">{profile.skillLevel}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300">
            {profile.skillXp} / {profile.skillNextLevel} XP
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-1000"
            style={{ width: `${(profile.skillXp / profile.skillNextLevel) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
