"use client";

import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

interface CityMarkerIconProps {
  count: number;
  isCluster: boolean;
  isSelected: boolean;
}

function CityMarkerIcon({ count, isCluster, isSelected }: CityMarkerIconProps) {
  const size = isCluster ? 48 : 40;
  const bgColor = isSelected ? "#0052FF" : "#3B82F6";
  
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: bgColor,
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "white",
          fontSize: isCluster ? "16px" : "14px",
        }}
      >
        {count}
      </div>
      
      {isCluster && (
        <div
          style={{
            position: "absolute",
            width: `${size + 10}px`,
            height: `${size + 10}px`,
            borderRadius: "50%",
            border: "2px solid rgba(59, 130, 246, 0.5)",
            animation: "pulse 2s infinite",
          }}
        />
      )}
    </div>
  );
}

export function createCityMarkerIcon(
  count: number,
  isCluster: boolean = false,
  isSelected: boolean = false
): L.DivIcon {
  return L.divIcon({
    html: renderToStaticMarkup(
      <CityMarkerIcon count={count} isCluster={isCluster} isSelected={isSelected} />
    ),
    className: "city-marker-icon",
    iconSize: isCluster ? [48, 48] : [40, 40],
    iconAnchor: isCluster ? [24, 24] : [20, 20],
    popupAnchor: [0, isCluster ? -24 : -20],
  });
}

export const CITY_MARKER_STYLES = `
  .city-marker-icon {
    background: transparent !important;
    border: none !important;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
`;
