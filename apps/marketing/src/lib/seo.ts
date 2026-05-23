import { absoluteUrl, ogImage, siteName } from "./site";

type RouteHead = {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
};

/** Per-route SEO — canonical, OG, and Twitter cards for LinkedIn/investor sharing. */
export function routeHead(
  path: string,
  title: string,
  description: string,
  ogTitle?: string,
): RouteHead {
  const resolvedTitle = title.includes(siteName) ? title : `${title} — ${siteName}`;
  const socialTitle = ogTitle ?? resolvedTitle;

  return {
    meta: [
      { title: resolvedTitle },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteName },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl(path) },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: `${siteName} — worker-owned mobility infrastructure` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
  };
}
