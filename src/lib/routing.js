// Geo helpers for Sanctuary avoidance routing.
// Uses equirectangular approximation — accurate enough for regional routing.

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toMilesXY(lat, lng, refLat) {
  return { x: lng * Math.cos((refLat * Math.PI) / 180) * 69.0, y: lat * 69.0 };
}

// Distance (miles) from point p to segment a-b, plus the parametric position t [0..1].
function pointToSegment(p, a, b) {
  const refLat = (a.lat + b.lat) / 2;
  const pa = toMilesXY(p.lat, p.lng, refLat);
  const aa = toMilesXY(a.lat, a.lng, refLat);
  const bb = toMilesXY(b.lat, b.lng, refLat);
  const dx = bb.x - aa.x;
  const dy = bb.y - aa.y;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((pa.x - aa.x) * dx + (pa.y - aa.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = aa.x + t * dx;
  const projY = aa.y + t * dy;
  const distX = pa.x - projX;
  const distY = pa.y - projY;
  return { dist: Math.sqrt(distX * distX + distY * distY), t };
}

/**
 * Compute a Sanctuary route from origin to destination that deflects around
 * flagged zones within range of the direct path.
 * Returns { path: [{lat,lng}...], avoided: [zones...] }
 */
export function computeRoute(origin, dest, zones, bufferMiles = 8) {
  if (!origin || !dest) return { path: [], avoided: [] };

  const avoided = [];
  const waypoints = [];

  for (const z of zones) {
    const { dist, t } = pointToSegment({ lat: z.lat, lng: z.lng }, origin, dest);
    const threshold = (z.radius_miles || 5) + bufferMiles;
    if (dist < threshold) {
      avoided.push({ zone: z, clearance: threshold - dist });
      // Build a deflection waypoint perpendicular to the segment, pushed away from the zone.
      const refLat = (origin.lat + dest.lat) / 2;
      const aa = toMilesXY(origin.lat, origin.lng, refLat);
      const bb = toMilesXY(dest.lat, dest.lng, refLat);
      const za = toMilesXY(z.lat, z.lng, refLat);
      const dx = bb.x - aa.x;
      const dy = bb.y - aa.y;
      const segLen = Math.sqrt(dx * dx + dy * dy) || 1;
      const projX = aa.x + t * dx;
      const projY = aa.y + t * dy;
      // perpendicular unit vector
      const perpX = -dy / segLen;
      const perpY = dx / segLen;
      // push it in the direction away from the zone center
      const sign = perpX * (projX - za.x) + perpY * (projY - za.y) > 0 ? 1 : -1;
      const offset = threshold - dist + 5;
      const deflX = projX + sign * perpX * offset;
      const deflY = projY + sign * perpY * offset;
      waypoints.push({
        t,
        lat: deflY / 69.0,
        lng: deflX / (Math.cos((refLat * Math.PI) / 180) * 69.0),
      });
    }
  }

  waypoints.sort((a, b) => a.t - b.t);
  const path = [origin, ...waypoints.map((w) => ({ lat: w.lat, lng: w.lng })), dest];
  return { path, avoided };
}