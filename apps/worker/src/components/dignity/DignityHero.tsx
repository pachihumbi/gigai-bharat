import { DIGNITY_VISION, PLATFORM_ECOSYSTEM } from "@/lib/dignity-demo";
import { Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function DignityHero() {
  return (
    <section className="dignity-hero relative overflow-hidden rounded-3xl p-5 sm:p-6 animate-scale-in">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <span className="text-[10px] font-mono-tech uppercase tracking-[0.32em] text-emerald-300/90">
            The real moat
          </span>
        </div>
        <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-bright leading-tight">
          {DIGNITY_VISION.headline}
        </h1>
        <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{DIGNITY_VISION.subheadline}</p>
        <p className="mt-1 text-xs font-kannada text-cyan-200/70">{DIGNITY_VISION.taglineKn}</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
          <Heart className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-bright leading-snug">
            Safety · Health · Family · Credit · Identity · Governance — built for workers banks ignore.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PlatformEcosystemMap() {
  return (
    <section className="animate-fade-in">
      <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-cyan-300/80 mb-3">
        GigAI Bharat ecosystem
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {PLATFORM_ECOSYSTEM.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="pod-card p-3.5 block transition-all hover:border-cyan-400/25 active:scale-[0.98]"
          >
            <p className="text-sm font-bold text-bright">{item.label}</p>
            <p className="text-[10px] text-foreground/60 mt-0.5 leading-snug">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SectionShell({
  id,
  tag,
  title,
  subtitle,
  children,
}: {
  id?: string;
  tag: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="animate-fade-in scroll-mt-24">
      <p className="text-[10px] font-mono-tech uppercase tracking-[0.28em] text-cyan-300/80 mb-1">{tag}</p>
      <h2 className="text-xl font-bold text-bright">{title}</h2>
      <p className="text-xs text-foreground/65 mt-0.5 mb-4">{subtitle}</p>
      {children}
    </section>
  );
}
