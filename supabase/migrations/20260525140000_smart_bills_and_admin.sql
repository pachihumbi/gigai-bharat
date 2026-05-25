-- Smart bills (persisted UPI bill payments) + admin read policies

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

CREATE TABLE public.smart_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  bill_key TEXT NOT NULL,
  label TEXT NOT NULL,
  label_kn TEXT NOT NULL DEFAULT '',
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  icon TEXT NOT NULL DEFAULT '💡',
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (worker_id, bill_key)
);

CREATE INDEX idx_smart_bills_worker ON public.smart_bills (worker_id, paid, created_at);

ALTER TABLE public.smart_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bills self select" ON public.smart_bills
  FOR SELECT USING (public.owns_worker(worker_id));

CREATE POLICY "bills admin select" ON public.smart_bills
  FOR SELECT USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.seed_smart_bills(_worker_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.smart_bills (worker_id, bill_key, label, label_kn, amount, icon)
  VALUES
    (_worker_id, 'ev', 'Ather EV EMI', 'ವಿದ್ಯುತ್ ವಾಹನ ಕಂತು', 150, '⚡'),
    (_worker_id, 'elec', 'BESCOM Electricity', 'ವಿದ್ಯುತ್ ಬಿಲ್', 400, '💡'),
    (_worker_id, 'rent', 'PG Rent (split)', 'ಬಾಡಿಗೆ', 1200, '🏠'),
    (_worker_id, 'data', 'Jio Recharge', 'ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್', 249, '📶')
  ON CONFLICT (worker_id, bill_key) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.pay_smart_bill(_worker_id UUID, _bill_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bill_amount NUMERIC;
  bill_label TEXT;
  new_balance NUMERIC;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'forbidden: caller does not own worker' USING ERRCODE = '42501';
  END IF;

  SELECT amount, label
  INTO bill_amount, bill_label
  FROM public.smart_bills
  WHERE id = _bill_id AND worker_id = _worker_id AND paid = false
  FOR UPDATE;

  IF bill_amount IS NULL THEN
    RAISE EXCEPTION 'bill not found or already paid' USING ERRCODE = 'P0002';
  END IF;

  IF (
    SELECT wallet_balance
    FROM public.wallet_and_credit
    WHERE worker_id = _worker_id
    FOR UPDATE
  ) < bill_amount THEN
    RAISE EXCEPTION 'insufficient balance' USING ERRCODE = '22023';
  END IF;

  UPDATE public.wallet_and_credit
  SET wallet_balance = wallet_balance - bill_amount,
      gig_credit_score = LEAST(900, gig_credit_score + 5),
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING wallet_balance INTO new_balance;

  UPDATE public.smart_bills
  SET paid = true, paid_at = now()
  WHERE id = _bill_id;

  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (
    _worker_id,
    auth.uid(),
    'pay_smart_bill',
    bill_amount,
    jsonb_build_object('bill_id', _bill_id, 'label', bill_label, 'new_balance', new_balance)
  );

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.pay_smart_bill(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pay_smart_bill(UUID, UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.seed_smart_bills(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.seed_smart_bills(UUID) TO authenticated, service_role;

-- Admin read access for ops console
CREATE POLICY "worker admin select" ON public.worker_profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "audit admin select" ON public.audit_log
  FOR SELECT USING (public.is_admin());

CREATE POLICY "wallet admin select" ON public.wallet_and_credit
  FOR SELECT USING (public.is_admin());

CREATE POLICY "earnings admin select" ON public.earnings_ledger
  FOR SELECT USING (public.is_admin());

CREATE POLICY "welfare admin select" ON public.welfare_tracker
  FOR SELECT USING (public.is_admin());

-- Signup: profile + wallet + welfare + default bills (no fake earnings)
CREATE OR REPLACE FUNCTION public.handle_new_worker()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_worker_id UUID;
BEGIN
  INSERT INTO public.worker_profiles (user_id, name, phone_number, vehicle_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1), 'Worker'),
    NEW.raw_user_meta_data ->> 'phone_number',
    COALESCE(NEW.raw_user_meta_data ->> 'vehicle_type', 'EV_Bike')
  )
  RETURNING id INTO new_worker_id;

  INSERT INTO public.wallet_and_credit (worker_id, wallet_balance, gig_credit_score, active_loan_amount)
  VALUES (new_worker_id, 0, 300, 0);

  INSERT INTO public.welfare_tracker (worker_id, active_working_days, is_eligible_for_state_benefits)
  VALUES (new_worker_id, 0, false);

  PERFORM public.seed_smart_bills(new_worker_id);

  RETURN NEW;
END;
$$;

-- Backfill bills for existing workers
INSERT INTO public.smart_bills (worker_id, bill_key, label, label_kn, amount, icon)
SELECT wp.id, v.bill_key, v.label, v.label_kn, v.amount, v.icon
FROM public.worker_profiles wp
CROSS JOIN (
  VALUES
    ('ev', 'Ather EV EMI', 'ವಿದ್ಯುತ್ ವಾಹನ ಕಂತು', 150::numeric, '⚡'),
    ('elec', 'BESCOM Electricity', 'ವಿದ್ಯುತ್ ಬಿಲ್', 400::numeric, '💡'),
    ('rent', 'PG Rent (split)', 'ಬಾಡಿಗೆ', 1200::numeric, '🏠'),
    ('data', 'Jio Recharge', 'ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್', 249::numeric, '📶')
) AS v(bill_key, label, label_kn, amount, icon)
ON CONFLICT (worker_id, bill_key) DO NOTHING;
