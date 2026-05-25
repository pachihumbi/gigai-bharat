import { Loader2 } from "lucide-react";
import { useAdminWorkers } from "@/hooks/useAdminData";

type WorkerRow = {
  id: string;
  name: string;
  phone_number: string | null;
  vehicle_type: string;
  onboarded: boolean;
  created_at: string;
  wallet_and_credit: { wallet_balance: number; gig_credit_score: number } | null;
  welfare_tracker: { active_working_days: number; is_eligible_for_state_benefits: boolean } | null;
};

export function WorkersPage() {
  const { data, isLoading, error } = useAdminWorkers();
  const workers = (data ?? []) as WorkerRow[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Workers</h1>
      <p className="mt-2 text-slate-400">
        Registered worker profiles with wallet and welfare status.
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Credit</th>
              <th className="px-4 py-3">Onboarded</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-saffron" />
                </td>
              </tr>
            ) : workers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No workers yet.
                </td>
              </tr>
            ) : (
              workers.map((w) => (
                <tr key={w.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium">{w.name}</td>
                  <td className="px-4 py-3 text-slate-400">{w.phone_number ?? "—"}</td>
                  <td className="px-4 py-3">{w.vehicle_type}</td>
                  <td className="px-4 py-3 tabular-nums">
                    ₹{Number(w.wallet_and_credit?.wallet_balance ?? 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{w.wallet_and_credit?.gig_credit_score ?? "—"}</td>
                  <td className="px-4 py-3">{w.onboarded ? "Yes" : "Pending"}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(w.created_at).toLocaleDateString("en-IN")}
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
