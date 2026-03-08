"use client";

import { getCityCoordinates, getDistance, getClusterRadiusByZoom } from "@/lib/india-cities";
import type { FounderForPals } from "@/lib/founder";
import { createCityMarkerIcon, CITY_MARKER_STYLES } from "@/components/city-marker";
import { CityPopup } from "@/components/city-popup";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";

interface CityCluster {
  id: string;
  cityName: string;
  position: [number, number];
  founderCount: number;
  founders: FounderForPals[];
  isCluster: boolean;
}

function MapController({ targetCity }: { targetCity: CityCluster | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (targetCity) {
      map.flyTo(targetCity.position, 8, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [map, targetCity]);
  
  return null;
}

function useZoomLevel() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  useEffect(() => {
    const handler = () => setZoom(map.getZoom());
    map.on("zoomend", handler);
    return () => { map.off("zoomend", handler); };
  }, [map]);
  
  return zoom;
}

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const zoom = useZoomLevel();
  
  useEffect(() => {
    onZoomChange(zoom);
  }, [zoom, onZoomChange]);
  
  return null;
}

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];

interface FoundersPalsMapProps {
  founders: FounderForPals[];
  selectedUsername: string | null;
  onSelect: (username: string) => void;
  className?: string;
}

export function FoundersPalsMap({
  founders,
  selectedUsername,
  onSelect,
  className = "",
}: FoundersPalsMapProps) {
  const [zoom, setZoom] = useState(5);
  const [clickedCity, setClickedCity] = useState<CityCluster | null>(null);
  const [targetCity, setTargetCity] = useState<CityCluster | null>(null);

  const citiesData = useMemo(() => {
    const byCity = new Map<string, FounderForPals[]>();
    for (const f of founders) {
      const city = f.city?.trim() || "India";
      if (!byCity.has(city)) byCity.set(city, []);
      byCity.get(city)!.push(f);
    }
    
    const cities: CityCluster[] = [];
    byCity.forEach((founderList, cityName) => {
      const coords = getCityCoordinates(cityName === "India" ? null : cityName);
      if (coords) {
        cities.push({
          id: cityName,
          cityName,
          position: [coords[1], coords[0]],
          founderCount: founderList.length,
          founders: founderList,
          isCluster: false,
        });
      }
    });
    
    return cities;
  }, [founders]);

  const clusters = useMemo(() => {
    const clusterRadius = getClusterRadiusByZoom(zoom);
    if (clusterRadius === 0) return citiesData;

    const clustered: CityCluster[] = [];
    const used = new Set<string>();

    for (let i = 0; i < citiesData.length; i++) {
      const city = citiesData[i];
      if (!city || used.has(city.id)) continue;
      
      const nearby: CityCluster[] = [city];
      used.add(city.id);

      for (let j = i + 1; j < citiesData.length; j++) {
        const otherCity = citiesData[j];
        if (!otherCity || used.has(otherCity.id)) continue;
        
        const distance = getDistance(
          [city.position[1], city.position[0]],
          [otherCity.position[1], otherCity.position[0]]
        );
        
        if (distance <= clusterRadius) {
          nearby.push(otherCity);
          used.add(otherCity.id);
        }
      }

      if (nearby.length === 1) {
        clustered.push(city);
      } else {
        const allFounders = nearby.flatMap(c => c.founders);
        const avgLat = nearby.reduce((sum, c) => sum + c.position[0], 0) / nearby.length;
        const avgLng = nearby.reduce((sum, c) => sum + c.position[1], 0) / nearby.length;
        
        clustered.push({
          id: nearby.map(c => c.id).join("-"),
          cityName: nearby.map(c => c.cityName).join(", "),
          position: [avgLat, avgLng],
          founderCount: allFounders.length,
          founders: allFounders,
          isCluster: true,
        });
      }
    }

    return clustered;
  }, [citiesData, zoom]);

  const handleCityClick = (cluster: CityCluster) => {
    if (cluster.isCluster || cluster.founderCount > 1) {
      setClickedCity(cluster);
      setTargetCity(cluster);
    } else if (cluster.founders[0]) {
      onSelect(cluster.founders[0].username);
    }
  };

  const handleClosePopup = () => {
    setClickedCity(null);
    setTargetCity(null);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CITY_MARKER_STYLES }} />
      
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
          
          <ZoomTracker onZoomChange={setZoom} />
          <MapController targetCity={targetCity} />
          
          {clusters.map((cluster) => {
            const isSelected = cluster.founders.some(f => f.username === selectedUsername);
            
            return (
              <Marker
                key={cluster.id}
                position={cluster.position}
                icon={createCityMarkerIcon(cluster.founderCount, cluster.isCluster, isSelected)}
                eventHandlers={{
                  click: () => handleCityClick(cluster),
                }}
              >
                <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{cluster.cityName}</p>
                    <p className="text-xs text-muted-foreground">
                      {cluster.founderCount} builder{cluster.founderCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {clickedCity && (
        <CityPopup
          cityName={clickedCity.cityName}
          founders={clickedCity.founders}
          onClose={handleClosePopup}
          onSelectFounder={onSelect}
        />
      )}
    </>
  );
}
