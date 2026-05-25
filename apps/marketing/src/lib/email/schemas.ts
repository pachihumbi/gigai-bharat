import { z } from "zod";

const baseFields = {
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Valid email required").max(254),
  message: z.string().trim().min(10, "Tell us a bit more").max(5000),
  company: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(30).optional(),
  /** Honeypot — must stay empty */
  _website: z.literal("").optional(),
  /** Client timestamp (ms) when form mounted */
  _ts: z.number().int().positive(),
  /** Cloudflare Turnstile token (optional when not configured) */
  turnstileToken: z.string().optional(),
};

export const contactSchema = z.object({
  type: z.literal("contact"),
  subject: z.string().trim().min(3).max(200).optional(),
  ...baseFields,
});

export const investorSchema = z.object({
  type: z.literal("investor"),
  firm: z.string().trim().min(2, "Firm or fund name required").max(200),
  stage: z.enum(["pre-seed", "seed", "series-a", "growth", "strategic", "other"]),
  ticketSize: z.string().trim().max(120).optional(),
  linkedin: z.string().trim().url("Valid LinkedIn URL").max(500).optional().or(z.literal("")),
  ...baseFields,
});

export const partnershipSchema = z.object({
  type: z.literal("partnership"),
  organization: z.string().trim().min(2, "Organization required").max(200),
  partnershipType: z.enum(["fleet", "ev-charging", "city", "technology", "distribution", "other"]),
  fleetSize: z.string().trim().max(80).optional(),
  cities: z.string().trim().max(300).optional(),
  ...baseFields,
});

export const careersSchema = z.object({
  type: z.literal("careers"),
  role: z.string().trim().min(2, "Role or area of interest required").max(200),
  linkedin: z.string().trim().url("Valid LinkedIn URL").max(500),
  portfolio: z.string().trim().url("Valid portfolio URL").max(500).optional().or(z.literal("")),
  resumeUrl: z.string().trim().url("Valid resume link").max(500).optional().or(z.literal("")),
  ...baseFields,
});

export const pressSchema = z.object({
  type: z.literal("press"),
  outlet: z.string().trim().min(2, "Outlet or publication required").max(200),
  deadline: z.string().trim().max(120).optional(),
  storyAngle: z.string().trim().min(5).max(300),
  ...baseFields,
});

export const inquirySchema = z.discriminatedUnion("type", [
  contactSchema,
  investorSchema,
  partnershipSchema,
  careersSchema,
  pressSchema,
]);

export type InquiryPayload = z.infer<typeof inquirySchema>;
