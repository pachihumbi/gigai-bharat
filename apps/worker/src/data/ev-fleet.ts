export const vinfastFleet = {
  name: "VinFast MPV7",
  referenceUrl: "https://vinfastauto.in/en/mpv7",
  rangeKm: 468,
  soc: 78,
  operatingCostPerKm: 1.2,
} as const;

export const fleetVehicleOptions = [
  { id: "VinFast_MPV7", label: "VinFast MPV7", sub: "Premium EV workforce shuttle", icon: "mpv" as const },
  { id: "VinFast_EV_Bike", label: "VinFast EV2 Bike", sub: "Last-mile delivery EV", icon: "bike" as const },
  { id: "VinFast_Shuttle", label: "VinFast EV Shuttle", sub: "Airport & corporate fleet", icon: "shuttle" as const },
  { id: "VinFast_Cargo", label: "VinFast EV Cargo", sub: "Logistics & Porter-class", icon: "cargo" as const },
] as const;

export const vinfastChargeHubs = [
  { name: "VinFast × GigAI — Whitefield", slots: 24, waitMin: 4, solar: true },
  { name: "Solar Carport — Koramangala", slots: 16, waitMin: 6, solar: true },
  { name: "Worker Housing Yard — E-City", slots: 32, waitMin: 3, solar: true },
];

export const securityStack = [
  { id: "verify", label: "AI verification", active: true },
  { id: "monitor", label: "Live monitoring", active: true },
  { id: "sos", label: "SOS layer", active: true },
  { id: "fatigue", label: "Fatigue AI", active: true },
  { id: "route", label: "Route risk", active: true },
  { id: "women", label: "Women safety", active: true },
] as const;

export const fleetHealth = {
  socAvg: 74,
  efficiency: 6.2,
  carbonSavedKg: 4200,
  maintenanceAlerts: 3,
  uptime: 99.2,
} as const;
