import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { ProductionAnalytics } from "@/components/analytics/production-analytics";
import { MobileStickyCTA, SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  absoluteUrl,
  contactEmail,
  ogImage,
  siteDescription,
  siteKeywords,
  siteName,
  siteTagline,
  siteUrl,
} from "@/lib/site";

import appCss from "../styles.css?url";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: absoluteUrl("/favicon.svg"),
  description: siteDescription,
  sameAs: ["https://github.com/pachihumbi/gigai-bharat", siteUrl],
  contactPoint: {
    "@type": "ContactPoint",
    email: contactEmail,
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Kannada"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: "en-IN",
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5">
      <div className="max-w-md text-center">
        <p className="font-mono text-label uppercase tracking-[0.22em] text-[color:var(--neon)]">
          404 / Off-grid
        </p>
        <h1 className="mt-6 font-serif text-5xl italic md:text-6xl">Route not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">That node isn't on the network.</p>
        <Link
          to="/"
          className="mt-8 inline-block border-b border-[color:var(--neon)] pb-1 font-mono text-label uppercase tracking-[0.2em] text-[color:var(--neon)]"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5">
      <div className="max-w-md text-center">
        <p className="font-mono text-label uppercase tracking-[0.22em] text-[color:var(--saffron)]">
          Runtime fault
        </p>
        <h1 className="mt-6 font-serif text-4xl italic">This view didn't load</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-8 flex justify-center gap-6 font-mono text-label uppercase tracking-[0.2em]">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border-b border-[color:var(--neon)] pb-1 text-[color:var(--neon)]"
          >
            Try again
          </button>
          <Link to="/" className="border-b border-foreground/30 pb-1">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a0c10" },
      { name: "color-scheme", content: "dark" },
      { title: `${siteName} — ${siteTagline}` },
      { name: "description", content: siteDescription },
      { name: "keywords", content: siteKeywords },
      { name: "author", content: siteName },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteName },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: `${siteName} — ${siteTagline}` },
      {
        property: "og:description",
        content:
          "The operating system for India's working class. Direct gigs. Transparent earnings. Powered by AI.",
      },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: `${siteName} — worker-owned mobility infrastructure` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${siteName} — ${siteTagline}` },
      {
        name: "twitter:description",
        content: "Worker-owned AI infrastructure for India's 23.5M gig workers.",
      },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "stylesheet", href: appCss },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "text/javascript",
        src: "/sw-cleanup.js",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          <SiteHeader />
          <main className="page-enter">
            <Outlet />
          </main>
          <SiteFooter />
          <MobileStickyCTA />
          <ProductionAnalytics />
          <Toaster position="top-center" richColors closeButton theme="dark" />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
