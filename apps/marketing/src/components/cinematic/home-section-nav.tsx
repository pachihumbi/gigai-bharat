import { homeNavAnchors, websitePages } from "@/data/cinematic";

export function HomeSectionNav() {
  return (
    <nav
      aria-label="Homepage sections"
      className="sticky top-[calc(var(--header-offset,0px)+1px)] z-40 border-b border-white/5 bg-black/80 backdrop-blur-md md:top-[73px]"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-2 md:px-12">
        {homeNavAnchors.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded border border-transparent px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-[color:var(--neon)]/30 hover:text-[color:var(--neon)]"
          >
            {item.label}
          </a>
        ))}
        {websitePages.map((page) => (
          <a
            key={page.href}
            href={page.href}
            className="shrink-0 rounded border border-[color:var(--neon)]/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--neon)] transition-colors hover:border-[color:var(--neon)]/40 hover:bg-[color:var(--neon)]/5"
          >
            {page.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
