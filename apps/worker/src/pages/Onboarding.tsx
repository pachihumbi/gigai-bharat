import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { PlacePicker, type PickedPlace } from "@/components/PlacePicker";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { OnboardingAssistant } from "@/components/gurukul/OnboardingAssistant";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check, Camera, FileText, Fingerprint, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { z } from "zod";
import { fleetVehicleOptions } from "@/data/ev-fleet";
import { onboardingSteps } from "@/data/gurukul";

const PLATFORMS = ["Swiggy", "Uber", "Rapido", "Ola", "Zomato"];

const onboardSchema = z.object({
  name: z.string().trim().min(2).max(60),
  phone: z.string().trim().regex(/^[0-9]{10}$/),
  vehicle: z.string().min(1),
  platforms: z.array(z.string()).min(1).max(8),
  place: z.object({ lat: z.number(), lng: z.number(), address: z.string().min(1) }).nullable(),
});

const mentorMessages = [
  "Welcome! I'll guide you in your language. Under 5 minutes to your sovereign worker dashboard.",
  "Tell me your name and phone. Aadhaar & DigiLocker integration coming soon — architecture ready today.",
  "Quick selfie + document scan builds your trust profile. Tap to simulate — AI verifies in seconds.",
  "Pick your VinFast EV and main platform. One tap each — we handle the rest.",
  "Your skill profile is ready! Launch into Gurukul AI and your command center.",
];

const Onboarding = () => {
  const nav = useNavigate();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("VinFast_MPV7");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [place, setPlace] = useState<PickedPlace | null>(null);
  const [selfieDone, setSelfieDone] = useState(false);
  const [docDone, setDocDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [workerId, setWorkerId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { nav("/auth", { replace: true }); return; }
      const { data } = await supabase
        .from("worker_profiles")
        .select("id, name, phone_number, vehicle_type, platforms, onboarded, home_lat, home_lng, home_address")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setWorkerId(data.id);
        if (data.onboarded) { nav("/dashboard", { replace: true }); return; }
        setName(data.name && data.name !== "Driver" ? data.name : "");
        setPhone(data.phone_number || "");
        setVehicle(data.vehicle_type || "VinFast_MPV7");
        setPlatforms((data.platforms as string[]) || []);
        if (data.home_lat && data.home_lng) {
          setPlace({ lat: Number(data.home_lat), lng: Number(data.home_lng), address: data.home_address || "" });
        }
      }
    })();
  }, [nav]);

  const togglePlatform = (p: string) => setPlatforms([p]);

  const submit = async () => {
    const parsed = onboardSchema.safeParse({ name, phone, vehicle, platforms, place });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (!workerId) { toast.error("Profile not ready"); return; }
    setBusy(true);
    const { error } = await supabase.from("worker_profiles").update({
      name: parsed.data.name,
      phone_number: parsed.data.phone,
      vehicle_type: parsed.data.vehicle,
      platforms: parsed.data.platforms,
      home_lat: parsed.data.place?.lat ?? null,
      home_lng: parsed.data.place?.lng ?? null,
      home_address: parsed.data.place?.address ?? null,
      onboarded: true,
    }).eq("id", workerId);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t.gurukul.launchSuccess);
    nav("/gurukul", { replace: true });
  };

  const canNext =
    step === 0 ? true :
    step === 1 ? name.trim().length >= 2 && /^[0-9]{10}$/.test(phone) :
    step === 2 ? selfieDone && docDone :
    step === 3 ? !!vehicle && platforms.length > 0 :
    true;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Logo size={40} />
          <LanguageSwitcher />
        </div>

        <div className="mb-3 flex gap-1">
          {onboardingSteps.map((s, i) => (
            <div key={s.id} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted/40"}`} />
          ))}
        </div>

        <OnboardingAssistant message={mentorMessages[step]} />

        <div className="glass-card flex-1 p-5 animate-scale-in">
          {step === 0 && (
            <div className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-2xl font-extrabold text-gradient-neon">{t.gurukul.onboardTitle}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t.gurukul.onboardSub}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["Aadhaar-ready", "DigiLocker-ready", "Voice-guided", "< 5 min"].map((tag) => (
                  <span key={tag} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <HudLabel step>{t.onboarding.name}</HudLabel>
              <input
                type="text"
                placeholder={t.onboarding.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 w-full rounded-2xl border border-border bg-background/60 px-4 text-lg focus:border-primary focus:outline-none"
              />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-14 w-full rounded-2xl border border-border bg-background/60 px-4 text-lg tabular-nums focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setSelfieDone(true); toast.success(t.gurukul.selfieDone); }}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-6 transition ${selfieDone ? "border-secondary bg-secondary/10" : "border-border"}`}
              >
                <Camera className="h-8 w-8 text-primary" />
                <span className="text-sm font-semibold">{t.gurukul.selfie}</span>
                {selfieDone && <Check className="h-4 w-4 text-secondary" />}
              </button>
              <button
                type="button"
                onClick={() => { setDocDone(true); toast.success(t.gurukul.docDone); }}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-6 transition ${docDone ? "border-secondary bg-secondary/10" : "border-border"}`}
              >
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-sm font-semibold">{t.gurukul.docScan}</span>
                {docDone && <Check className="h-4 w-4 text-secondary" />}
              </button>
              <div className="col-span-2 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
                <Fingerprint className="h-4 w-4 shrink-0" />
                {t.gurukul.aadhaarReady}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">{t.onboarding.vehicleSub}</p>
              <div className="grid grid-cols-2 gap-2">
                {fleetVehicleOptions.slice(0, 2).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicle(v.id)}
                    className={`rounded-xl border p-3 text-left text-sm font-semibold ${vehicle === v.id ? "border-primary bg-primary/10" : "border-border"}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{t.gurukul.mainPlatform}</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${platforms.includes(p) ? "bg-secondary/15 text-secondary border border-secondary/40" : "border border-border"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <PlacePicker value={place} onChange={setPlace} />
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-4">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-neon text-3xl font-bold text-primary-foreground">
                {name[0]?.toUpperCase() || "G"}
              </div>
              <p className="mt-4 text-xl font-bold">{name}</p>
              <p className="text-sm text-muted-foreground">{t.gurukul.profileReady}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="rounded-lg bg-primary/10 p-2"><p className="font-bold text-primary">Identity</p>✓</div>
                <div className="rounded-lg bg-secondary/10 p-2"><p className="font-bold text-secondary">Skills</p>AI</div>
                <div className="rounded-lg bg-accent/10 p-2"><p className="font-bold text-accent">Gurukul</p>Ready</div>
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="h-14 rounded-2xl border border-border px-4 text-sm font-semibold">
                {t.gurukul.back}
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-neon font-bold text-primary-foreground disabled:opacity-50"
              >
                {step === 0 ? t.gurukul.oneTap : t.gurukul.continue} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-neon font-bold text-primary-foreground"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.gurukul.launch} <ArrowRight className="h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function HudLabel({ children, step: isStep }: { children: React.ReactNode; step?: boolean }) {
  return (
    <p className={`font-mono-tech uppercase tracking-widest text-muted-foreground ${isStep ? "text-[10px] mb-2" : ""}`}>
      {children}
    </p>
  );
}

export default Onboarding;
