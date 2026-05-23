import { useSyncExternalStore } from "react";

export type Bill = { id: string; label: string; kn: string; amount: number; icon: string; paid?: boolean };

type State = { bills: Bill[] };

let state: State = {
  bills: [
    { id: "ev", label: "Ather EV EMI", kn: "ವಿದ್ಯುತ್ ವಾಹನ ಕಂತು", amount: 150, icon: "⚡" },
    { id: "elec", label: "BESCOM Electricity", kn: "ವಿದ್ಯುತ್ ಬಿಲ್", amount: 400, icon: "💡" },
    { id: "rent", label: "PG Rent (split)", kn: "ಬಾಡಿಗೆ", amount: 1200, icon: "🏠" },
    { id: "data", label: "Jio Recharge", kn: "ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್", amount: 249, icon: "📶" },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const billsStore = {
  get: () => state,
  markPaid: (id: string) => {
    state = { bills: state.bills.map((b) => (b.id === id ? { ...b, paid: true } : b)) };
    emit();
  },
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
};

export const useBills = () =>
  useSyncExternalStore(billsStore.subscribe, billsStore.get, billsStore.get);
