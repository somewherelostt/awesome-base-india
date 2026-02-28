"use client";

import { FoundersPalsMapClient } from "@/components/founders-pals-map-client";
import type { FounderForPals } from "@/lib/founder";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface FoundersPalsViewProps {
  founders: FounderForPals[];
}

function matchScore(a: FounderForPals, b: FounderForPals): number {
  if (a.username === b.username) return 0;
  let score = 0;
  if (a.city && b.city && a.city.toLowerCase() === b.city.toLowerCase()) score += 40;
  const aTags = new Set((a.tags || []).map((t) => String(t).toLowerCase()));
  const bTags = new Set((b.tags || []).map((t) => String(t).toLowerCase()));
  for (const t of aTags) {
    if (bTags.has(t)) score += 15;
  }
  return Math.min(99, score);
}

export function FoundersPalsView({ founders }: FoundersPalsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return founders;
    return founders.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q) ||
        (f.project && f.project.toLowerCase().includes(q)) ||
        (f.city && f.city.toLowerCase().includes(q)) ||
        (f.tags || []).some((t) => String(t).toLowerCase().includes(q))
    );
  }, [founders, search]);

  const selected = selectedUsername ? founders.find((f) => f.username === selectedUsername) : null;
  const similar = useMemo(() => {
    if (!selected) return [];
    return founders
      .filter((f) => f.username !== selected.username)
      .map((f) => ({ f, score: matchScore(selected, f) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ f, score }) => ({ ...f, score }));
  }, [founders, selected]);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[400px_1fr] lg:gap-8 lg:px-8">
      {/* Left: search + founder list (clear priority) */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/50">
        <div className="shrink-0 border-b border-border p-4">
          <label htmlFor="founders-search" className="sr-only">
            Search founders by name, project, city or tags
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="founders-search"
              type="text"
              autoComplete="off"
              placeholder="Search founders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selected ? (
            <>
              {/* Selected profile card */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedUsername(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← See all
                </button>
              </div>
              <div className="mb-6 rounded-xl border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  {selected.profile_image ? (
                    <img
                      src={selected.profile_image}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">
                      {selected.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-foreground">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selected.city ? `${selected.city}, ` : ""}India
                    </p>
                    {selected.short_bio && (
                      <p className="mt-2 line-clamp-2 text-sm text-foreground/90">
                        {selected.short_bio}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">Building {selected.project}</p>
                    <Link
                      href={`/founders/${selected.username}`}
                      className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                    >
                      Full profile →
                    </Link>
                  </div>
                </div>
                {(selected.tags?.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.tags!.slice(0, 6).map((t) => {
                      const tag = typeof t === "string" ? t : String(t ?? "");
                      return (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground"
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {similar.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Similar profiles</h3>
                  <ul className="space-y-2">
                    {similar.map((f) => (
                      <li key={f.username}>
                        <Link
                          href={`/founders/${f.username}`}
                          className="block rounded-lg border border-border/60 bg-background p-3 transition-colors hover:bg-muted/50"
                          onClick={() => setSelectedUsername(f.username)}
                        >
                          <p className="font-medium text-foreground">{f.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {f.city ? `${f.city} · ` : ""}{f.project}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{f.score}% match</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                {filtered.length} founder{filtered.length !== 1 ? "s" : ""} · Click a dot on the map or a card below
              </p>
              <ul className="space-y-2">
                {filtered.slice(0, 20).map((f) => (
                  <li key={f.username}>
                    <button
                      type="button"
                      onClick={() => setSelectedUsername(f.username)}
                      className="w-full rounded-lg border border-border/60 bg-background p-3 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <div className="flex items-center gap-3">
                        {f.profile_image ? (
                          <img
                            src={f.profile_image}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                            {f.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground">{f.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {f.city ? `${f.city} · ` : ""}{f.project}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {filtered.length > 20 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Use search to narrow down. Showing first 20.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right: map card (fixed height so layout stays balanced) */}
      <div className="flex flex-col rounded-2xl border border-border bg-card/50 overflow-hidden">
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">Map</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            India
          </span>
        </div>
        <div className="relative h-[320px] w-full shrink-0 sm:h-[380px] lg:h-[400px]">
          <FoundersPalsMapClient
            founders={filtered}
            selectedUsername={selectedUsername}
            onSelect={setSelectedUsername}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
