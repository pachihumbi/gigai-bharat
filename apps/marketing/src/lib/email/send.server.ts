import {
  getAdminNotifyEmail,
  getFromAddress,
  getInboundEmail,
  getResendApiKey,
} from "./config.server";
import { buildAdminEmail, buildAutoReply } from "./templates.server";
import type { InquiryPayload } from "./schemas";

type SendResult = { ok: true; id?: string } | { ok: false; error: string };

async function resendSend(body: Record<string, unknown>): Promise<SendResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", res.status, err);
    return { ok: false, error: "Email delivery failed" };
  }

  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id };
}

export async function sendInquiryEmails(payload: InquiryPayload): Promise<SendResult> {
  const inbound = getInboundEmail(payload.type);
  const admin = buildAdminEmail(payload);
  const auto = buildAutoReply(payload);
  const from = getFromAddress();
  const bcc = getAdminNotifyEmail();

  const adminResult = await resendSend({
    from,
    to: [inbound],
    ...(bcc ? { bcc: [bcc] } : {}),
    reply_to: payload.email,
    subject: admin.subject,
    html: admin.html,
  });

  if (!adminResult.ok) return adminResult;

  const autoResult = await resendSend({
    from,
    to: [payload.email],
    subject: auto.subject,
    html: auto.html,
  });

  if (!autoResult.ok) {
    console.error("Auto-reply failed but admin email sent");
  }

  return adminResult;
}

/** Dev / missing API key — log only */
export async function sendInquiryEmailsSafe(payload: InquiryPayload): Promise<SendResult> {
  if (!process.env.RESEND_API_KEY?.trim()) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Email service not configured" };
    }
    console.info("[dev] Inquiry received:", payload.type, payload.email);
    return { ok: true, id: "dev-mode" };
  }
  return sendInquiryEmails(payload);
}
