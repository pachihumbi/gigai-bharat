-- Real-world signup: create profile + empty wallet/welfare only (no seeded fake earnings).
CREATE OR REPLACE FUNCTION public.handle_new_worker()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
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

  RETURN NEW;
END;
$$;
