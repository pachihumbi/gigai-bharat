import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/roi")({
  beforeLoad: () => {
    throw redirect({ to: "/investors" });
  },
});
