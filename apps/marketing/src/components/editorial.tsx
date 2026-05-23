import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { ChapterPath } from "@/data/chapters";

export function PageHero({
  kicker,
  title,
  standfirst,
  chapter,
}: {
  kicker: string;
  title: ReactNode;
  standfirst: ReactNode;
  chapter: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-backdrop opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--neon)] to-transparent opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-24 pb-28 md:grid-cols-12 md:px-12">
        <div className="md:col-span-8">
          <div className="inline-flex items-center gap-2 border border-[color:var(--neon)]/40 bg-[color:var(--neon)]/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[color:var(--neon)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--neon)]">{kicker}</span>
          </div>
          <h1 className="mt-8 font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl">
            {standfirst}
          </p>
        </div>
        <aside className="md:col-span-4 md:border-l md:border-border md:pl-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Chapter
          </p>
          <p className="mt-2 font-serif text-7xl leading-none text-[color:var(--neon)]">
            {chapter}
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            GigAI Bharat // v0.1
          </p>
        </aside>
      </div>
    </section>
  );
}

export function Section({
  label,
  title,
  children,
}: {
  label?: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      {label && (
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--neon)]">
          {label}
        </p>
      )}
      {title && <h2 className="mb-12 font-serif text-4xl md:text-5xl">{title}</h2>}
      {children}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-6 text-base leading-relaxed text-foreground/80 md:text-lg">
      {children}
    </div>
  );
}

export function PullQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  return (
    <figure className="my-16 border-l-2 border-[color:var(--neon)] pl-8">
      <blockquote className="font-serif text-3xl italic leading-tight md:text-4xl">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}

export function StatRow({ stats }: { stats: Array<{ value: string; label: string; sub?: string }> }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
      {stats.map((s, i) => (
        <div key={i} className="px-6 py-10 md:px-10">
          <p className="font-serif text-5xl leading-none text-[color:var(--neon)] md:text-6xl">
            {s.value}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {s.label}
          </p>
          {s.sub && (
            <p className="mt-2 text-sm text-foreground/60">{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}

type Col = { key: string; label: string; align?: "left" | "right" };
type Row = Record<string, ReactNode>;

export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption?: string;
  columns: Col[];
  rows: Row[];
}) {
  return (
    <div className="overflow-x-auto">
      {caption && (
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {caption}
        </p>
      )}
      <table className="w-full text-left">
        <thead>
          <tr className="border-y border-foreground/40">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`py-4 pr-6 font-mono text-[10px] uppercase tracking-[0.2em] font-medium ${c.align === "right" ? "text-right" : ""}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i} className="transition-colors hover:bg-card/50">
              {columns.map((c, j) => (
                <td
                  key={c.key}
                  className={`py-5 pr-6 align-top text-sm md:text-base ${c.align === "right" ? "text-right" : ""} ${j === 0 ? "font-medium" : "text-foreground/75"}`}
                >
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChapterFooter({
  prev,
  next,
}: {
  prev?: { to: ChapterPath | "/"; label: string };
  next?: { to: ChapterPath | "/"; label: string };
}) {
  return (
    <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-6 border-t border-border px-6 py-12 md:flex-row md:px-12">
      {prev ? (
        <Link to={prev.to} className="group">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            ← Previous chapter
          </p>
          <p className="mt-2 font-serif text-2xl italic transition-colors group-hover:text-[color:var(--neon)]">
            {prev.label}
          </p>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={next.to} className="group md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Next chapter →
          </p>
          <p className="mt-2 font-serif text-2xl italic transition-colors group-hover:text-[color:var(--neon)]">
            {next.label}
          </p>
        </Link>
      ) : <span />}
    </div>
  );
}
