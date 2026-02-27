"use client";

import dynamic from "next/dynamic";

const FounderLocationMap = dynamic(
  () => import("@/components/founder-location-map").then((m) => ({ default: m.FounderLocationMap })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted/50" aria-hidden />
    ),
  }
);

interface Props {
  city: string | null;
  label: string;
  className?: string;
}

export function FounderLocationMapClient({ city, label, className }: Props) {
  return (
    <FounderLocationMap
      city={city}
      label={label}
      {...(className ? { className } : {})}
    />
  );
}
