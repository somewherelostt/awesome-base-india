"use client";

import type { FounderForPals } from "@/lib/founder";
import dynamic from "next/dynamic";

const FoundersPalsMap = dynamic(
  () => import("@/components/founders-pals-map").then((m) => ({ default: m.FoundersPalsMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[300px] w-full animate-pulse rounded-2xl bg-muted/50" aria-hidden />
    ),
  }
);

interface Props {
  founders: FounderForPals[];
  selectedUsername: string | null;
  onSelect: (username: string) => void;
  className?: string;
}

export function FoundersPalsMapClient({ founders, selectedUsername, onSelect, className }: Props) {
  return (
    <FoundersPalsMap
      founders={founders}
      selectedUsername={selectedUsername}
      onSelect={onSelect}
      {...(className ? { className } : {})}
    />
  );
}
