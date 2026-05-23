import { createFileRoute } from "@tanstack/react-router";
import { SmartHubBlueprint } from "@/components/flagship/smart-hub-blueprint";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/smart-hub")({
  head: () =>
    routeHead(
      "/smart-hub",
      "Smart Hub Blueprint — GigAI Bharat Worker Infrastructure",
      "Futuristic worker civilization infrastructure: EV charging, AI dispatch hubs, housing, solar, health clinics, fintech kiosks, and autonomous fleet centers.",
      "GigAI Bharat — Smart Hub Blueprint",
    ),
  component: SmartHubBlueprint,
});
