import { Loader2 } from "lucide-react";
import { useAdminOverview } from "@/hooks/useAdminData";

function formatInr(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function DashboardPage() {
  const { data, isLoading, error } = useAdminOverview();

  const cards = [
    { label: "Registered workers", value: data?.activeWorkers },
    { label: "OCR / parse events today", value: data?.ocrParsesToday },
    { label: "Audit events today", value: data?.auditEventsToday },
    { label: "Total wallet balance", value: data ? formatInr(data.totalWalletBalance) : undefined },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">City overview</h1>
      <p className="mt-2 text-slate-400">
        Live KPIs from Supabase — workers, wallet float, and audit volume.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {(error as Error).message}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {isLoading ? <Loader2 className="h-7 w-7 animate-spin text-brand-saffron" /> : (value ?? "—")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
