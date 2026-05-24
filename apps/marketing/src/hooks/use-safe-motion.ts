import { useEffect, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Returns true when motion should be skipped — SSR, pre-hydration, reduced-motion,
 * or production (opacity-0 animations disabled for mobile Chrome stability).
 */
export function useSafeMotion(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return reduced || !mounted || import.meta.env.PROD;
}
