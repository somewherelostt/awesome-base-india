"use client";

import { getCityCoordinates } from "@/lib/india-cities";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

interface FounderLocationMapProps {
  /** City name (e.g. "Bengaluru") */
  city?: string | null;
  /** Label for the marker popup */
  label?: string;
  className?: string;
}

export function FounderLocationMap({ city, label, className = "" }: FounderLocationMapProps) {
  const position = useMemo((): [number, number] | null => {
    if (!city) return null;
    const coords = getCityCoordinates(city);
    if (!coords) return null;
    return [coords[1], coords[0]]; // Leaflet wants [lat, lng]
  }, [city]);

  const zoom = position ? 6 : 5;
  const center = position ?? INDIA_CENTER;

  return (
    <div className={`overflow-hidden rounded-xl [&_.leaflet-container]:rounded-xl ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full min-h-[280px]"
        scrollWheelZoom={true}
        style={{ background: "var(--color-muted) / 0.3" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position}>
            {label && (
              <Popup>
                <span className="font-medium">{label}</span>
                {city && (
                  <span className="block text-muted-foreground text-sm">{city}, India</span>
                )}
              </Popup>
            )}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
