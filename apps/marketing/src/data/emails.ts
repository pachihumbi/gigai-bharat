/** Public-facing business inboxes — only expose what each surface needs. */
export const businessEmails = {
  hello: "hello@bharatgig.live",
  support: "support@bharatgig.live",
  investors: "investors@bharatgig.live",
  founder: "founder@bharatgig.live",
  careers: "careers@bharatgig.live",
  legal: "legal@bharatgig.live",
  partnerships: "partnerships@bharatgig.live",
  press: "press@bharatgig.live",
} as const;

/** Transactional sender — never shown as a reply-to address on forms. */
export const transactionalFrom = "GigAI Bharat <no-reply@bharatgig.live>";

export type InquiryType = "contact" | "investor" | "partnership" | "careers" | "press";

export const inquiryLabels: Record<InquiryType, string> = {
  contact: "General inquiry",
  investor: "Investor inquiry",
  partnership: "Partnership inquiry",
  careers: "Careers application",
  press: "Press & media",
};

/** Which public email to display per page/section (not all addresses). */
export const publicEmailSurfaces = {
  footer: [businessEmails.hello, businessEmails.support] as const,
  investors: [businessEmails.investors, businessEmails.founder] as const,
  partnership: [businessEmails.partnerships] as const,
  careers: [businessEmails.careers] as const,
  legal: [businessEmails.legal] as const,
  press: [businessEmails.press] as const,
} as const;
