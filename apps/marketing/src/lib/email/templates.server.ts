import { inquiryLabels, type InquiryType } from "@/data/emails";
import type { InquiryPayload } from "./schemas";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `<tr><td style="padding:8px 0;color:#94a3b8;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;width:140px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;color:#f1f5f9;font-size:14px;line-height:1.5">${escapeHtml(value)}</td></tr>`;
}

function layout(title: string, body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#050608;color:#e2e8f0;font-family:Inter,Segoe UI,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050608;padding:32px 16px"><tr><td align="center">
<table width="100%" style="max-width:560px;background:linear-gradient(180deg,#0f1219 0%,#0a0c10 100%);border:1px solid rgba(0,217,255,0.25);border-radius:2px" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 32px 8px;border-bottom:1px solid rgba(255,255,255,0.06)">
<p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#00d9ff">GigAI Bharat</p>
<h1 style="margin:12px 0 0;font-family:Georgia,serif;font-size:26px;font-weight:400;font-style:italic;color:#fff">${escapeHtml(title)}</h1>
</td></tr>
<tr><td style="padding:24px 32px 32px">${body}</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b">
Worker-owned intelligence · bharatgig.live
</td></tr>
</table></td></tr></table></body></html>`;
}

function extraFields(payload: InquiryPayload): string {
  const rows: string[] = [];
  if (payload.type === "investor") {
    rows.push(row("Firm", payload.firm));
    rows.push(row("Stage", payload.stage));
    rows.push(row("Ticket", payload.ticketSize));
    rows.push(row("LinkedIn", payload.linkedin));
  }
  if (payload.type === "partnership") {
    rows.push(row("Organization", payload.organization));
    rows.push(row("Type", payload.partnershipType));
    rows.push(row("Fleet size", payload.fleetSize));
    rows.push(row("Cities", payload.cities));
  }
  if (payload.type === "careers") {
    rows.push(row("Role", payload.role));
    rows.push(row("LinkedIn", payload.linkedin));
    rows.push(row("Portfolio", payload.portfolio));
    rows.push(row("Resume", payload.resumeUrl));
  }
  if (payload.type === "press") {
    rows.push(row("Outlet", payload.outlet));
    rows.push(row("Deadline", payload.deadline));
    rows.push(row("Story angle", payload.storyAngle));
  }
  if (payload.type === "contact" && payload.subject) {
    rows.push(row("Subject", payload.subject));
  }
  if (payload.company) rows.push(row("Company", payload.company));
  if (payload.phone) rows.push(row("Phone", payload.phone));
  return rows.join("");
}

export function buildAdminEmail(payload: InquiryPayload) {
  const label = inquiryLabels[payload.type];
  const table = `<table width="100%" cellpadding="0" cellspacing="0">${row("Type", label)}${row("Name", payload.name)}${row("Email", payload.email)}${extraFields(payload)}</table>
<p style="margin:24px 0 8px;font-family:monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#64748b">Message</p>
<p style="margin:0;padding:16px;background:rgba(255,255,255,0.03);border-left:2px solid #00d9ff;color:#cbd5e1;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(payload.message)}</p>`;

  return {
    subject: `[${label}] ${payload.name}${payload.type === "investor" ? ` · ${(payload as { firm: string }).firm}` : ""}`,
    html: layout(`New ${label}`, table),
  };
}

const autoReplyCopy: Record<
  InquiryType,
  { headline: string; body: string; cta?: string }
> = {
  contact: {
    headline: "We received your message",
    body: "Thank you for reaching GigAI Bharat. Our team reviews every inquiry — expect a response within one business day.",
  },
  investor: {
    headline: "Investor inquiry received",
    body: "Thank you for your interest in India's worker-owned AI infrastructure layer. Our founder office will review your profile and follow up with deck access or a briefing slot.",
    cta: "Meanwhile, explore our live command center at app.bharatgig.live/demo",
  },
  partnership: {
    headline: "Partnership inquiry received",
    body: "We're building nation-scale mobility infrastructure — fleet, EV, and city partnerships are core to our thesis. Our partnerships desk will respond shortly.",
  },
  careers: {
    headline: "Application received",
    body: "Thank you for wanting to build the OS for India's working class. We read every profile personally — you'll hear from us if there's a strong fit.",
  },
  press: {
    headline: "Media inquiry received",
    body: "Thank you for covering GigAI Bharat. Our press desk will confirm assets, founder availability, and story angles within one business day.",
  },
};

export function buildAutoReply(payload: InquiryPayload) {
  const copy = autoReplyCopy[payload.type];
  const body = `<p style="margin:0 0 16px;color:#cbd5e1;font-size:15px;line-height:1.65">Hi ${escapeHtml(payload.name.split(" ")[0] || "there")},</p>
<p style="margin:0 0 16px;color:#94a3b8;font-size:15px;line-height:1.65">${copy.body}</p>
${copy.cta ? `<p style="margin:0 0 16px;color:#64748b;font-size:13px;line-height:1.6">${escapeHtml(copy.cta)}</p>` : ""}
<p style="margin:24px 0 0;color:#64748b;font-size:13px">— GigAI Bharat Command Center</p>`;

  return {
    subject: copy.headline,
    html: layout(copy.headline, body),
  };
}
