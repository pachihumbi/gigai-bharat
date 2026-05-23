import { useEffect, useState } from "react";

export type LiveMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  format: "int" | "float" | "ms";
  variance: number;
};

const BASE: LiveMetric[] = [
  { id: "active", label: "Active workers", value: 12400000, unit: "", format: "int", variance: 80000 },
  { id: "dispatch", label: "Dispatch p50", value: 1.8, unit: "s", format: "float", variance: 0.15 },
  { id: "ocr", label: "OCR parses / min", value: 847, unit: "", format: "int", variance: 40 },
  { id: "settle", label: "Settlements / hr", value: 2100000, unit: "", format: "int", variance: 120000 },
  { id: "ev", label: "EV fleet share", value: 4.7, unit: "%", format: "float", variance: 0.05 },
  { id: "score", label: "Avg. Gig Credit", value: 742, unit: "", format: "int", variance: 8 },
];

function jitter(base: LiveMetric): number {
  const delta = (Math.random() - 0.5) * 2 * base.variance;
  const next = base.value + delta;
  if (base.format === "int") return Math.round(next);
  return Math.round(next * 10) / 10;
}

export function useLiveMetrics(intervalMs = 2400) {
  const [metrics, setMetrics] = useState(BASE);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) => prev.map((m) => ({ ...m, value: jitter(m) })));
      setTick((t) => t + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { metrics, tick };
}

export function formatMetric(m: LiveMetric): string {
  if (m.format === "int") {
    if (m.value >= 1_000_000) return `${(m.value / 1_000_000).toFixed(1)}M`;
    if (m.value >= 1_000) return `${(m.value / 1_000).toFixed(1)}K`;
    return String(m.value);
  }
  return `${m.value}${m.unit}`;
}
