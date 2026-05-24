import type { GigPayTransaction } from "@/lib/gigpay-demo";
import { formatInr, formatTxnTime } from "@/lib/gigpay-utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type TransactionHistoryProps = {
  transactions: GigPayTransaction[];
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div id="gigpay-transactions" className="fintech-card p-4 sm:p-5 animate-fade-in scroll-mt-24">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono-tech uppercase tracking-[0.22em] text-muted-foreground">
            Transaction history
          </p>
          <p className="text-sm font-semibold mt-0.5">Recent activity</p>
        </div>
        <span className="text-[10px] font-kannada text-muted-foreground">ವಹಿವಾಟು</span>
      </div>

      <div className="space-y-2">
        {transactions.map((txn, i) => (
          <div
            key={txn.id}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-black/25 px-3 py-3 transition-colors hover:border-cyan-400/15 animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${
                txn.type === "credit"
                  ? "bg-emerald-400/10 border border-emerald-400/25"
                  : "bg-orange-500/10 border border-orange-400/20"
              }`}
            >
              {txn.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{txn.title}</p>
              <p className="text-[11px] text-muted-foreground truncate">{txn.subtitle}</p>
            </div>

            <div className="text-right shrink-0">
              <p
                className={`text-sm font-bold tabular-nums flex items-center justify-end gap-0.5 ${
                  txn.type === "credit" ? "text-emerald-400" : "text-foreground"
                }`}
              >
                {txn.type === "credit" ? (
                  <ArrowDownLeft className="h-3 w-3" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 text-orange-400" />
                )}
                {txn.type === "credit" ? "+" : "-"}
                {formatInr(txn.amount)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatTxnTime(txn.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
