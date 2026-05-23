import { useEffect, useState } from "react";

export type DispatchEvent = {
  id: string;
  from: string;
  to: string;
  platform: string;
  eta: string;
  status: "routing" | "matched" | "complete";
};

const CITIES = ["Mumbai", "Bengaluru", "Delhi", "Hyderabad", "Pune", "Chennai"];
const PLATFORMS = ["Swiggy", "Uber", "Rapido", "Zomato", "Direct"];

/** Deterministic seed — identical on server and client to prevent hydration mismatch. */
const SEED_EVENTS: DispatchEvent[] = [
  { id: "d-seed-1", from: "Mumbai", to: "Pune", platform: "Swiggy", eta: "1.8s", status: "matched" },
  { id: "d-seed-2", from: "Bengaluru", to: "Chennai", platform: "Uber", eta: "2.1s", status: "routing" },
  { id: "d-seed-3", from: "Delhi", to: "Hyderabad", platform: "Rapido", eta: "1.6s", status: "complete" },
  { id: "d-seed-4", from: "Pune", to: "Mumbai", platform: "Zomato", eta: "2.4s", status: "matched" },
];

let seq = SEED_EVENTS.length;

function randomEvent(): DispatchEvent {
  const from = CITIES[Math.floor(Math.random() * CITIES.length)];
  let to = CITIES[Math.floor(Math.random() * CITIES.length)];
  while (to === from) to = CITIES[Math.floor(Math.random() * CITIES.length)];
  const statuses: DispatchEvent["status"][] = ["routing", "matched", "complete"];
  return {
    id: `d-${++seq}`,
    from,
    to,
    platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
    eta: `${(1.2 + Math.random() * 2.5).toFixed(1)}s`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}

export function useDispatchSimulation(maxEvents = 6, intervalMs = 2800) {
  const [events, setEvents] = useState<DispatchEvent[]>(SEED_EVENTS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
    setEvents((prev) => [randomEvent(), ...prev].slice(0, maxEvents));
  }, [maxEvents]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setEvents((prev) => [randomEvent(), ...prev].slice(0, maxEvents));
    }, intervalMs);
    return () => clearInterval(id);
  }, [live, maxEvents, intervalMs]);

  return events;
}
