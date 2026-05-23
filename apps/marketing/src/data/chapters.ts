export type ChapterPath =
  | "/manifesto"
  | "/workers"
  | "/cities"
  | "/infrastructure"
  | "/future";

export type Chapter = {
  num: string;
  slug: string;
  path: ChapterPath;
  title: string;
  kicker: string;
  blurb: string;
};

export const chapters: Chapter[] = [
  {
    num: "01",
    slug: "manifesto",
    path: "/manifesto",
    title: "The Manifesto",
    kicker: "Dignity, intelligence, infrastructure",
    blurb:
      "Why the people who move India deserve an operating system of their own — and why AI must be built as public infrastructure, not extractive surveillance.",
  },
  {
    num: "02",
    slug: "workers",
    path: "/workers",
    title: "The Worker Layer",
    kicker: "12 million drivers, one nervous system",
    blurb:
      "Earnings transparency, route intelligence, EV transition, and the architecture of worker-owned data.",
  },
  {
    num: "03",
    slug: "cities",
    path: "/cities",
    title: "The City Layer",
    kicker: "Tier-1 to Tier-3, demand at scale",
    blurb:
      "Live mobility heatmaps for Mumbai, Bengaluru, Lucknow, Surat. Demand prediction as municipal infrastructure.",
  },
  {
    num: "04",
    slug: "infrastructure",
    path: "/infrastructure",
    title: "The AI Command Center",
    kicker: "Dispatch, prediction, settlement",
    blurb:
      "The model graph powering GigAI: real-time dispatch, EV state-of-charge optimization, fraud detection, and instant settlement.",
  },
  {
    num: "05",
    slug: "future",
    path: "/future",
    title: "Future India",
    kicker: "Autonomy, sovereignty, scale",
    blurb:
      "From assisted dispatch to autonomous fleets. Bharat's path to a worker-owned, AI-coordinated mobility commons.",
  },
];
