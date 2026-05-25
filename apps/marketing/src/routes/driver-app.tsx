import { createFileRoute, redirect } from "@tanstack/react-router";

/** Edge redirect fallback when vercel.json rules are not active on the domain project. */
export const Route = createFileRoute("/driver-app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      window.location.replace("https://app.bharatgig.live/driver-app");
      return;
    }
    throw redirect({
      href: "https://app.bharatgig.live/driver-app",
      replace: true,
    });
  },
});
