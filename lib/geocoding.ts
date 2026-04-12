// ============================================================
// Geocoding – converts ZIP codes to lat/lng
// Uses Zippopotam.us (free, no API key required)
// ============================================================

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Convert a US ZIP code to lat/lng coordinates.
 * Uses the free Zippopotam.us API — no key needed.
 */
export async function zipToLatLng(zip: string): Promise<LatLng | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip.trim()}`, {
      next: { revalidate: 86400 }, // cache for 24 hours
    });
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return {
      lat: parseFloat(place.latitude),
      lng: parseFloat(place.longitude),
    };
  } catch {
    return null;
  }
}

/**
 * Haversine formula — calculates distance in miles between two lat/lng points.
 */
export function distanceMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.asin(Math.sqrt(h));
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
