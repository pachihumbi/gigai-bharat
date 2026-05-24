import { toast } from "sonner";
import { UPI_QUICK_ACTIONS } from "@/lib/gigpay-demo";

type UpiActionGridProps = {
  onBillsClick?: () => void;
};

export function UpiActionGrid({ onBillsClick }: UpiActionGridProps) {
  const handleAction = (id: string) => {
    if (id === "bills") {
      onBillsClick?.();
      document.getElementById("gigpay-smart-bills")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const labels: Record<string, string> = {
      send: "Send money — UPI demo",
      request: "Payment request — demo",
      scan: "QR scanner — demo",
      add: "Add money — demo",
      history: "Scroll to transactions",
    };
    if (id === "history") {
      document.getElementById("gigpay-transactions")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    toast.message(labels[id] ?? "Coming in production", {
      description: "Investor demo · RBI-compliant UPI rail planned",
    });
  };

  return (
    <div className="glass-card p-4 sm:p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.22em] text-cyan-400/80">
            UPI Hub
          </p>
          <p className="text-sm font-semibold mt-0.5">Pay · Send · Scan</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-muted-foreground">NPCI-ready</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {UPI_QUICK_ACTIONS.map(({ id, label, kn, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleAction(id)}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-black/25 px-2 py-3.5 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] active:scale-95"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/15 text-lg font-bold text-cyan-200 border border-cyan-400/20 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] transition-shadow">
              {icon}
            </span>
            <span className="text-[11px] font-semibold text-foreground/90">{label}</span>
            <span className="text-[9px] font-kannada text-muted-foreground -mt-1">{kn}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
