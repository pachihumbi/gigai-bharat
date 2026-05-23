-- Standardize authorization errors as SQLSTATE 42501 (PostgREST -> 403)
-- and add a validated RPC for loan acceptance so direct wallet UPDATEs are no longer needed.

CREATE OR REPLACE FUNCTION public.increment_balance(_worker_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'forbidden: caller does not own worker' USING ERRCODE = '42501';
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'amount must be positive' USING ERRCODE = '22023';
  END IF;
  IF _amount > 100000 THEN
    RAISE EXCEPTION 'amount exceeds allowed single-transaction limit' USING ERRCODE = '22023';
  END IF;
  UPDATE public.wallet_and_credit
  SET wallet_balance = wallet_balance + _amount, updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING wallet_balance INTO new_balance;
  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'increment_balance', _amount, jsonb_build_object('new_balance', new_balance));
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_balance(_worker_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'forbidden: caller does not own worker' USING ERRCODE = '42501';
  END IF;
  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'amount must be positive' USING ERRCODE = '22023';
  END IF;
  IF _amount > 100000 THEN
    RAISE EXCEPTION 'amount exceeds allowed single-transaction limit' USING ERRCODE = '22023';
  END IF;
  UPDATE public.wallet_and_credit
  SET wallet_balance = GREATEST(0, wallet_balance - _amount), updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING wallet_balance INTO new_balance;
  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'decrement_balance', _amount, jsonb_build_object('new_balance', new_balance));
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_score(_worker_id uuid, _points integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE new_score integer;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'forbidden: caller does not own worker' USING ERRCODE = '42501';
  END IF;
  IF _points IS NULL OR _points <= 0 OR _points > 50 THEN
    RAISE EXCEPTION 'points out of allowed range' USING ERRCODE = '22023';
  END IF;
  UPDATE public.wallet_and_credit
  SET gig_credit_score = LEAST(900, gig_credit_score + _points), updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING gig_credit_score INTO new_score;
  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'increment_score', _points, jsonb_build_object('new_score', new_score));
  RETURN new_score;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_audit(_worker_id uuid, _action text, _amount numeric DEFAULT NULL, _metadata jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF _worker_id IS NOT NULL AND NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'forbidden: caller does not own worker' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), _action, _amount, COALESCE(_metadata, '{}'::jsonb));
END;
$$;

-- New: validated loan acceptance RPC (replaces direct UPDATE in client)
CREATE OR REPLACE FUNCTION public.accept_loan(_worker_id uuid, _amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_loan numeric;
  new_balance numeric;
BEGIN
  IF NOT public.owns_worker(_worker_id) THEN
    RAISE EXCEPTION 'forbidden: caller does not own worker' USING ERRCODE = '42501';
  END IF;
  IF _amount IS NULL OR _amount <= 0 OR _amount > 50000 THEN
    RAISE EXCEPTION 'loan amount out of allowed range' USING ERRCODE = '22023';
  END IF;

  SELECT active_loan_amount INTO current_loan
  FROM public.wallet_and_credit WHERE worker_id = _worker_id;

  IF current_loan IS NULL THEN
    RAISE EXCEPTION 'wallet not found' USING ERRCODE = 'P0002';
  END IF;
  IF current_loan > 0 THEN
    RAISE EXCEPTION 'existing active loan' USING ERRCODE = '22023';
  END IF;

  UPDATE public.wallet_and_credit
  SET wallet_balance = wallet_balance + _amount,
      active_loan_amount = active_loan_amount + _amount,
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING wallet_balance INTO new_balance;

  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'accept_loan', _amount,
          jsonb_build_object('new_balance', new_balance, 'loan', _amount));

  RETURN new_balance;
END;
$$;