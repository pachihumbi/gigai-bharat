import { Loader2 } from "lucide-react";
import { useAdminAuditLog } from "@/hooks/useAdminData";

type AuditRow = {
  id: string;
  action: string;
  amount: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  worker_id: string | null;
  worker_profiles: { name: string } | null;
};

export function AuditPage() {
  const { data, isLoading, error } = useAdminAuditLog();
  const rows = (data ?? []) as AuditRow[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Audit log</h1>
      <p className="mt-2 text-slate-400">
        Wallet mutations, bill payments, and OCR events from{" "}
        <code className="text-brand-saffron">public.audit_log</code>.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {(error as Error).message}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Worker</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-saffron" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No audit events yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{row.worker_profiles?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.action}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.amount != null ? `₹${Number(row.amount).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-slate-400">
                    {row.metadata ? JSON.stringify(row.metadata) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
