import { Mic, MicOff, Sparkles, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { OsCard, HudLabel } from "./OsCard";

const localeVoice: Record<string, string> = {
  en: "en-IN",
  kn: "kn-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
};

const quickPrompts = (t: ReturnType<typeof useI18n>["t"]) => [
  t.voice.promptEarnings,
  t.voice.promptSurge,
  t.voice.promptCredit,
  t.voice.promptWelfare,
];

export function VoiceAssistantFab() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = localeVoice[locale] ?? "en-IN";
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    },
    [locale],
  );

  const respond = useCallback(
    (input: string) => {
      const lower = input.toLowerCase();
      let answer: string = t.voice.defaultReply;
      if (lower.includes("earn") || lower.includes("आद") || lower.includes("ಕಮ")) {
        answer = t.voice.replyEarnings;
      } else if (lower.includes("surge") || lower.includes("demand") || lower.includes("zone")) {
        answer = t.voice.replySurge;
      } else if (lower.includes("credit") || lower.includes("loan")) {
        answer = t.voice.replyCredit;
      } else if (lower.includes("welfare") || lower.includes("shram") || lower.includes("esic")) {
        answer = t.voice.replyWelfare;
      }
      setReply(answer);
      speak(answer);
    },
    [speak, t],
  );

  const startListen = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setReply(t.voice.noSpeech);
      return;
    }
    const rec = new SR();
    rec.lang = localeVoice[locale] ?? "en-IN";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      respond(text);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
    setTranscript("");
    setReply("");
  }, [locale, respond, t]);

  useEffect(() => () => recRef.current?.abort(), []);

  return (
    <>
      <button
        type="button"
        aria-label={t.voice.title}
        onClick={() => setOpen(true)}
        className="fixed bottom-[5.5rem] right-4 z-50 grid h-14 w-14 place-items-center rounded-full border border-primary/50 bg-primary/20 text-primary shadow-[0_0_30px_hsl(var(--primary)/0.35)] backdrop-blur-xl transition active:scale-95"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl border-primary/30 bg-background/95 backdrop-blur-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-left">
              <Sparkles className="h-5 w-5 text-primary" />
              {t.voice.title}
            </SheetTitle>
            <p className="text-left text-sm text-muted-foreground">{t.voice.subtitle}</p>
          </SheetHeader>

          <div className="mt-4 space-y-4 pb-6">
            <OsCard glow="neon" className="min-h-[100px]">
              {transcript ? (
                <p className="text-sm">&ldquo;{transcript}&rdquo;</p>
              ) : (
                <p className="text-sm text-muted-foreground">{t.voice.tapToSpeak}</p>
              )}
              {reply && (
                <div className="mt-3 border-t border-border/60 pt-3">
                  <HudLabel className="text-secondary">{t.voice.aiResponse}</HudLabel>
                  <p className="mt-1 text-sm leading-relaxed">{reply}</p>
                </div>
              )}
            </OsCard>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={listening ? () => recRef.current?.abort() : startListen}
                className={cn(
                  "grid h-16 w-16 place-items-center rounded-full border-2 transition",
                  listening
                    ? "border-destructive bg-destructive/20 text-destructive animate-pulse"
                    : "border-primary bg-primary/15 text-primary",
                )}
              >
                {listening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
              </button>
              {reply && (
                <button
                  type="button"
                  onClick={() => speak(reply)}
                  className="grid h-16 w-16 place-items-center rounded-full border border-secondary/50 bg-secondary/15 text-secondary"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {quickPrompts(t).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setTranscript(p);
                    respond(p);
                  }}
                  className="rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-[11px] font-medium"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: { transcript: string } };
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}
