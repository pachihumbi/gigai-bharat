import { locales } from "@/i18n/messages";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  return (
    <div className={cn("flex max-w-[200px] overflow-x-auto rounded-lg border border-border/60 bg-muted/20 p-0.5", className)}>
      {locales.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setLocale(id)}
          className={cn(
            "min-h-9 min-w-[2rem] shrink-0 rounded-md px-1.5 text-[9px] font-mono-tech font-semibold transition",
            locale === id ? "bg-primary/20 text-primary" : "text-muted-foreground",
          )}
          aria-pressed={locale === id}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
