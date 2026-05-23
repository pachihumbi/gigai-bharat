import { AppShell } from "@/components/AppShell";
import { CheckCircle2, HeartPulse, Landmark, ShieldCheck } from "lucide-react";
import { useLedger } from "@/hooks/useLedger";
import { Skeleton } from "@/components/ui/skeleton";

const Welfare = () => {
  const { welfare, loading } = useLedger();
  if (loading || !welfare) {
    return (
      <AppShell title="Welfare Tracker" kn="ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು">
        <Skeleton className="h-44 w-full rounded-3xl mb-4" />
        <Skeleton className="h-24 w-full rounded-3xl" />
      </AppShell>
    );
  }
  const days = welfare.active_working_days;
  const total = 90;
  const remaining = Math.max(0, total - days);
  const pct = Math.min(100, (days / total) * 100);

  return (
    <AppShell title="Welfare Tracker" kn="ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು">
      {/* Progress hero */}
      <div className="relative glass-card overflow-hidden p-5 mb-4 animate-scale-in border-accent/40">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-mono-tech">DPI Welfare Quest</p>
            <Landmark className="h-4 w-4 text-accent" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-5xl font-extrabold tracking-tight text-gradient-saffron tabular-nums">{days}</span>
            <span className="mb-1.5 text-lg text-muted-foreground">/ {total} days</span>
          </div>
          <p className="text-sm font-semibold mt-1">{remaining} days left to unlock benefits</p>
          <p className="text-[11px] font-kannada text-muted-foreground mt-1">
            ೫ ದಿನಗಳಲ್ಲಿ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ೧% ಸೌಲಭ್ಯ ಮತ್ತು ಆರೋಗ್ಯ ವಿಮೆ ಸಿಗುತ್ತದೆ
          </p>
          <div className="mt-4 h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-saffron rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] font-mono-tech text-muted-foreground">
            <span>DAY 0</span>
            <span className="text-accent">DAY 90 → UNLOCK</span>
          </div>
        </div>
      </div>

      {/* Verified badges */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "DigiLocker", kn: "ಡಿಜಿಲಾಕರ್", cls: "text-primary" },
          { label: "e-Shram", kn: "ಇ-ಶ್ರಮ್", cls: "text-secondary" },
          { label: "Aadhaar KYC", kn: "ಆಧಾರ್", cls: "text-accent" },
          { label: "PM-SYM Pension", kn: "ಪಿಂಚಣಿ", cls: "text-primary" },
        ].map((b, i) => (
          <div key={b.label} className="glass-card p-3 flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <CheckCircle2 className={`h-4 w-4 ${b.cls} flex-none`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight truncate">{b.label}</p>
              <p className="text-[10px] font-kannada text-muted-foreground truncate">{b.kn} ✓</p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefit cards */}
      <p className="text-[10px] font-mono-tech tracking-widest text-muted-foreground mb-2 mt-2 px-1">UNLOCKING SOON</p>
      <div className="space-y-3 mb-4">
        <div className="glass-card p-4 flex items-center gap-3 border-secondary/30 animate-fade-in">
          <div className="w-11 h-11 rounded-2xl bg-secondary/15 grid place-items-center">
            <HeartPulse className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Health Insurance ₹5L</p>
            <p className="text-[11px] font-kannada text-muted-foreground">ಆರೋಗ್ಯ ವಿಮೆ • ಆಯುಷ್ಮಾನ್ ಭಾರತ್</p>
          </div>
          <span className="text-[10px] font-mono-tech text-secondary">{remaining} DAYS</span>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-accent/30 animate-fade-in">
          <div className="w-11 h-11 rounded-2xl bg-accent/15 grid place-items-center">
            <Landmark className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">KA State 1% Welfare Cess</p>
            <p className="text-[11px] font-kannada text-muted-foreground">ಕರ್ನಾಟಕ ೧% ಸೆಸ್ ಸೌಲಭ್ಯ</p>
          </div>
          <span className="text-[10px] font-mono-tech text-accent">{remaining} DAYS</span>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-primary/30 animate-fade-in">
          <div className="w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Accident Cover ₹2L</p>
            <p className="text-[11px] font-kannada text-muted-foreground">ಅಪಘಾತ ವಿಮೆ</p>
          </div>
          <span className="text-[10px] font-mono-tech text-secondary">ACTIVE</span>
        </div>
      </div>

      {/* Pledge */}
      <div className="glass-card p-4 border-secondary/30 animate-fade-in relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
        <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary mb-2">India Stack • DPI Integration</p>
        <p className="text-sm leading-relaxed font-kannada">
          ಗಿಗ್ ಅಂದ್ರೆ <span className="text-secondary font-semibold">ಗೌರವ</span>. ಸುರಕ್ಷೆ ಎಲ್ಲರಿಗೂ.
        </p>
        <p className="text-xs text-muted-foreground italic mt-1">"Gig means dignity. Security for all."</p>
      </div>

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default Welfare;
