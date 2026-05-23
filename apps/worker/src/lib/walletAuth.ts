// Centralized wallet authorization helper.
// Every wallet/credit mutation MUST go through these wrappers so that
// `owns_worker` violations surface as a consistent 403-style error.

import { supabase } from "@/integrations/supabase/client";

export class WalletAuthError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.name = "WalletAuthError";
    this.status = status;
  }
}

const normalize = (error: { code?: string; message?: string } | null) => {
  if (!error) return;
  // PostgREST maps SQLSTATE 42501 -> HTTP 403
  if (error.code === "42501" || /forbidden|not authorized/i.test(error.message ?? "")) {
    throw new WalletAuthError("403 Forbidden: you do not own this wallet", 403);
  }
  throw new WalletAuthError(error.message ?? "Wallet operation failed", 400);
};

export const walletRpc = {
  async incrementBalance(workerId: string, amount: number) {
    const { data, error } = await supabase.rpc("increment_balance", {
      _worker_id: workerId,
      _amount: amount,
    });
    normalize(error as any);
    return data as number;
  },
  async decrementBalance(workerId: string, amount: number) {
    const { data, error } = await supabase.rpc("decrement_balance", {
      _worker_id: workerId,
      _amount: amount,
    });
    normalize(error as any);
    return data as number;
  },
  async incrementScore(workerId: string, points: number) {
    const { data, error } = await supabase.rpc("increment_score", {
      _worker_id: workerId,
      _points: points,
    });
    normalize(error as any);
    return data as number;
  },
  async acceptLoan(workerId: string, amount: number) {
    const { data, error } = await supabase.rpc("accept_loan" as any, {
      _worker_id: workerId,
      _amount: amount,
    });
    normalize(error as any);
    return data as number;
  },
};
