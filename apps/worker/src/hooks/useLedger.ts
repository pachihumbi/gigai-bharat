import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WorkerProfile = {
  id: string;
  name: string;
  phone_number: string | null;
  vehicle_type: string;
  home_lat: number | null;
  home_lng: number | null;
  home_address: string | null;
};

export type Wallet = {
  wallet_balance: number;
  gig_credit_score: number;
  active_loan_amount: number;
};

export type Welfare = {
  active_working_days: number;
  is_eligible_for_state_benefits: boolean;
};

export type EarningRow = {
  date: string;
  amount_earned: number;
  source_platform: string;
};

export const useLedger = () => {
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [welfare, setWelfare] = useState<Welfare | null>(null);
  const [earnings, setEarnings] = useState<EarningRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [w, wa, wf, e] = await Promise.all([
      supabase.from("worker_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("wallet_and_credit").select("*").maybeSingle(),
      supabase.from("welfare_tracker").select("*").maybeSingle(),
      supabase.from("earnings_ledger").select("date,amount_earned,source_platform").order("date", { ascending: false }).limit(200),
    ]);

    setWorker(w.data as WorkerProfile | null);
    setWallet(wa.data as Wallet | null);
    setWelfare(wf.data as Welfare | null);
    setEarnings((e.data || []) as EarningRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const todayEarnings = earnings.filter((r) => r.date === today).reduce((s, r) => s + Number(r.amount_earned), 0);
  const tripsToday = earnings.filter((r) => r.date === today).length;

  return { worker, wallet, welfare, earnings, todayEarnings, tripsToday, loading, reload: load };
};
