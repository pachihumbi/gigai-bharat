import { useEffect, useRef, useState } from "react";
import { useSafeMotion } from "@/hooks/use-safe-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const skipMotion = useSafeMotion();
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (skipMotion) {
      setDisplay(value);
      return;
    }

    const from = display;
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const current = from + (value - from) * eased;
      setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate from last rendered value
  }, [value, skipMotion, decimals]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : display.toLocaleString("en-IN");

  return (
    <span className={className} aria-live="polite">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
