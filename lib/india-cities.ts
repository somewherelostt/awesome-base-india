/** Approximate [lng, lat] for Indian cities. Used to position founder marker on India map. */
export const INDIA_CITY_COORDINATES: Record<string, [number, number]> = {
  Dehradun: [78.0322, 30.3165],
  Mumbai: [72.8777, 19.076],
  "New Delhi": [77.209, 28.6139],
  Delhi: [77.209, 28.6139],
  Bangalore: [77.5946, 12.9716],
  Bengaluru: [77.5946, 12.9716],
  Chennai: [80.2707, 13.0827],
  Hyderabad: [78.4867, 17.385],
  Kolkata: [88.3639, 22.5726],
  Pune: [73.8563, 18.5204],
  Ahmedabad: [72.5714, 23.0225],
  Jaipur: [75.7873, 26.9124],
  Lucknow: [80.9462, 26.8467],
  Kochi: [76.2673, 9.9312],
  Chandigarh: [76.7794, 30.7333],
  Indore: [75.8577, 22.7196],
  Coimbatore: [76.9558, 11.0168],
  Nagpur: [79.0882, 21.1458],
  Gurgaon: [77.0266, 28.4595],
  Gurugram: [77.0266, 28.4595],
  Noida: [77.391, 28.5355],
  Thane: [72.9762, 19.2183],
  Bhopal: [77.4126, 23.2599],
  Visakhapatnam: [83.2185, 17.6868],
  Surat: [72.8311, 21.1702],
  Patna: [85.1376, 25.5941],
  Vadodara: [73.1812, 22.3072],
  Ghaziabad: [77.437, 28.6692],
  Ludhiana: [75.8573, 30.901],
  Agra: [78.0081, 27.1767],
  Nashik: [73.7898, 19.9975],
  Faridabad: [77.319, 28.4089],
  Meerut: [77.708, 28.9845],
  Rajkot: [70.8022, 22.3039],
  Srinagar: [74.7973, 34.0837],
  Ranchi: [85.3096, 23.3441],
  Guwahati: [91.751, 26.1445],
  Bhubaneswar: [85.8245, 20.2961],
  India: [78.9629, 20.5937], // center fallback
};

/** India bounding box [minLng, minLat, maxLng, maxLat] for SVG viewBox mapping. Matches outline path. */
export const INDIA_BOUNDS = [68.0, 6.5, 97.5, 37.5] as const;

export function getCityCoordinates(city: string | null | undefined): [number, number] | null {
  if (!city) return null;
  const key = city.trim();
  return INDIA_CITY_COORDINATES[key] ?? INDIA_CITY_COORDINATES[key.replace(/\s+/g, " ")] ?? null;
}

/** Convert lng,lat to SVG x,y (0–100 scale) for a map with INDIA_BOUNDS */
export function lngLatToSvg(lng: number, lat: number): [number, number] {
  const [minLng, minLat, maxLng, maxLat] = INDIA_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return [x, y];
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 - [lng, lat] of first point
 * @param coord2 - [lng, lat] of second point
 * @returns Distance in kilometers
 */
export function getDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get cluster radius based on zoom level
 * Higher zoom = smaller radius (less clustering)
 * @param zoom - Map zoom level
 * @returns Cluster radius in kilometers
 */
export function getClusterRadiusByZoom(zoom: number): number {
  if (zoom >= 8) return 0; // No clustering at high zoom
  if (zoom >= 6) return 50; // 50km radius
  if (zoom >= 5) return 150; // 150km radius
  return 300; // 300km radius at low zoom
}
