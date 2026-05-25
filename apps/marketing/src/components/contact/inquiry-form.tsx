import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { inquiryLabels, type InquiryType } from "@/data/emails";
import type { InquiryPayload } from "@/lib/email/schemas";

type InvestorStage = Extract<InquiryPayload, { type: "investor" }>["stage"];
type PartnershipType = Extract<InquiryPayload, { type: "partnership" }>["partnershipType"];

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; theme?: string; callback?: (token: string) => void; "expired-callback"?: () => void },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

type FormState = {
  name: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  subject: string;
  firm: string;
  stage: string;
  ticketSize: string;
  linkedin: string;
  organization: string;
  partnershipType: string;
  fleetSize: string;
  cities: string;
  role: string;
  portfolio: string;
  resumeUrl: string;
  outlet: string;
  deadline: string;
  storyAngle: string;
};

const emptyState: FormState = {
  name: "",
  email: "",
  message: "",
  company: "",
  phone: "",
  subject: "",
  firm: "",
  stage: "seed",
  ticketSize: "",
  linkedin: "",
  organization: "",
  partnershipType: "fleet",
  fleetSize: "",
  cities: "",
  role: "",
  portfolio: "",
  resumeUrl: "",
  outlet: "",
  deadline: "",
  storyAngle: "",
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "border-white/10 bg-black/40 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[color:var(--neon)]/40";

export function InquiryForm({ type, className }: { type: InquiryType; className?: string }) {
  const [form, setForm] = useState<FormState>(emptyState);
  const [mountedAt] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const [turnstileId, setTurnstileId] = useState<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      const el = document.getElementById(`turnstile-${type}`);
      if (el && window.turnstile && !turnstileId) {
        const id = window.turnstile.render(el, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(undefined),
        });
        setTurnstileId(id);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (turnstileId && window.turnstile) {
        window.turnstile.remove(turnstileId);
      }
      script.remove();
    };
  }, [type, turnstileId]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(): InquiryPayload {
    const base = {
      name: form.name,
      email: form.email,
      message: form.message,
      company: form.company || undefined,
      phone: form.phone || undefined,
      _website: "" as const,
      _ts: mountedAt,
      turnstileToken,
    };

    switch (type) {
      case "contact":
        return { type, subject: form.subject || undefined, ...base };
      case "investor":
        return {
          type,
          firm: form.firm,
          stage: form.stage as InvestorStage,
          ticketSize: form.ticketSize || undefined,
          linkedin: form.linkedin || undefined,
          ...base,
        };
      case "partnership":
        return {
          type,
          organization: form.organization,
          partnershipType: form.partnershipType as PartnershipType,
          fleetSize: form.fleetSize || undefined,
          cities: form.cities || undefined,
          ...base,
        };
      case "careers":
        return {
          type,
          role: form.role,
          linkedin: form.linkedin,
          portfolio: form.portfolio || undefined,
          resumeUrl: form.resumeUrl || undefined,
          ...base,
        };
      case "press":
        return {
          type,
          outlet: form.outlet,
          deadline: form.deadline || undefined,
          storyAngle: form.storyAngle,
          ...base,
        };
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      toast.success("Message sent — we'll be in touch shortly.");
      setForm(emptyState);
      setTurnstileToken(undefined);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <GlassPanel glow className="p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--neon)]">
          Secure channel · {inquiryLabels[type]}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Honeypot — hidden from users */}
          <input
            type="text"
            name="_website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden
            value=""
            readOnly
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *">
              <Input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email *">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
                placeholder="you@firm.com"
              />
            </Field>
          </div>

          {type === "contact" && (
            <Field label="Subject">
              <Input
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                className={inputClass}
                placeholder="How can we help?"
              />
            </Field>
          )}

          {type === "investor" && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Firm / fund *">
                  <Input
                    required
                    value={form.firm}
                    onChange={(e) => set("firm", e.target.value)}
                    className={inputClass}
                    placeholder="Fund name"
                  />
                </Field>
                <Field label="Stage *">
                  <select
                    required
                    value={form.stage}
                    onChange={(e) => set("stage", e.target.value)}
                    className={cn(
                      "flex h-9 w-full rounded-md border px-3 py-1 text-sm",
                      inputClass,
                    )}
                  >
                    <option value="pre-seed">Pre-seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="growth">Growth</option>
                    <option value="strategic">Strategic</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Ticket size">
                  <Input
                    value={form.ticketSize}
                    onChange={(e) => set("ticketSize", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. $500K–$2M"
                  />
                </Field>
                <Field label="LinkedIn">
                  <Input
                    value={form.linkedin}
                    onChange={(e) => set("linkedin", e.target.value)}
                    className={inputClass}
                    placeholder="https://linkedin.com/in/..."
                  />
                </Field>
              </div>
            </>
          )}

          {type === "partnership" && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Organization *">
                  <Input
                    required
                    value={form.organization}
                    onChange={(e) => set("organization", e.target.value)}
                    className={inputClass}
                    placeholder="Company name"
                  />
                </Field>
                <Field label="Partnership type *">
                  <select
                    required
                    value={form.partnershipType}
                    onChange={(e) => set("partnershipType", e.target.value)}
                    className={cn("flex h-9 w-full rounded-md border px-3 py-1 text-sm", inputClass)}
                  >
                    <option value="fleet">Fleet operator</option>
                    <option value="ev-charging">EV / charging</option>
                    <option value="city">City / government</option>
                    <option value="technology">Technology</option>
                    <option value="distribution">Distribution</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Fleet size">
                  <Input
                    value={form.fleetSize}
                    onChange={(e) => set("fleetSize", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 50–500 vehicles"
                  />
                </Field>
                <Field label="Target cities">
                  <Input
                    value={form.cities}
                    onChange={(e) => set("cities", e.target.value)}
                    className={inputClass}
                    placeholder="Bengaluru, Mumbai..."
                  />
                </Field>
              </div>
            </>
          )}

          {type === "careers" && (
            <>
              <Field label="Role / area *">
                <Input
                  required
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Full-stack engineer"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="LinkedIn *">
                  <Input
                    required
                    value={form.linkedin}
                    onChange={(e) => set("linkedin", e.target.value)}
                    className={inputClass}
                    placeholder="https://linkedin.com/in/..."
                  />
                </Field>
                <Field label="Portfolio">
                  <Input
                    value={form.portfolio}
                    onChange={(e) => set("portfolio", e.target.value)}
                    className={inputClass}
                    placeholder="GitHub or portfolio URL"
                  />
                </Field>
              </div>
              <Field label="Resume link">
                <Input
                  value={form.resumeUrl}
                  onChange={(e) => set("resumeUrl", e.target.value)}
                  className={inputClass}
                  placeholder="Google Drive / Notion link"
                />
              </Field>
            </>
          )}

          {type === "press" && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Outlet *">
                  <Input
                    required
                    value={form.outlet}
                    onChange={(e) => set("outlet", e.target.value)}
                    className={inputClass}
                    placeholder="Publication or channel"
                  />
                </Field>
                <Field label="Deadline">
                  <Input
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Friday EOD"
                  />
                </Field>
              </div>
              <Field label="Story angle *">
                <Input
                  required
                  value={form.storyAngle}
                  onChange={(e) => set("storyAngle", e.target.value)}
                  className={inputClass}
                  placeholder="What are you covering?"
                />
              </Field>
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company">
              <Input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
                placeholder="+91 ..."
              />
            </Field>
          </div>

          <Field label="Message *">
            <Textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className={cn(inputClass, "min-h-[120px] resize-y")}
              placeholder="Share context — the more specific, the faster we can help."
            />
          </Field>

          {turnstileSiteKey ? (
            <div id={`turnstile-${type}`} className="min-h-[65px]" />
          ) : null}

          <button
            type="submit"
            disabled={loading || (Boolean(turnstileSiteKey) && !turnstileToken)}
            className={cn(
              "inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[color:var(--neon)] bg-[color:var(--neon)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent-foreground)] transition-all",
              "hover:bg-transparent hover:text-[color:var(--neon)] disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Transmitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send securely
              </>
            )}
          </button>

          <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80">
            Encrypted transit · Rate limited · DPDP-aligned handling
          </p>
        </form>
      </GlassPanel>
    </motion.div>
  );
}
