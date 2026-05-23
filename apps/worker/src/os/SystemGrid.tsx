import { BookOpen, Camera, Car, Landmark, Map, Shield, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/context";
import { OsCard, HudLabel } from "./OsCard";

const icons = {
  ledger: BookOpen,
  credit: Shield,
  dispatch: Map,
  welfare: Landmark,
  gigpay: Wallet,
  ocr: Camera,
  ev: Car,
  security: Shield,
} as const;

export function SystemGrid() {
  const { t } = useI18n();
  const items = [
    { key: "ledger" as const, path: "/ledger", label: t.systems.ledger, desc: t.systems.ledgerDesc },
    { key: "credit" as const, path: "/credit", label: t.systems.credit, desc: t.systems.creditDesc },
    { key: "dispatch" as const, path: "/dispatch", label: t.systems.dispatch, desc: t.systems.dispatchDesc },
    { key: "welfare" as const, path: "/welfare", label: t.systems.welfare, desc: t.systems.welfareDesc },
    { key: "gigpay" as const, path: "/gigpay", label: t.systems.gigpay, desc: t.systems.gigpayDesc },
    { key: "ev" as const, path: "/ev-command", label: t.systems.ev, desc: t.systems.evDesc },
    { key: "security" as const, path: "/security", label: t.systems.security, desc: t.systems.securityDesc },
    { key: "ocr" as const, path: "/ocr", label: t.systems.ocr, desc: t.systems.ocrDesc },
  ];

  return (
    <div>
      <HudLabel className="mb-3 block text-primary">{t.systems.title}</HudLabel>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ key, path, label, desc }) => {
          const Icon = icons[key];
          return (
            <Link key={key} to={path}>
              <OsCard className="h-full border-border/60 hover:border-primary/40">
                <Icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{desc}</p>
              </OsCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
