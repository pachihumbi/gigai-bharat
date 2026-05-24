import { HeartPulse, Landmark, Shield } from "lucide-react";
import type { InsurancePlan, PensionTrack } from "@/lib/shramsetu-demo";

const INS_STATUS = {
  active: "text-emerald-300 border-emerald-400/35 bg-emerald-400/10",
  pending: "text-cyan-200 border-cyan-400/35 bg-cyan-400/10",
  renewal: "text-amber-300 border-amber-400/35 bg-amber-400/10",
} as const;

type InsurancePensionPanelProps = {
  insurance: InsurancePlan[];
  pension: PensionTrack;
};

export function InsurancePensionPanel({ insurance, pension }: InsurancePensionPanelProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="fintech-card p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-emerald-400" />
          <p className="text-sm font-semibold text-bright">Insurance status</p>
        </div>
        <div className="space-y-2.5">
          {insurance.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/25 px-3.5 py-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/25">
                <Shield className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-bright">{plan.name}</p>
                <p className="text-[11px] text-foreground/65">
                  {plan.coverage} · till {plan.validUntil}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase ${INS_STATUS[plan.status]}`}>
                  {plan.status}
                </span>
                <p className="mt-1 text-[10px] tabular-nums text-foreground/70">
                  {plan.premium === 0 ? "Govt funded" : `₹${plan.premium}/mo`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="govtech-card p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Landmark className="h-4 w-4 text-orange-400" />
          <p className="text-sm font-semibold text-bright">Pension tracking</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Scheme</p>
            <p className="mt-1 text-sm font-bold text-bright">{pension.scheme}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Monthly</p>
            <p className="mt-1 text-sm font-bold text-emerald-300 tabular-nums">₹{pension.monthlyContribution}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">At age 60</p>
            <p className="mt-1 text-sm font-bold text-orange-300 tabular-nums">₹{pension.projectedPayout}/mo</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Years left</p>
            <p className="mt-1 text-sm font-bold tabular-nums text-bright">{pension.yearsToEligible} yrs</p>
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-[11px]">
            <span className="text-foreground/75">Enrollment progress</span>
            <span className="font-semibold text-emerald-300">{pension.progressPct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-1000"
              style={{ width: `${pension.progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
