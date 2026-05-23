import { LucideIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { OsCard, HudLabel } from "./OsCard";

export function AiInsightCard({
  title,
  body,
  impact,
  href,
  icon: Icon = Sparkles,
  live = false,
}: {
  title: string;
  body: string;
  impact?: string;
  href?: string;
  icon?: LucideIcon;
  live?: boolean;
}) {
  const inner = (
    <OsCard glow="saffron" className="relative overflow-hidden border-accent/30">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex gap-3">
        <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-gradient-saffron glow-saffron">
          <Icon className="h-5 w-5 text-accent-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <HudLabel className="text-accent">{title}</HudLabel>
            {live && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-accent" />}
          </div>
          <p className="mt-1 text-sm font-semibold leading-snug">{body}</p>
          {impact && (
            <span className="mt-2 inline-block rounded-full bg-secondary/15 px-2 py-1 text-[10px] font-semibold text-secondary">
              {impact}
            </span>
          )}
        </div>
      </div>
    </OsCard>
  );

  if (href) return <Link to={href}>{inner}</Link>;
  return inner;
}
