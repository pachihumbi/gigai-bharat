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
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Load high-fidelity investor demo fallback telemetry
        setIsDemo(true);
        setWorker({
          id: "demo-worker-101",
          name: "Prashanth Gowda",
          phone_number: "+91 98450 12345",
          vehicle_type: "VinFast MPV7",
          home_lat: 12.9716,
          home_lng: 77.5946,
          home_address: "Indiranagar, Bengaluru"
        });
        setWallet({
          wallet_balance: 14250,
          gig_credit_score: 742,
          active_loan_amount: 0
        });
        setWelfare({
          active_working_days: 68,
          is_eligible_for_state_benefits: true
        });

        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().slice(0, 10);
        const threeDaysAgo = new Date(Date.now() - 259200000).toISOString().slice(0, 10);
        const fourDaysAgo = new Date(Date.now() - 345600000).toISOString().slice(0, 10);

        setEarnings([
          { date: today, amount_earned: 1250, source_platform: "Swiggy" },
          { date: today, amount_earned: 1600, source_platform: "Rapido" },
          { date: yesterday, amount_earned: 1800, source_platform: "Uber" },
          { date: yesterday, amount_earned: 1400, source_platform: "Zomato" },
          { date: twoDaysAgo, amount_earned: 2200, source_platform: "Swiggy" },
          { date: threeDaysAgo, amount_earned: 1950, source_platform: "Uber" },
          { date: fourDaysAgo, amount_earned: 2500, source_platform: "Rapido" }
        ]);
        setLoading(false);
        return;
      }

      setIsDemo(false);
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
    } catch (err) {
      console.error("Error loading auth in useLedger, loading demo fallback:", err);
      setIsDemo(true);
      setWorker({
        id: "demo-worker-101",
        name: "Prashanth Gowda",
        phone_number: "+91 98450 12345",
        vehicle_type: "VinFast MPV7",
        home_lat: 12.9716,
        home_lng: 77.5946,
        home_address: "Indiranagar, Bengaluru"
      });
      setWallet({
        wallet_balance: 14250,
        gig_credit_score: 742,
        active_loan_amount: 0
      });
      setWelfare({
        active_working_days: 68,
        is_eligible_for_state_benefits: true
      });

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().slice(0, 10);

      setEarnings([
        { date: today, amount_earned: 1250, source_platform: "Swiggy" },
        { date: today, amount_earned: 1600, source_platform: "Rapido" },
        { date: yesterday, amount_earned: 1800, source_platform: "Uber" },
        { date: yesterday, amount_earned: 1400, source_platform: "Zomato" },
        { date: twoDaysAgo, amount_earned: 2200, source_platform: "Swiggy" }
      ]);
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const todayEarnings = earnings.filter((r) => r.date === today).reduce((s, r) => s + Number(r.amount_earned), 0);
  const tripsToday = earnings.filter((r) => r.date === today).length;

  return { worker, wallet, welfare, earnings, todayEarnings, tripsToday, loading, reload: load, isDemo };
};
