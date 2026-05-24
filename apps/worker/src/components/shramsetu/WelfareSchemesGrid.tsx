import type { WelfareScheme } from "@/lib/shramsetu-demo";

const STATUS_STYLE = {
  active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  eligible: "border-cyan-400/35 bg-cyan-400/8 text-cyan-200",
  locked: "border-white/10 bg-black/25 text-muted-foreground",
} as const;

const STATUS_LABEL = {
  active: "ACTIVE",
  eligible: "ELIGIBLE",
  locked: "LOCKED",
} as const;

type WelfareSchemesGridProps = {
  schemes: WelfareScheme[];
};

export function WelfareSchemesGrid({ schemes }: WelfareSchemesGridProps) {
  return (
    <div className="fintech-card p-4 sm:p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-orange-400/90">
            Govt welfare schemes
          </p>
          <p className="text-sm font-semibold text-bright mt-0.5">ShramSetu eligibility</p>
        </div>
        <span className="text-[10px] font-kannada text-foreground/65">ಸಾಮಾಜಿಕ ಭದ್ರತೆ</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {schemes.map((scheme, i) => (
          <div
            key={scheme.id}
            className="rounded-2xl border border-white/[0.07] bg-black/25 p-3.5 transition-colors hover:border-orange-400/25 animate-fade-in"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bright leading-tight">{scheme.name}</p>
                <p className="text-[10px] font-kannada text-foreground/60 mt-0.5">{scheme.kn}</p>
              </div>
              <span
                className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${STATUS_STYLE[scheme.status]}`}
              >
                {STATUS_LABEL[scheme.status]}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{scheme.provider}</p>
            {scheme.coverage && (
              <p className="mt-1.5 text-xs font-semibold text-emerald-300/90">{scheme.coverage}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
