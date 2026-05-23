-- Worker Profiles
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Driver',
  phone_number TEXT,
  vehicle_type TEXT NOT NULL DEFAULT 'EV_Bike',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "worker self select" ON public.worker_profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "worker self insert" ON public.worker_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "worker self update" ON public.worker_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Helper: is the given worker_id owned by the current user?
CREATE OR REPLACE FUNCTION public.owns_worker(_worker_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.worker_profiles
    WHERE id = _worker_id AND user_id = auth.uid()
  )
$$;

-- Earnings Ledger
CREATE TABLE public.earnings_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_earned NUMERIC(10,2) NOT NULL DEFAULT 0,
  source_platform TEXT NOT NULL DEFAULT 'Direct_GigAI',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.earnings_ledger ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.earnings_ledger (worker_id, date DESC);

CREATE POLICY "earnings self select" ON public.earnings_ledger
  FOR SELECT USING (public.owns_worker(worker_id));
CREATE POLICY "earnings self insert" ON public.earnings_ledger
  FOR INSERT WITH CHECK (public.owns_worker(worker_id));
CREATE POLICY "earnings self update" ON public.earnings_ledger
  FOR UPDATE USING (public.owns_worker(worker_id));
CREATE POLICY "earnings self delete" ON public.earnings_ledger
  FOR DELETE USING (public.owns_worker(worker_id));

-- Wallet & Credit
CREATE TABLE public.wallet_and_credit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL UNIQUE REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  wallet_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  gig_credit_score INTEGER NOT NULL DEFAULT 300,
  active_loan_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet_and_credit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet self select" ON public.wallet_and_credit
  FOR SELECT USING (public.owns_worker(worker_id));
CREATE POLICY "wallet self update" ON public.wallet_and_credit
  FOR UPDATE USING (public.owns_worker(worker_id));
CREATE POLICY "wallet self insert" ON public.wallet_and_credit
  FOR INSERT WITH CHECK (public.owns_worker(worker_id));

-- Welfare Tracker
CREATE TABLE public.welfare_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL UNIQUE REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  active_working_days INTEGER NOT NULL DEFAULT 0,
  is_eligible_for_state_benefits BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.welfare_tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "welfare self select" ON public.welfare_tracker
  FOR SELECT USING (public.owns_worker(worker_id));
CREATE POLICY "welfare self update" ON public.welfare_tracker
  FOR UPDATE USING (public.owns_worker(worker_id));
CREATE POLICY "welfare self insert" ON public.welfare_tracker
  FOR INSERT WITH CHECK (public.owns_worker(worker_id));

-- Auto-create profile + wallet + welfare + 30 days seed earnings on signup
CREATE OR REPLACE FUNCTION public.handle_new_worker()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_worker_id UUID;
  d INT;
  platforms TEXT[] := ARRAY['Swiggy','Uber','Rapido','Zomato'];
  p TEXT;
BEGIN
  INSERT INTO public.worker_profiles (user_id, name, phone_number, vehicle_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1), 'Ravi'),
    NEW.raw_user_meta_data ->> 'phone_number',
    COALESCE(NEW.raw_user_meta_data ->> 'vehicle_type', 'EV_Bike')
  )
  RETURNING id INTO new_worker_id;

  INSERT INTO public.wallet_and_credit (worker_id, wallet_balance, gig_credit_score, active_loan_amount)
  VALUES (new_worker_id, 2400, 780, 0);

  INSERT INTO public.welfare_tracker (worker_id, active_working_days, is_eligible_for_state_benefits)
  VALUES (new_worker_id, 85, false);

  -- Seed 30 days of earnings across 4 platforms (deterministic-ish demo data)
  FOR d IN 0..29 LOOP
    FOREACH p IN ARRAY platforms LOOP
      INSERT INTO public.earnings_ledger (worker_id, date, amount_earned, source_platform)
      VALUES (
        new_worker_id,
        CURRENT_DATE - d,
        ROUND((150 + (random() * 300))::numeric, 2),
        p
      );
    END LOOP;
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_worker();

-- Keep wallet/welfare updated_at fresh
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER wallet_touch BEFORE UPDATE ON public.wallet_and_credit
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER welfare_touch BEFORE UPDATE ON public.welfare_tracker
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();