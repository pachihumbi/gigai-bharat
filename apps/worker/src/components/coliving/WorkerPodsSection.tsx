import { useState } from "react";
import { POD_BOOKING, WORKER_PODS } from "@/lib/coliving-demo";
import { ArchitectureVisual } from "./ArchitectureVisual";
import { SectionHeader } from "./EvSmartHubSection";
import { cn } from "@/lib/utils";
import { Fingerprint, Moon, Star, BedDouble } from "lucide-react";
import { toast } from "sonner";

export function WorkerPodsSection() {
  const [selectedPod, setSelectedPod] = useState(WORKER_PODS[1].id);

  const bookShift = (label: string, price: number) => {
    toast.success("Pod booked", { description: `${label} · ₹${price} · Biometric check-in enabled` });
  };

  return (
    <section className="animate-fade-in">
      <SectionHeader
        icon={BedDouble}
        tag="02 · Smart Worker Pods"
        title="Capsule co-living for shift workers"
        subtitle="goSTOPS × capsule hotel · biometric · affordable"
      />

      <ArchitectureVisual variant="pods" className="mb-4" />

      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-emerald-400" />
          <span className="text-[10px] font-mono uppercase text-emerald-300/90">Biometric access enabled</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-300">
          <Star className="h-3 w-3 fill-amber-300" />
          {POD_BOOKING.avgRating}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {WORKER_PODS.map((pod) => (
          <button
            key={pod.id}
            type="button"
            onClick={() => setSelectedPod(pod.id)}
            className={cn(
              "pod-card w-full p-4 text-left transition-all duration-300 active:scale-[0.99]",
              selectedPod === pod.id && "pod-card-active",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      pod.tier === "executive"
                        ? "border-violet-400/40 bg-violet-400/15 text-violet-200"
                        : pod.tier === "premium"
                          ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200"
                          : "border-white/15 bg-white/5 text-foreground/70",
                    )}
                  >
                    {pod.tier}
                  </span>
                  {pod.biometric && <Fingerprint className="h-3 w-3 text-emerald-400" />}
                </div>
                <p className="mt-1.5 text-base font-bold text-bright">{pod.name}</p>
                <p className="text-[11px] text-foreground/60">
                  ₹{pod.pricePerShift}/shift · {pod.shiftHours}h · {pod.available}/{pod.total} available
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-emerald-300">₹{pod.pricePerShift}</p>
                <p className="text-[10px] text-foreground/50">per shift</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pod.features.map((f) => (
                <span key={f} className="text-[10px] px-2 py-0.5 rounded-lg bg-black/30 border border-white/[0.06] text-foreground/65">
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${((pod.total - pod.available) / pod.total) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="pod-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Moon className="h-4 w-4 text-violet-300" />
          <p className="text-sm font-bold text-bright">Shift-based booking</p>
        </div>
        <div className="space-y-2">
          {POD_BOOKING.shiftBlocks.map((block) => (
            <div
              key={block.label}
              className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/25 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-semibold text-bright">{block.label}</p>
                <p className="text-[11px] text-foreground/55">{block.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-300">{block.slots} slots</span>
                <button
                  type="button"
                  onClick={() => bookShift(block.label, block.price)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400/20 border border-cyan-400/35 text-[11px] font-bold text-cyan-100 active:scale-95 transition"
                >
                  ₹{block.price}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-foreground/55 text-center">
          Next available · {POD_BOOKING.nextAvailable} · {POD_BOOKING.currentOccupancy}% occupancy tonight
        </p>
      </div>
    </section>
  );
}
