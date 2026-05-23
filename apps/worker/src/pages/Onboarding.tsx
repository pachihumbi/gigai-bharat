import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { PlacePicker, type PickedPlace } from "@/components/PlacePicker";
import { toast } from "sonner";
import { Loader2, ArrowRight, Bike, Car, Truck, Check } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { z } from "zod";

const VEHICLES = [
  { id: "EV_Bike", label: "EV Bike", kn: "ಇವಿ ಬೈಕ್", icon: Bike },
  { id: "Bike", label: "Petrol Bike", kn: "ಪೆಟ್ರೋಲ್ ಬೈಕ್", icon: Bike },
  { id: "Auto", label: "Auto", kn: "ಆಟೋ", icon: Car },
  { id: "Car", label: "Car", kn: "ಕಾರ್", icon: Car },
  { id: "Truck", label: "Mini Truck", kn: "ಮಿನಿ ಟ್ರಕ್", icon: Truck },
];

const PLATFORMS = ["Swiggy", "Zomato", "Uber", "Ola", "Rapido", "Dunzo", "BluSmart", "Porter"];

const onboardSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(60),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Enter a 10-digit phone"),
  vehicle: z.string().min(1),
  platforms: z.array(z.string()).min(1, "Pick at least one platform").max(8),
  place: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(1),
  }).nullable(),
});

const Onboarding = () => {
  const nav = useNavigate();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("EV_Bike");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [place, setPlace] = useState<PickedPlace | null>(null);
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
        setVehicle(data.vehicle_type || "EV_Bike");
        setPlatforms((data.platforms as string[]) || []);
        if (data.home_lat && data.home_lng) {
          setPlace({ lat: Number(data.home_lat), lng: Number(data.home_lng), address: data.home_address || "" });
        }
      }
    })();
  }, [nav]);

  const togglePlatform = (p: string) =>
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const submit = async () => {
    const parsed = onboardSchema.safeParse({ name, phone, vehicle, platforms, place });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (!workerId) { toast.error("Profile not ready, try again"); return; }
    setBusy(true);
    const { error } = await supabase
      .from("worker_profiles")
      .update({
        name: parsed.data.name,
        phone_number: parsed.data.phone,
        vehicle_type: parsed.data.vehicle,
        platforms: parsed.data.platforms,
        home_lat: parsed.data.place?.lat ?? null,
        home_lng: parsed.data.place?.lng ?? null,
        home_address: parsed.data.place?.address ?? null,
        onboarded: true,
      })
      .eq("id", workerId);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("You're all set 🎉", { description: "Welcome to GigAI Bharat" });
    nav("/dashboard", { replace: true });
  };

  const canNext =
    step === 0 ? name.trim().length >= 2 && /^[0-9]{10}$/.test(phone) :
    step === 1 ? !!vehicle :
    step === 2 ? platforms.length > 0 :
    true; // location step is optional

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero grid-bg flex flex-col">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md flex-1 flex flex-col px-6 py-8">
        <div className="flex flex-col items-center text-center mb-6 animate-fade-in">
          <Logo size={48} />
          <h1 className="mt-2 text-2xl font-extrabold text-gradient-neon">{t.onboarding.welcome}</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">{t.onboarding.welcomeSub}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-5">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-gradient-neon" : "bg-muted/40"}`} />
          ))}
        </div>

        <div className="glass-card p-5 animate-scale-in">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">STEP 1 / 4 • PROFILE</p>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                className="w-full h-12 px-4 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm"
              />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full h-12 px-4 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm tabular-nums"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">STEP 2 / 4 • VEHICLE</p>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLES.map((v) => {
                  const Icon = v.icon;
                  const active = vehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVehicle(v.id)}
                      className={`p-3 rounded-xl border transition text-left ${active ? "border-primary bg-primary/10 shadow-[0_0_18px_hsl(var(--primary)/0.35)]" : "border-border bg-background/40"}`}
                    >
                      <Icon className={`h-5 w-5 mb-1 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="text-sm font-semibold">{v.label}</p>
                      <p className="text-[10px] font-kannada text-muted-foreground">{v.kn}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">STEP 3 / 4 • PLATFORMS</p>
              <p className="text-xs text-muted-foreground">Pick every app you work on. We'll unify earnings.</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const active = platforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold border transition flex items-center gap-1.5 ${active ? "border-secondary bg-secondary/15 text-secondary" : "border-border bg-background/40 text-muted-foreground"}`}
                    >
                      {active && <Check className="h-3.5 w-3.5" />} {p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-[10px] font-mono-tech tracking-widest text-muted-foreground">STEP 4 / 4 • HOME BASE</p>
              <p className="text-xs text-muted-foreground">Where do you start your shift? We'll show nearby hotspots.</p>
              <PlacePicker value={place} onChange={setPlace} />
              <p className="text-[10px] text-muted-foreground italic">Optional — you can skip and add it later.</p>
            </div>
          )}

          <div className="flex gap-2 mt-5">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="h-12 px-4 rounded-xl border border-border text-sm font-semibold text-muted-foreground"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="flex-1 h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={busy}
                className="flex-1 h-12 rounded-xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.onboarding.finish} <ArrowRight className="h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>


        <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
          POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
