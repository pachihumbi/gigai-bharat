import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { allowInvestorDemo } from "@/lib/app-config";
import { buildDemoEarnings, DEMO_WALLET, DEMO_WELFARE, DEMO_WORKER } from "@/lib/demo-data";

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

function applyDemoState(
  setIsDemo: (v: boolean) => void,
  setWorker: (v: WorkerProfile) => void,
  setWallet: (v: Wallet) => void,
  setWelfare: (v: Welfare) => void,
  setEarnings: (v: EarningRow[]) => void,
) {
  setIsDemo(true);
  setWorker(DEMO_WORKER);
  setWallet(DEMO_WALLET);
  setWelfare(DEMO_WELFARE);
  setEarnings(buildDemoEarnings());
}

export const useLedger = () => {
  const seedDemo = allowInvestorDemo();
  const [worker, setWorker] = useState<WorkerProfile | null>(seedDemo ? DEMO_WORKER : null);
  const [wallet, setWallet] = useState<Wallet | null>(seedDemo ? DEMO_WALLET : null);
  const [welfare, setWelfare] = useState<Welfare | null>(seedDemo ? DEMO_WELFARE : null);
  const [earnings, setEarnings] = useState<EarningRow[]>(seedDemo ? buildDemoEarnings() : []);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(seedDemo);

  const load = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (allowInvestorDemo()) {
          applyDemoState(setIsDemo, setWorker, setWallet, setWelfare, setEarnings);
        } else {
          setIsDemo(false);
          setWorker(null);
          setWallet(null);
          setWelfare(null);
          setEarnings([]);
        }
        return;
      }

      setIsDemo(false);
      const workerRes = await supabase
        .from("worker_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const profile = workerRes.data as WorkerProfile | null;
      setWorker(profile);

      if (!profile?.id) {
        setWallet(null);
        setWelfare(null);
        setEarnings([]);
        return;
      }

      const [wa, wf, e] = await Promise.all([
        supabase.from("wallet_and_credit").select("*").eq("worker_id", profile.id).maybeSingle(),
        supabase.from("welfare_tracker").select("*").eq("worker_id", profile.id).maybeSingle(),
        supabase
          .from("earnings_ledger")
          .select("date,amount_earned,source_platform")
          .eq("worker_id", profile.id)
          .order("date", { ascending: false })
          .limit(200),
      ]);

      setWallet(wa.data as Wallet | null);
      setWelfare(wf.data as Welfare | null);
      setEarnings((e.data || []) as EarningRow[]);
    } catch (err) {
      console.error("useLedger load failed:", err);
      if (allowInvestorDemo()) {
        applyDemoState(setIsDemo, setWorker, setWallet, setWelfare, setEarnings);
      }
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const todayEarnings = earnings.filter((r) => r.date === today).reduce((s, r) => s + Number(r.amount_earned), 0);
  const tripsToday = earnings.filter((r) => r.date === today).length;

  return { worker, wallet, welfare, earnings, todayEarnings, tripsToday, loading, reload: load, isDemo };
};
