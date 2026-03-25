// Collection state management using localStorage
// Tracks which spots have been scanned (QR) and visited (GPS/manual)

export type SpotStatus = {
  scanned: boolean;
  scannedAt?: string; // ISO string
  visited: boolean;
  visitedAt?: string; // ISO string
  visitMethod?: "gps" | "manual";
};

type CollectionData = {
  spots: Record<string, SpotStatus>;
};

const KEY = "ekirei_collection";

function load(): CollectionData {
  if (typeof window === "undefined") return { spots: {} };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CollectionData) : { spots: {} };
  } catch {
    return { spots: {} };
  }
}

function save(data: CollectionData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getCollection(): CollectionData {
  return load();
}

export function getSpotStatus(spotId: string): SpotStatus {
  const data = load();
  return data.spots[spotId] ?? { scanned: false, visited: false };
}

/** Mark spot as scanned (QR code read). Returns isNew=true on first scan. */
export function markScanned(spotId: string): { isNew: boolean } {
  const data = load();
  const existing = data.spots[spotId];
  if (existing?.scanned) return { isNew: false };
  data.spots[spotId] = {
    ...existing,
    scanned: true,
    scannedAt: new Date().toISOString(),
    visited: existing?.visited ?? false,
  };
  save(data);
  return { isNew: true };
}

/** Mark spot as visited (GPS or manual). Returns isNew=true on first visit. */
export function markVisited(
  spotId: string,
  method: "gps" | "manual"
): { isNew: boolean } {
  const data = load();
  const existing = data.spots[spotId];
  if (existing?.visited) return { isNew: false };
  data.spots[spotId] = {
    scanned: existing?.scanned ?? false,
    scannedAt: existing?.scannedAt,
    visited: true,
    visitedAt: new Date().toISOString(),
    visitMethod: method,
  };
  save(data);
  return { isNew: true };
}

/** Haversine formula: distance between two lat/lng in meters */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
