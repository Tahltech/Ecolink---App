/**
 * Approximate coordinates for major Cameroon regions/cities.
 * Used when the client sends a region name instead of lat/lon.
 */
const REGION_COORDS = {
  yaounde: { lat: 3.848, lon: 11.502, label: 'Yaoundé' },
  douala: { lat: 4.051, lon: 9.768, label: 'Douala' },
  centre: { lat: 3.848, lon: 11.502, label: 'Centre' },
  littoral: { lat: 4.051, lon: 9.768, label: 'Littoral' },
  west: { lat: 5.478, lon: 10.417, label: 'West' },
  northwest: { lat: 5.963, lon: 10.159, label: 'Northwest' },
  southwest: { lat: 4.153, lon: 9.242, label: 'Southwest' },
  south: { lat: 2.917, lon: 11.167, label: 'South' },
  east: { lat: 4.577, lon: 13.685, label: 'East' },
  adamawa: { lat: 7.317, lon: 13.583, label: 'Adamawa' },
  north: { lat: 8.624, lon: 13.578, label: 'North' },
  'far north': { lat: 10.593, lon: 14.316, label: 'Far North' },
  farnorth: { lat: 10.593, lon: 14.316, label: 'Far North' },
  bamenda: { lat: 5.963, lon: 10.159, label: 'Bamenda' },
  buea: { lat: 4.153, lon: 9.242, label: 'Buea' },
  garoua: { lat: 9.301, lon: 13.397, label: 'Garoua' },
  maroua: { lat: 10.593, lon: 14.316, label: 'Maroua' },
};

const normalizeRegion = (region) => (region || 'yaounde').toLowerCase().trim().replace(/_/g, ' ');

const resolveRegionCoords = (region) => {
  const key = normalizeRegion(region);
  return REGION_COORDS[key] || REGION_COORDS.yaounde;
};

// The 10 official regions only (excludes city aliases like "Douala" which
// map to the same point as their region) — used when we need one canonical
// bucket per GPS point for weather/tips.
const OFFICIAL_REGIONS = [
  'centre', 'littoral', 'west', 'northwest', 'southwest',
  'south', 'east', 'adamawa', 'north', 'far north',
];

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Finds the nearest of Cameroon's 10 official regions to a GPS point —
 * used to bucket a user's live location into a region for weather,
 * flood-risk, and daily climate-tip personalization.
 */
const resolveNearestRegion = (lat, lon) => {
  let best = null;
  let bestDist = Infinity;
  OFFICIAL_REGIONS.forEach((key) => {
    const coords = REGION_COORDS[key];
    const dist = haversineKm(lat, lon, coords.lat, coords.lon);
    if (dist < bestDist) {
      bestDist = dist;
      best = coords;
    }
  });
  return { ...best, distanceKm: Math.round(bestDist) };
};

module.exports = { REGION_COORDS, normalizeRegion, resolveRegionCoords, resolveNearestRegion, haversineKm };
