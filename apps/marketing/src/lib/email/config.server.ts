import { businessEmails, type InquiryType } from "@/data/emails";

const inquiryInboxes: Record<InquiryType, string> = {
  contact: businessEmails.support,
  investor: businessEmails.investors,
  partnership: businessEmails.partnerships,
  careers: businessEmails.careers,
  press: businessEmails.press,
};

/** Hidden BCC for founder ops — set in Vercel, never exposed in client bundle paths. */
export function getAdminNotifyEmail(): string | undefined {
  return process.env.CONTACT_ADMIN_NOTIFY?.trim() || undefined;
}

export function getResendApiKey(): string {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return key;
}

export function getTurnstileSecret(): string | undefined {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || undefined;
}

export function isTurnstileRequired(): boolean {
  return Boolean(getTurnstileSecret());
}

export function getInboundEmail(type: InquiryType): string {
  return inquiryInboxes[type];
}

export function getFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "GigAI Bharat <no-reply@bharatgig.live>";
}

export function getSiteOrigin(): string {
  return (process.env.VITE_SITE_URL || "https://www.bharatgig.live").replace(/\/$/, "");
}
