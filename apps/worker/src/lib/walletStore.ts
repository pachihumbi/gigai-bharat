export type Bill = {
  id: string;
  label: string;
  kn: string;
  amount: number;
  icon: string;
  paid?: boolean;
};

/** Default bill templates — used for preview mode and DB seeding. */
export const DEFAULT_BILLS: Bill[] = [
  { id: "ev", label: "Ather EV EMI", kn: "ವಿದ್ಯುತ್ ವಾಹನ ಕಂತು", amount: 150, icon: "⚡" },
  { id: "elec", label: "BESCOM Electricity", kn: "ವಿದ್ಯುತ್ ಬಿಲ್", amount: 400, icon: "💡" },
  { id: "rent", label: "PG Rent (split)", kn: "ಬಾಡಿಗೆ", amount: 1200, icon: "🏠" },
  { id: "data", label: "Jio Recharge", kn: "ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್", amount: 249, icon: "📶" },
];
