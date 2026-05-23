CREATE OR REPLACE FUNCTION public.increment_balance(_worker_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'not authorized';
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
SET search_path = public
AS $$
DECLARE
  new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'not authorized';
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
SET search_path = public
AS $$
DECLARE
  new_score integer;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  UPDATE public.wallet_and_credit
  SET gig_credit_score = LEAST(900, gig_credit_score + _points),
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING gig_credit_score INTO new_score;
  RETURN new_score;
END;
$$;