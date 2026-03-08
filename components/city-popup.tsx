"use client";

import type { FounderForPals } from "@/lib/founder";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface CityPopupProps {
  cityName: string;
  founders: FounderForPals[];
  onClose: () => void;
  onSelectFounder: (username: string) => void;
}

export function CityPopup({ cityName, founders, onClose, onSelectFounder }: CityPopupProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{cityName}</h2>
            <p className="text-sm text-muted-foreground">
              {founders.length} builder{founders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {founders.map((f) => (
              <button
                key={f.username}
                type="button"
                onClick={() => {
                  onSelectFounder(f.username);
                  onClose();
                }}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-accent hover:bg-muted/50"
              >
                {f.profile_image ? (
                  <Image
                    src={f.profile_image}
                    alt={f.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                    {f.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{f.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {f.project}
                  </p>
                  <Link
                    href={`/founders/${f.username}`}
                    className="mt-1 inline-block text-xs text-accent hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View profile →
                  </Link>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
