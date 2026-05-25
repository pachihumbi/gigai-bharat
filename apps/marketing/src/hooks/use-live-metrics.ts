export type LiveMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  format: "int" | "float" | "ms";
};

/** Platform targets — static figures, not simulated live telemetry. */
const PLATFORM_METRICS: LiveMetric[] = [
  { id: "workers", label: "Gig workers in India", value: 23500000, unit: "", format: "int" },
  { id: "commission", label: "Platform commission", value: 0, unit: "₹", format: "int" },
  { id: "settlement", label: "Target settlement", value: 0, unit: " days", format: "int" },
  { id: "ocr", label: "OCR parse target", value: 3, unit: "s", format: "float" },
  { id: "credit", label: "Starting Gig Credit", value: 300, unit: "", format: "int" },
  { id: "languages", label: "Supported languages", value: 12, unit: "", format: "int" },
];

export function useLiveMetrics() {
  return { metrics: PLATFORM_METRICS, tick: 0 };
}

export function formatMetric(m: LiveMetric): string {
  if (m.id === "commission") return "₹0";
  if (m.id === "settlement") return "T+0";
  if (m.format === "int") {
    if (m.value >= 1_000_000) return `${(m.value / 1_000_000).toFixed(1)}M+`;
    if (m.value >= 1_000) return `${(m.value / 1_000).toFixed(1)}K`;
    return String(m.value);
  }
  return `${m.value}${m.unit}`;
}
