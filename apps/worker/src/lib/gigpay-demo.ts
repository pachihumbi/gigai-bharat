export type GigPayTxnType = "credit" | "debit";

export type GigPayTransaction = {
  id: string;
  type: GigPayTxnType;
  title: string;
  subtitle: string;
  amount: number;
  timestamp: string;
  icon: string;
  status: "completed" | "pending";
};

export const DEMO_UPI_ID = "prashanth.gowda@okgigai";

export const DEMO_WEEKLY_GROWTH_PCT = 12.8;
export const DEMO_TODAY_EARNINGS = 2850;
export const DEMO_WEEKLY_EARNINGS = 17200;

/** Fallback 7-day chart when ledger is sparse (investor demo). */
export const DEMO_WEEKLY_CHART = [
  { date: "d-6", total: 2100, label: "Mon" },
  { date: "d-5", total: 1850, label: "Tue" },
  { date: "d-4", total: 2400, label: "Wed" },
  { date: "d-3", total: 1950, label: "Thu" },
  { date: "d-2", total: 2850, label: "Fri" },
  { date: "d-1", total: 3200, label: "Sat" },
  { date: "d-0", total: 2850, label: "Sun" },
] as const;

/** Investor-demo transaction feed (merged with live earnings in UI). */
export const DEMO_TRANSACTIONS: GigPayTransaction[] = [
  {
    id: "txn-1",
    type: "credit",
    title: "Swiggy earnings",
    subtitle: "OCR verified · T+0",
    amount: 1250,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    icon: "🛵",
    status: "completed",
  },
  {
    id: "txn-2",
    type: "credit",
    title: "Rapido payout",
    subtitle: "Instant settlement",
    amount: 1600,
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    icon: "🏍",
    status: "completed",
  },
  {
    id: "txn-3",
    type: "debit",
    title: "UPI · BESCOM",
    subtitle: "Electricity bill",
    amount: 400,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    icon: "💡",
    status: "completed",
  },
  {
    id: "txn-4",
    type: "credit",
    title: "Uber trip batch",
    subtitle: "Yesterday · 12 trips",
    amount: 1800,
    timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
    icon: "🚗",
    status: "completed",
  },
  {
    id: "txn-5",
    type: "debit",
    title: "Withdrawal to HDFC",
    subtitle: "****4821 · IMPS",
    amount: 3000,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    icon: "🏦",
    status: "completed",
  },
  {
    id: "txn-6",
    type: "credit",
    title: "Zomato earnings",
    subtitle: "Peak hour bonus incl.",
    amount: 1400,
    timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(),
    icon: "📦",
    status: "completed",
  },
  {
    id: "txn-7",
    type: "debit",
    title: "Jio recharge",
    subtitle: "UPI autopay",
    amount: 249,
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    icon: "📶",
    status: "completed",
  },
];

export const UPI_QUICK_ACTIONS = [
  { id: "send", label: "Send", kn: "ಕಳುಹಿಸಿ", icon: "↗" },
  { id: "request", label: "Request", kn: "ಕೇಳಿ", icon: "↙" },
  { id: "scan", label: "Scan", kn: "ಸ್ಕ್ಯಾನ್", icon: "▣" },
  { id: "bills", label: "Bills", kn: "ಬಿಲ್", icon: "⚡" },
  { id: "add", label: "Add ₹", kn: "ಸೇರಿಸಿ", icon: "+" },
  { id: "history", label: "History", kn: "ಚರಿತ್ರೆ", icon: "☰" },
] as const;
