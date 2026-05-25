import { createFileRoute } from "@tanstack/react-router";
import { inquirySchema } from "@/lib/email/schemas";
import { checkRateLimit, getClientIp } from "@/lib/email/rate-limit.server";
import { runSecurityChecks } from "@/lib/email/security.server";
import { sendInquiryEmailsSafe } from "@/lib/email/send.server";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getClientIp(request);
        const rate = checkRateLimit(`contact:${ip}`);
        if (!rate.allowed) {
          return Response.json(
            { error: "Too many requests. Please try again later." },
            {
              status: 429,
              headers: rate.retryAfterSec
                ? { "Retry-After": String(rate.retryAfterSec) }
                : undefined,
            },
          );
        }

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = inquirySchema.safeParse(json);
        if (!parsed.success) {
          const first = parsed.error.errors[0];
          return Response.json(
            { error: first?.message ?? "Validation failed", field: first?.path.join(".") },
            { status: 400 },
          );
        }

        const security = await runSecurityChecks(request, parsed.data, ip);
        if (!security.ok) {
          return Response.json({ error: security.message }, { status: security.status });
        }

        const result = await sendInquiryEmailsSafe(parsed.data);
        if (!result.ok) {
          return Response.json({ error: result.error }, { status: 503 });
        }

        return Response.json({ ok: true, id: result.id });
      },
    },
  },
});
