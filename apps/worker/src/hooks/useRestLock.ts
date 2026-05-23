import { useEffect, useState } from "react";

const THRESHOLD = 11.5;

export function useRestLock(driveHours: number) {
  const [locked, setLocked] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (driveHours >= THRESHOLD && !locked && !acknowledged) {
      setLocked(true);
    }
  }, [driveHours, locked, acknowledged]);

  const complete = () => {
    setLocked(false);
    setAcknowledged(true);
  };

  return { locked, complete, threshold: THRESHOLD };
}
