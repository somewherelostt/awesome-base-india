"use client";

import { INDIA_OUTLINE_PATH } from "@/lib/india-outline-path";
import { getCityCoordinates, lngLatToSvg } from "@/lib/india-cities";
import type { FounderForPals } from "@/lib/founder";
import Link from "next/link";
import { useMemo, useState } from "react";

const DOT_COLORS: string[] = ["#0052FF", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4", "#14B8A6"];

interface IndiaMapPalsProps {
  founders: FounderForPals[];
  selectedUsername: string | null;
  onSelect: (username: string) => void;
  className?: string;
}

/** One dot per founder (by city); same city gets slight jitter. Hover = tooltip with name. */
export function IndiaMapPals({ founders, selectedUsername, onSelect, className = "" }: IndiaMapPalsProps) {
  const [hoveredUsername, setHoveredUsername] = useState<string | null>(null);

  const points = useMemo(() => {
    const byCity = new Map<string, FounderForPals[]>();
    for (const f of founders) {
      const city = f.city?.trim() || "India";
      if (!byCity.has(city)) byCity.set(city, []);
      byCity.get(city)!.push(f);
    }
    const out: { username: string; name: string; x: number; y: number; color: string; index: number }[] = [];
    let colorIndex = 0;
    byCity.forEach((list, city) => {
      const coords = getCityCoordinates(city === "India" ? null : city);
      const [baseX, baseY] = coords ? lngLatToSvg(coords[0], coords[1]) : [50, 50];
      list.forEach((f, i) => {
        const jitter = list.length > 1 ? (i - (list.length - 1) / 2) * 2 : 0;
        out.push({
          username: f.username,
          name: f.name,
          x: baseX + jitter * 0.8,
          y: baseY + (i % 2) * 1.5,
          color: DOT_COLORS[colorIndex % DOT_COLORS.length]!,
          index: out.length,
        });
      });
      colorIndex++;
    });
    return out;
  }, [founders]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-muted/20 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full cursor-pointer"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Founders on the map – India"
      >
        <path
          d={INDIA_OUTLINE_PATH}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.15"
          className="fill-muted-foreground/25 stroke-muted-foreground/50"
        />
        {points.map((p) => {
          const isSelected = selectedUsername === p.username;
          const isHovered = hoveredUsername === p.username;
          return (
            <g
              key={p.username}
              onMouseEnter={() => setHoveredUsername(p.username)}
              onMouseLeave={() => setHoveredUsername(null)}
              onClick={() => onSelect(p.username)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isSelected || isHovered ? 4 : 2.5}
                fill={p.color}
                stroke="white"
                strokeWidth={isSelected || isHovered ? 1.5 : 0.8}
                className="transition-all duration-150"
              />
              {(isHovered || isSelected) && (
                <text
                  x={p.x}
                  y={p.y - 5}
                  textAnchor="middle"
                  className="pointer-events-none fill-foreground text-[5px] font-semibold"
                >
                  {p.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {(hoveredUsername || selectedUsername) && (
        <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-background/95 px-2 py-1.5 text-center text-xs font-medium text-foreground shadow-sm">
          {hoveredUsername
            ? founders.find((f) => f.username === hoveredUsername)?.name
            : selectedUsername
              ? founders.find((f) => f.username === selectedUsername)?.name
              : ""}
          {selectedUsername && (
            <Link
              href={`/founders/${selectedUsername}`}
              className="ml-2 text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View profile →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
