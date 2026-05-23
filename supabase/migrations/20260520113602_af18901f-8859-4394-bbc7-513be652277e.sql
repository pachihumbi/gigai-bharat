
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  user_id uuid,
  action text NOT NULL,
  amount numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_worker_id ON public.audit_log(worker_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON public.audit_log(action, created_at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit self select"
ON public.audit_log
FOR SELECT
USING (worker_id IS NOT NULL AND public.owns_worker(worker_id));

-- No INSERT/UPDATE/DELETE policies; only SECURITY DEFINER functions can write.

-- Internal logger (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.log_audit(
  _worker_id uuid,
  _action text,
  _amount numeric DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), _action, _amount, COALESCE(_metadata, '{}'::jsonb));
END;
$$;

-- Allow authenticated callers (including edge functions w/ user JWT) to log
REVOKE ALL ON FUNCTION public.log_audit(uuid, text, numeric, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_audit(uuid, text, numeric, jsonb) TO authenticated, service_role;

-- Wrap wallet RPCs to write audit entries
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

  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'increment_balance', _amount,
          jsonb_build_object('new_balance', new_balance));

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

  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'decrement_balance', _amount,
          jsonb_build_object('new_balance', new_balance));

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
  IF _points IS NULL OR _points <= 0 OR _points > 50 THEN
    RAISE EXCEPTION 'points out of allowed range';
  END IF;
  UPDATE public.wallet_and_credit
  SET gig_credit_score = LEAST(900, gig_credit_score + _points),
      updated_at = now()
  WHERE worker_id = _worker_id
  RETURNING gig_credit_score INTO new_score;

  INSERT INTO public.audit_log (worker_id, user_id, action, amount, metadata)
  VALUES (_worker_id, auth.uid(), 'increment_score', _points,
          jsonb_build_object('new_score', new_score));

  RETURN new_score;
END;
$$;
