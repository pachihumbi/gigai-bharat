import { createFileRoute } from "@tanstack/react-router";

const WORKER_DRIVER_APP = "https://app.bharatgig.live/driver-app";

export const Route = createFileRoute("/driver-app")({
  loader: () => {
    throw Response.redirect(WORKER_DRIVER_APP, 307);
  },
  component: () => null,
});
