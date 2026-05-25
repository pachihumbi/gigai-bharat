import { create } from "zustand";

type MapFilters = {
  showWorkers: boolean;
  showEv: boolean;
  showHeatmap: boolean;
  showJobs: boolean;
  set: (partial: Partial<Omit<MapFilters, "set">>) => void;
};

export const useMapFilters = create<MapFilters>((set) => ({
  showWorkers: true,
  showEv: true,
  showHeatmap: true,
  showJobs: true,
  set: (partial) => set(partial),
}));
