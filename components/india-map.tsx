"use client";

import { INDIA_OUTLINE_PATH } from "@/lib/india-outline-path";
import { getCityCoordinates, lngLatToSvg } from "@/lib/india-cities";

interface IndiaMapProps {
  /** City name to show a marker (e.g. "Dehradun") */
  city?: string | null;
  /** Optional label next to marker */
  label?: string;
  className?: string;
}

export function IndiaMap({ city, label, className = "" }: IndiaMapProps) {
  const coords = city ? getCityCoordinates(city) : null;
  const [x, y] = coords ? lngLatToSvg(coords[0], coords[1]) : [50, 50];

  return (
    <div className={`relative overflow-hidden rounded-xl bg-muted/30 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Map of India"
      >
        <path
          d={INDIA_OUTLINE_PATH}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.2"
          className="fill-muted-foreground/25 stroke-muted-foreground/50"
        />
        {coords && (
          <g>
            <circle
              cx={x}
              cy={y}
              r="3"
              fill="var(--color-accent, #0052FF)"
              stroke="white"
              strokeWidth="1.5"
            />
            {label && (
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                className="fill-foreground text-[4px] font-medium"
              >
                {label}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
