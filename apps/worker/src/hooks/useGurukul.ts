import { useMemo, useState, useCallback } from "react";
import {
  learningTracks,
  skillGraph,
  computeTotalXp,
  type LearningTrack,
} from "@/data/gurukul";

const STORAGE_KEY = "gigai-gurukul-progress";

function loadProgress(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function useGurukul() {
  const [progressMap, setProgressMap] = useState(loadProgress);

  const tracks = useMemo(() => {
    return learningTracks.map((t) => ({
      ...t,
      progress: progressMap[t.id] ?? t.progress,
    }));
  }, [progressMap]);

  const totalXp = useMemo(() => computeTotalXp(tracks), [tracks]);
  const level = Math.floor(totalXp / 200) + 1;

  const completeLesson = useCallback((trackId: string) => {
    setProgressMap((prev) => {
      const current = prev[trackId] ?? learningTracks.find((t) => t.id === trackId)?.progress ?? 0;
      const next = Math.min(100, current + 15);
      const updated = { ...prev, [trackId]: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    tracks,
    skillGraph,
    totalXp,
    level,
    completeLesson,
  };
}
