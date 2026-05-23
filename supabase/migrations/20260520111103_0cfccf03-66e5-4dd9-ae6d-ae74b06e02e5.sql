
-- 1. Add validation to financial RPCs
CREATE OR REPLACE FUNCTION public.increment_balance(_worker_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'amount must be positive';
  END IF;
  IF _amount > 100000 THEN
    RAISE EXCEPTION 'amount exceeds allowed single-transaction limit';
  END IF;
  UPDATE public.wallet_and_credit
  SET wallet_balance = wallet_balance + _amount,
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING wallet_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_balance(_worker_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'amount must be positive';
  END IF;
  IF _amount > 100000 THEN
    RAISE EXCEPTION 'amount exceeds allowed single-transaction limit';
  END IF;
  UPDATE public.wallet_and_credit
  SET wallet_balance = GREATEST(0, wallet_balance - _amount),
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING wallet_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_score(_worker_id uuid, _points integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_score integer;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _points IS NULL OR _points <= 0 OR _points > 50 THEN
    RAISE EXCEPTION 'points out of allowed range';
  END IF;
  UPDATE public.wallet_and_credit
  SET gig_credit_score = LEAST(900, gig_credit_score + _points),
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING gig_credit_score INTO new_score;
  RETURN new_score;
END;
$$;

-- 2. Remove direct UPDATE access to wallet_and_credit (force RPC usage)
DROP POLICY IF EXISTS "wallet self update" ON public.wallet_and_credit;

-- 3. Add a check on earnings to prevent negative amounts
ALTER TABLE public.earnings_ledger
  DROP CONSTRAINT IF EXISTS earnings_amount_nonneg;
ALTER TABLE public.earnings_ledger
  ADD CONSTRAINT earnings_amount_nonneg CHECK (amount_earned >= 0 AND amount_earned <= 100000);
