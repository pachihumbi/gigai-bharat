import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillGauge } from "@/components/gurukul/SkillGauge";
import { useGurukul } from "@/hooks/useGurukul";
import { useI18n } from "@/i18n/context";
import {
  certifications,
  economicTips,
  successStories,
  tribes,
  nextCertProgress,
} from "@/data/gurukul";
import { OsCard, HudLabel } from "@/os/OsCard";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, GraduationCap, Sparkles, TrendingUp, Users, Mic } from "lucide-react";
import { toast } from "sonner";

type Tab = "learn" | "skills" | "certs" | "advisor" | "tribe";

const levelColors = {
  bronze: "border-accent/50 bg-accent/10 text-accent",
  silver: "border-muted-foreground/50 bg-muted/30",
  gold: "border-secondary/50 bg-secondary/10 text-secondary",
};

const Gurukul = () => {
  const { t } = useI18n();
  const { tracks, skillGraph, totalXp, level, completeLesson } = useGurukul();
  const [tab, setTab] = useState<Tab>("learn");

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "learn", label: t.gurukul.learn, icon: BookOpen },
    { id: "skills", label: t.gurukul.skills, icon: TrendingUp },
    { id: "certs", label: t.gurukul.certs, icon: Award },
    { id: "advisor", label: t.gurukul.advisor, icon: Sparkles },
    { id: "tribe", label: t.gurukul.tribe, icon: Users },
  ];

  return (
    <AppShell title={t.gurukul.title} kn={t.gurukul.subtitle}>
      {/* Hero stats */}
      <OsCard glow="green" className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel className="text-secondary">{t.gurukul.level}</HudLabel>
            <p className="text-3xl font-extrabold text-gradient-neon">Lv {level}</p>
            <p className="text-xs text-muted-foreground">{totalXp} XP · {t.gurukul.tagline}</p>
          </div>
          <GraduationCap className="h-12 w-12 text-secondary opacity-80" />
        </div>
      </OsCard>

      {/* Tab bar */}
      <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
              tab === id ? "bg-primary/20 text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="space-y-3">
          <OsCard glow="neon" className="flex gap-3">
            <Sparkles className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{t.gurukul.mentorName}</p>
              <p className="text-sm text-muted-foreground">{t.gurukul.mentorHint}</p>
            </div>
          </OsCard>
          {tracks.map((track) => (
            <OsCard key={track.id} className="flex items-center gap-3">
              <span className="text-2xl">{track.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{track.title}</p>
                <Progress value={track.progress} className="mt-2 h-1.5" />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {track.durationMin} min · {track.xp} XP {track.voice && "· 🎙 voice"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  completeLesson(track.id);
                  toast.success(t.gurukul.lessonDone, { description: track.title });
                }}
                className="shrink-0 rounded-lg bg-secondary/15 px-3 py-2 text-[11px] font-bold text-secondary"
              >
                +15%
              </button>
            </OsCard>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <SkillGauge label={t.gurukul.skillScore} value={skillGraph.skillScore} />
            <SkillGauge label={t.gurukul.reliability} value={skillGraph.reliabilityScore} color="secondary" />
            <SkillGauge label={t.gurukul.earningPotential} value={skillGraph.earningPotential} color="accent" />
            <SkillGauge label={t.gurukul.fleetLead} value={skillGraph.fleetLeadership} />
          </div>
          <OsCard>
            <HudLabel>{t.gurukul.growthVelocity}</HudLabel>
            <p className="mt-2 text-2xl font-bold text-secondary">+{skillGraph.growthVelocity}%</p>
            <p className="text-sm text-muted-foreground">{t.gurukul.growthHint}</p>
          </OsCard>
        </div>
      )}

      {tab === "certs" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{t.gurukul.certHint}</p>
          {certifications.map((c) => (
            <OsCard key={c.id} className={`flex items-center gap-4 border ${levelColors[c.level]}`}>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-background/60 font-bold">{c.badge}</div>
              <div className="flex-1">
                <p className="font-semibold">{c.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {c.verified ? "✓ Verified" : `${nextCertProgress(skillGraph.skillScore)}% to unlock`} · {c.blockchainReady ? "Blockchain-ready" : ""}
                </p>
              </div>
            </OsCard>
          ))}
        </div>
      )}

      {tab === "advisor" && (
        <div className="space-y-3">
          {economicTips.map((tip) => (
            <OsCard key={tip.id} glow="saffron">
              <p className="font-semibold text-accent">{tip.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tip.body}</p>
              <span className="mt-2 inline-block rounded-full bg-secondary/15 px-2 py-1 text-[10px] font-bold text-secondary">
                {tip.impact}
              </span>
            </OsCard>
          ))}
        </div>
      )}

      {tab === "tribe" && (
        <div className="space-y-4">
          {tribes.map((tribe) => (
            <OsCard key={tribe.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{tribe.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tribe.members.toLocaleString()} members · {tribe.city}
                  </p>
                  <p className="mt-1 text-[11px]">Mentor: {tribe.mentor}</p>
                </div>
                {tribe.rank && (
                  <span className="rounded-full bg-accent/15 px-2 py-1 text-xs font-bold text-accent">#{tribe.rank}</span>
                )}
              </div>
            </OsCard>
          ))}
          <HudLabel className="block">{t.gurukul.stories}</HudLabel>
          {successStories.map((s) => (
            <OsCard key={s.name} className="border-secondary/30">
              <p className="text-sm italic">&ldquo;{s.quote}&rdquo;</p>
              <p className="mt-2 text-xs font-semibold text-secondary">
                — {s.name}, {s.city} · {s.uplift}
              </p>
            </OsCard>
          ))}
        </div>
      )}

      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-4 font-semibold text-primary"
        onClick={() => toast.info(t.gurukul.voiceHint)}
      >
        <Mic className="h-5 w-5" />
        {t.gurukul.voiceLearn}
      </button>
    </AppShell>
  );
};

export default Gurukul;
