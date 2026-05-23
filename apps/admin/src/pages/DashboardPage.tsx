export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">City overview</h1>
      <p className="mt-2 text-slate-400">
        KPI cards, active workers, AI parse volume, and welfare eligibility will live here.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Active workers", "OCR today", "Audit events"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
