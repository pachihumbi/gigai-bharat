import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const dayStart = `${today}T00:00:00.000Z`;

      const [workers, auditToday, ocrToday, wallets] = await Promise.all([
        supabase.from("worker_profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("audit_log")
          .select("id", { count: "exact", head: true })
          .gte("created_at", dayStart),
        supabase
          .from("audit_log")
          .select("id", { count: "exact", head: true })
          .gte("created_at", dayStart)
          .ilike("action", "%parse%"),
        supabase.from("wallet_and_credit").select("wallet_balance"),
      ]);

      if (workers.error) throw workers.error;
      if (auditToday.error) throw auditToday.error;
      if (ocrToday.error) throw ocrToday.error;
      if (wallets.error) throw wallets.error;

      const totalBalance = (wallets.data ?? []).reduce(
        (sum, row) => sum + Number(row.wallet_balance),
        0,
      );

      return {
        activeWorkers: workers.count ?? 0,
        auditEventsToday: auditToday.count ?? 0,
        ocrParsesToday: ocrToday.count ?? 0,
        totalWalletBalance: totalBalance,
      };
    },
  });
}

export function useAdminWorkers() {
  return useQuery({
    queryKey: ["admin", "workers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("worker_profiles")
        .select(
          "id, name, phone_number, vehicle_type, onboarded, created_at, wallet_and_credit(wallet_balance, gig_credit_score), welfare_tracker(active_working_days, is_eligible_for_state_benefits)",
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data ?? []).map((row) => ({
        ...row,
        wallet_and_credit: Array.isArray(row.wallet_and_credit)
          ? row.wallet_and_credit[0] ?? null
          : row.wallet_and_credit,
        welfare_tracker: Array.isArray(row.welfare_tracker)
          ? row.welfare_tracker[0] ?? null
          : row.welfare_tracker,
      }));
    },
  });
}

export function useAdminAuditLog() {
  return useQuery({
    queryKey: ["admin", "audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("id, action, amount, metadata, created_at, worker_id, worker_profiles(name)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data ?? []).map((row) => ({
        ...row,
        worker_profiles: Array.isArray(row.worker_profiles)
          ? row.worker_profiles[0] ?? null
          : row.worker_profiles,
      }));
    },
  });
}
