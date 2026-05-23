REVOKE EXECUTE ON FUNCTION public.increment_balance(uuid, numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_balance(uuid, numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_score(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_balance(uuid, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_balance(uuid, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_score(uuid, integer) TO authenticated;