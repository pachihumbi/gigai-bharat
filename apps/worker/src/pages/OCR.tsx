import { AppShell } from "@/components/AppShell";
import { useRef, useState } from "react";
import { Camera, CheckCircle2, FileImage, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useI18n } from "@/i18n/context";

const STAGES = [
  { label: "Reading screenshot", kn: "ಚಿತ್ರ ಓದಲಾಗುತ್ತಿದೆ" },
  { label: "Detecting platforms", kn: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಗುರುತಿಸುವಿಕೆ" },
  { label: "Parsing earnings (Gemini Vision)", kn: "ಆದಾಯ ವಿಶ್ಲೇಷಣೆ" },
  { label: "Saving to ledger", kn: "ಲೆಡ್ಜರ್‌ಗೆ ಉಳಿಸಲಾಗುತ್ತಿದೆ" },
];

const PLATFORM_COLOR: Record<string, string> = {
  Swiggy: "hsl(33 100% 50%)",
  Rapido: "hsl(48 100% 55%)",
  Uber: "hsl(200 100% 60%)",
  Zomato: "hsl(0 90% 60%)",
  Ola: "hsl(140 70% 55%)",
  Dunzo: "hsl(280 80% 65%)",
  Direct_GigAI: "hsl(160 100% 50%)",
  Other: "hsl(0 0% 70%)",
};

type Row = { platform: string; amount_earned: number; trips?: number; date: string };

const fileToDataUrl = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

const OCR = () => {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [stage, setStage] = useState(-1);
  const [done, setDone] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [pendingRows, setPendingRows] = useState<Row[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  const handleFile = async (file: File) => {
    setDone(false);
    setRows([]);
    setPendingRows([]);
    setReviewing(false);
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);

    setStage(0);
    await new Promise((r) => setTimeout(r, 350));
    setStage(1);

    try {
      const { data, error } = await supabase.functions.invoke("parse-earning", {
        body: { image: dataUrl },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setStage(2);
      const parsed: Row[] = (data.rows || []).filter(
        (r: Row) => r && r.platform && Number.isFinite(Number(r.amount_earned)),
      );
      if (parsed.length === 0) throw new Error("No earnings detected in screenshot");

      setPendingRows(parsed);
      setConfidence(Number(data.confidence) || 0.95);
      setReviewing(true);
      setStage(STAGES.length - 1);
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to parse screenshot");
      setStage(-1);
    }
  };

  const confirmSave = async () => {
    if (pendingRows.length === 0) return;
    setStage(3);
    setReviewing(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data: worker, error: wErr } = await supabase
        .from("worker_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (wErr || !worker) throw new Error("Worker profile missing");

      const inserts = pendingRows.map((r) => ({
        worker_id: worker.id,
        date: r.date,
        amount_earned: r.amount_earned,
        source_platform: r.platform,
      }));
      const { error: insErr } = await supabase.from("earnings_ledger").insert(inserts);
      if (insErr) throw insErr;

      const total = pendingRows.reduce((a, b) => a + Number(b.amount_earned), 0);
      if (total > 0) {
        const { walletRpc } = await import("@/lib/walletAuth");
        await walletRpc.incrementBalance(worker.id, total);
      }

      setRows(pendingRows);
      setPendingRows([]);
      setDone(true);
      setStage(STAGES.length);
      toast.success(`₹${total} added to your ledger`);
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to save");
      setReviewing(true);
    }
  };

  const onPick = () => inputRef.current?.click();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const total = (reviewing ? pendingRows : rows).reduce((a, b) => a + Number(b.amount_earned), 0);
  const busy = stage >= 0 && stage < STAGES.length - 1 && !reviewing && !done;

  return (
    <AppShell title={t.ocr.title}>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />

      {/* Upload pane */}
      <div className="relative glass-card overflow-hidden p-5 mb-4 animate-scale-in">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
        <button
          type="button"
          onClick={!busy ? onPick : undefined}
          className="relative aspect-[4/5] w-full rounded-2xl border-2 border-dashed border-primary/40 bg-background/40 overflow-hidden grid place-items-center"
        >
          {preview ? (
            <img src={preview} alt="screenshot preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-4 rounded-xl bg-gradient-to-b from-muted/40 to-background/60 p-3 space-y-2">
              <div className="h-3 w-1/2 rounded bg-muted/70" />
              <div className="h-3 w-3/4 rounded bg-muted/50" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["Swiggy", "Rapido", "Uber", "Zomato"].map((a) => (
                  <div key={a} className="rounded-lg bg-card/70 p-2 border border-border/60">
                    <p className="text-[10px] font-mono-tech" style={{ color: PLATFORM_COLOR[a] }}>{a}</p>
                    <p className="text-sm font-bold tabular-nums text-muted-foreground">₹—</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {busy && (
            <>
              <div className="absolute inset-0 bg-primary/5" />
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_24px_hsl(var(--secondary))]"
                style={{ animation: "scanline 1.6s linear infinite", top: 0 }}
              />
              <style>{`@keyframes scanline { 0%{top:0%} 100%{top:100%} }`}</style>
            </>
          )}
          {done && (
            <div className="absolute inset-0 bg-secondary/10 grid place-items-center animate-fade-in">
              <CheckCircle2 className="h-16 w-16 text-secondary drop-shadow-[0_0_18px_hsl(var(--secondary))]" />
            </div>
          )}
          {stage === -1 && !preview && (
            <div className="relative z-10 text-center px-6">
              <FileImage className="h-10 w-10 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold">{t.ocr.upload}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Swiggy • Rapido • Uber • Zomato</p>
            </div>
          )}
        </button>

        <button
          onClick={onPick}
          disabled={busy}
          className="mt-4 w-full h-12 rounded-2xl bg-gradient-neon text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 transition relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.3)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
          {busy ? (
            <><Loader2 className="h-4 w-4 animate-spin relative" /><span className="relative">Parsing with Gig AI...</span></>
          ) : done ? (
            <><Sparkles className="h-4 w-4 relative" /><span className="relative">Parse Another</span></>
          ) : (
            <><Camera className="h-4 w-4 relative" /><span className="relative">{t.ocr.parse}</span></>
          )}
        </button>
      </div>

      {/* Stage tracker */}
      {stage >= 0 && (
        <div className="glass-card p-4 mb-4 animate-fade-in">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-primary mb-3">Gig AI Predictive Engine</p>
          <div className="space-y-2">
            {STAGES.map((s, i) => {
              const active = i === stage;
              const complete = i < stage || done;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full grid place-items-center text-[10px] border ${complete ? "bg-secondary/20 border-secondary text-secondary" : active ? "bg-primary/20 border-primary text-primary" : "bg-muted/30 border-border/60 text-muted-foreground"}`}>
                    {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${active || complete ? "font-semibold" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-[10px] font-kannada text-muted-foreground">{s.kn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review before save */}
      {reviewing && pendingRows.length > 0 && (
        <div className="glass-card p-4 mb-4 animate-scale-in border-primary/40">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-primary mb-3">{t.ocr.review}</p>
          <div className="space-y-2 mb-4">
            {pendingRows.map((r, i) => (
              <div key={i} className="flex justify-between p-2 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-sm font-semibold">{r.platform}</span>
                <span className="text-sm font-bold tabular-nums text-secondary">₹{Number(r.amount_earned).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <p className="text-2xl font-extrabold text-gradient-neon tabular-nums mb-4">₹{total.toFixed(0)}</p>
          <button
            type="button"
            onClick={confirmSave}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-neon text-primary-foreground font-bold active:scale-95 transition"
          >
            {t.ocr.confirm}
          </button>
        </div>
      )}

      {/* Results after save */}
      {done && rows.length > 0 && (
        <div className="glass-card p-4 mb-4 animate-scale-in" style={{ boxShadow: "0 0 0 1px hsl(var(--secondary)/0.5), 0 0 40px hsl(var(--secondary)/0.3)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-secondary">Detected Earnings • ಪತ್ತೆಯಾಗಿದೆ</p>
            <span className="text-[10px] font-mono-tech text-secondary">{(confidence * 100).toFixed(1)}% conf.</span>
          </div>
          <div className="space-y-2">
            {rows.map((r, i) => {
              const color = PLATFORM_COLOR[r.platform] || PLATFORM_COLOR.Other;
              return (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-muted/30 border border-border/60 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                    <span className="text-sm font-semibold">{r.platform}</span>
                    {r.trips ? <span className="text-[10px] text-muted-foreground">{r.trips} trips</span> : null}
                    <span className="text-[10px] text-muted-foreground">{r.date}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-secondary">₹{Number(r.amount_earned).toFixed(0)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border/60 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Added to Ledger</p>
              <p className="text-3xl font-extrabold text-gradient-neon tabular-nums">₹{total.toFixed(0)}</p>
            </div>
            <Link to="/ledger" className="px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-bold active:scale-95 transition">
              View ledger →
            </Link>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] font-mono-tech tracking-[0.25em] text-muted-foreground mt-6">
        POWERED BY <span className="text-gradient-neon font-bold">GIGAI BHARAT</span>
      </p>
    </AppShell>
  );
};

export default OCR;
