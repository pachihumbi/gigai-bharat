import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
        const turnstileConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());

        return Response.json(
          {
            ok: true,
            service: "gigai-bharat-marketing",
            domain: "bharatgig.live",
            timestamp: new Date().toISOString(),
            email: {
              resend: resendConfigured,
              turnstile: turnstileConfigured,
              from: process.env.EMAIL_FROM?.trim() || "GigAI Bharat <no-reply@bharatgig.live>",
            },
          },
          {
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      },
    },
  },
});
