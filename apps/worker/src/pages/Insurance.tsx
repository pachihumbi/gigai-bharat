import { AppShell } from "@/components/AppShell";
import { OsCard, HudLabel } from "@/os/OsCard";
import { Shield, Heart, Car } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  { icon: Car, title: "Accident cover", cover: "₹5L", status: "Active", premium: "₹149/mo" },
  { icon: Heart, title: "Health bundle", cover: "₹2L", status: "Active", premium: "₹99/mo" },
  { icon: Shield, title: "Life + family", cover: "₹10L", status: "Eligible", premium: "₹199/mo" },
];

export default function Insurance() {
  return (
    <AppShell title="Insurance" kn="ವಿಮೆ · ShramSetu worker protection">
      <p className="mb-4 text-sm text-muted-foreground">
        e-Shram linked coverage — accident, health, and life via GigPay auto-debit.
      </p>
      <ul className="space-y-3">
        {plans.map(({ icon: Icon, title, cover, status, premium }) => (
          <li key={title}>
            <OsCard>
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {cover} · {premium}
                  </p>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase text-primary">
                  {status}
                </span>
              </div>
            </OsCard>
          </li>
        ))}
      </ul>
      <Link
        to="/welfare"
        className="mt-6 block text-center font-mono text-xs uppercase tracking-wider text-primary underline-offset-4 hover:underline"
      >
        Full ShramSetu welfare →
      </Link>
    </AppShell>
  );
}
