import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_BILLS, type Bill } from "@/lib/walletStore";

function mapRow(row: {
  id: string;
  label: string;
  label_kn: string;
  amount: number;
  icon: string;
  paid: boolean;
}): Bill {
  return {
    id: row.id,
    label: row.label,
    kn: row.label_kn,
    amount: Number(row.amount),
    icon: row.icon,
    paid: row.paid,
  };
}

export function useSmartBills(workerId: string | undefined, isDemo: boolean) {
  const [bills, setBills] = useState<Bill[]>(() => DEFAULT_BILLS.map((b) => ({ ...b })));
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (isDemo || !workerId) {
      setBills(DEFAULT_BILLS.map((b) => ({ ...b })));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("smart_bills")
        .select("id, label, label_kn, amount, icon, paid")
        .eq("worker_id", workerId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setBills((data ?? []).map(mapRow));
    } catch (err) {
      console.error("useSmartBills load failed:", err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  }, [workerId, isDemo]);

  useEffect(() => {
    reload();
  }, [reload]);

  const markPaidLocal = useCallback((id: string) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, paid: true } : b)));
  }, []);

  return { bills, loading, reload, markPaidLocal };
}
