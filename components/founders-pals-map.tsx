"use client";

import { getCityCoordinates } from "@/lib/india-cities";
import type { FounderForPals } from "@/lib/founder";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix default marker icon in Next.js (bundler breaks default paths)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const INDIA_CENTER: [number, number] = [20.5937, 78.9629]; // [lat, lng]

interface FoundersPalsMapProps {
  founders: FounderForPals[];
  selectedUsername: string | null;
  onSelect: (username: string) => void;
  className?: string;
}

/** Leaflet map of India with one marker per founder (by city, jitter for same city). */
export function FoundersPalsMap({
  founders,
  selectedUsername,
  onSelect,
  className = "",
}: FoundersPalsMapProps) {
  const points = useMemo(() => {
    const byCity = new Map<string, FounderForPals[]>();
    for (const f of founders) {
      const city = f.city?.trim() || "India";
      if (!byCity.has(city)) byCity.set(city, []);
      byCity.get(city)!.push(f);
    }
    const out: { username: string; name: string; position: [number, number] }[] = [];
    byCity.forEach((list, city) => {
      const coords = getCityCoordinates(city === "India" ? null : city);
      const baseLat = coords ? coords[1] : 20.59;
      const baseLng = coords ? coords[0] : 78.96;
      list.forEach((f, i) => {
        const jitterLat = list.length > 1 ? (i - (list.length - 1) / 2) * 0.02 : 0;
        const jitterLng = list.length > 1 ? (i % 2) * 0.015 : 0;
        out.push({
          username: f.username,
          name: f.name,
          position: [baseLat + jitterLat, baseLng + jitterLng],
        });
      });
    });
    return out;
  }, [founders]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl [&_.leaflet-container]:rounded-2xl [&_.leaflet-container]:z-0 ${className}`}
    >
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        className="h-full w-full min-h-[300px]"
        scrollWheelZoom={true}
        style={{ background: "var(--color-muted) / 0.3" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <Marker
            key={p.username}
            position={p.position}
            eventHandlers={{
              click: () => onSelect(p.username),
            }}
          >
            <Popup>
              <div className="min-w-[140px]">
                <p className="font-medium text-foreground">{p.name}</p>
                <Link
                  href={`/founders/${p.username}`}
                  className="mt-1 inline-block text-sm text-accent hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View profile →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {selectedUsername && (
        <div className="absolute bottom-2 left-2 right-2 z-[1000] rounded-lg bg-background/95 px-2 py-1.5 text-center text-xs font-medium text-foreground shadow-sm">
          {founders.find((f) => f.username === selectedUsername)?.name}
          <Link
            href={`/founders/${selectedUsername}`}
            className="ml-2 text-accent hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View profile →
          </Link>
        </div>
      )}
    </div>
  );
}
