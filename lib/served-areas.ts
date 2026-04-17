// ============================================================
// Served Areas — update this as Phlobot expands
// ============================================================
// To add a new market, add an entry to SERVED_MARKETS below.
// Each market has a center coordinate and a radius in miles.
// ============================================================

interface Market {
  name: string;       // display name, e.g. "Denver, CO"
  lat: number;
  lng: number;
  radiusMiles: number;
}

export const SERVED_MARKETS: Market[] = [
  {
    name: "Denver, CO",
    lat: 39.7392,
    lng: -104.9903,
    radiusMiles: 50,
  },
  // Add more markets here as you expand:
  // { name: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, radiusMiles: 50 },
];

// ── Haversine distance (miles) ────────────────────────────────
function distanceMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export interface ZipInfo {
  city: string;
  state: string;
  stateAbbr: string;
  lat: number;
  lng: number;
}

/**
 * Look up a ZIP code — returns city, state, and coordinates.
 * Returns null if the ZIP is invalid or not found.
 */
export async function lookupZip(zip: string): Promise<ZipInfo | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip.trim()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return {
      city: place["place name"],
      state: place["state"],
      stateAbbr: place["state abbreviation"],
      lat: parseFloat(place.latitude),
      lng: parseFloat(place.longitude),
    };
  } catch {
    return null;
  }
}

/**
 * Returns the market name if the ZIP's coordinates fall within
 * any served market radius, otherwise null.
 */
export function getServedMarket(info: ZipInfo): string | null {
  for (const market of SERVED_MARKETS) {
    const dist = distanceMiles(info.lat, info.lng, market.lat, market.lng);
    if (dist <= market.radiusMiles) {
      return market.name;
    }
  }
  return null;
}
