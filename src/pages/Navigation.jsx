import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";
import { computeRoute, haversine } from "@/lib/routing";
import { AlertTriangle, ShieldAlert, Info, Navigation as NavIcon, Route, CircleDot, ArrowRight } from "lucide-react";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const cityCenters = {
  Atlanta: { lat: 33.75, lng: -84.39, zoom: 8 },
  Houston: { lat: 29.76, lng: -95.37, zoom: 8 },
  "Los Angeles": { lat: 34.05, lng: -118.27, zoom: 9 },
};

export default function Navigation() {
  const [zones, setZones] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Atlanta");
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [zData, bData] = await Promise.all([
          base44.entities.FlaggedZone.list(),
          base44.entities.Business.list(),
        ]);
        setZones(zData);
        setBusinesses(bData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build a list of routable locations: city centers + verified businesses.
  const locations = useMemo(() => {
    const cities = Object.entries(cityCenters).map(([name, c]) => ({
      id: `city-${name}`,
      name,
      sub: "City Center",
      lat: c.lat,
      lng: c.lng,
    }));
    const biz = businesses.map((b) => ({
      id: `biz-${b.id}`,
      name: b.name,
      sub: `${b.category} · ${b.city}`,
      lat: b.lat,
      lng: b.lng,
    }));
    return [...cities, ...biz];
  }, [businesses]);

  const center = cityCenters[selectedCity];
  const cityZones = useMemo(
    () => zones.filter((z) => z.state === center.state || (selectedCity === "Los Angeles" && z.state === "CA")),
    [zones, selectedCity, center.state]
  );

  const origin = locations.find((l) => l.id === originId);
  const destination = locations.find((l) => l.id === destinationId);

  // Compute the Sanctuary route (deflects around all flagged zones near the path).
  const route = useMemo(() => {
    if (!origin || !destination) return { path: [], avoided: [] };
    return computeRoute(
      { lat: origin.lat, lng: origin.lng },
      { lat: destination.lat, lng: destination.lng },
      zones
    );
  }, [origin, destination, zones]);

  const routeDistance = useMemo(() => {
    if (!route.path.length) return 0;
    let d = 0;
    for (let i = 1; i < route.path.length; i++) {
      d += haversine(route.path[i - 1].lat, route.path[i - 1].lng, route.path[i].lat, route.path[i].lng);
    }
    return Math.round(d);
  }, [route]);

  const severityColor = (sev) => (sev === "red" ? "#dc2626" : "#ea580c");

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setOriginId("");
    setDestinationId("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2">
          <NavIcon className="w-4 h-4" />
          Navigation Mode
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Is this road safe for me?</h1>
        <p className="text-stone-400 max-w-2xl">
          Community-aware routing that actively avoids historically flagged zones, documented sundown towns, and areas with elevated civil rights incident rates.
        </p>
      </div>

      {/* City selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.keys(cityCenters).map((city) => (
          <button
            key={city}
            onClick={() => handleSelectCity(city)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCity === city
                ? "bg-amber-600 text-stone-950"
                : "bg-white/5 text-stone-400 hover:bg-white/10"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Destination input */}
      <div className="border border-white/5 rounded-2xl p-4 bg-white/[0.02] mb-6">
        <div className="flex items-center gap-2 text-amber-500 text-xs font-medium mb-3">
          <Route className="w-3.5 h-3.5" />
          Plan a route — Sanctuary deflects around flagged zones
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <LocationSelect
            label="From"
            value={originId}
            locations={locations}
            onChange={(id) => setOriginId(id === destinationId ? "" : id)}
          />
          <LocationSelect
            label="To"
            value={destinationId}
            locations={locations}
            onChange={(id) => setDestinationId(id === originId ? "" : id)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-white/5 h-[400px] md:h-[560px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-stone-500">
              <div className="w-6 h-6 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : (
            <MapContainer center={[center.lat, center.lng]} zoom={center.zoom} style={{ height: "100%", width: "100%", background: "#0a0a0b" }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap &copy; CARTO'
              />
              {route.path.length > 1 && (
                <>
                  {/* Direct (unsafe) reference path */}
                  <Polyline
                    positions={[[origin.lat, origin.lng], [destination.lat, destination.lng]]}
                    pathOptions={{ color: "#52525b", weight: 2, dashArray: "6 8", opacity: 0.6 }}
                  />
                  {/* Sanctuary avoidance route */}
                  <Polyline
                    positions={route.path.map((p) => [p.lat, p.lng])}
                    pathOptions={{ color: "#f59e0b", weight: 4, opacity: 0.9 }}
                  />
                  <FitBounds path={route.path} />
                </>
              )}
              {cityZones.map((z) => (
                <Circle
                  key={z.id}
                  center={[z.lat, z.lng]}
                  radius={z.radius_miles * 1609.34}
                  pathOptions={{
                    color: severityColor(z.severity),
                    fillColor: severityColor(z.severity),
                    fillOpacity: 0.12,
                    weight: 1.5,
                  }}
                >
                  <Popup className="sanctuary-popup">
                    <div className="text-stone-900">
                      <div className="font-semibold text-sm mb-1">{z.name}</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ background: severityColor(z.severity) }}
                        />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {z.type === "sundown_town" ? "Sundown Town" : "Elevated Incidents"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed mb-2">{z.historical_note}</p>
                      <p className="text-[10px] text-stone-500">Source: {z.source}</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Route summary + zone list */}
        <div className="space-y-3">
          {route.path.length > 1 && (
            <div className="border border-amber-600/20 rounded-xl p-4 bg-amber-600/[0.06] mb-1">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-medium mb-2">
                <Route className="w-3.5 h-3.5" />
                Sanctuary Route Active
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300 mb-2">
                <span className="truncate">{origin.name}</span>
                <ArrowRight className="w-3 h-3 shrink-0 text-stone-500" />
                <span className="truncate">{destination.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-2">
                <span>~{routeDistance} mi</span>
                <span className="text-stone-600">·</span>
                <span className="flex items-center gap-1">
                  <CircleDot className="w-3 h-3 text-amber-500" />
                  {route.avoided.length} {route.avoided.length === 1 ? "zone" : "zones"} avoided
                </span>
              </div>
              {route.avoided.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {route.avoided.map(({ zone, clearance }) => (
                    <div key={zone.id} className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: severityColor(zone.severity) }}
                      />
                      <span className="truncate">{zone.name}</span>
                      <span className="text-stone-600 ml-auto whitespace-nowrap">
                        +{Math.round(clearance)} mi clear
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {route.avoided.length === 0 && (
                <p className="text-[11px] text-stone-500 pt-2 border-t border-white/5">
                  No flagged zones detected on this corridor.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-stone-400 mb-1">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>{cityZones.length} flagged zones in region</span>
          </div>
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {cityZones.map((z) => (
              <div key={z.id} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm">{z.name}</h3>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: severityColor(z.severity) + "20",
                      color: severityColor(z.severity),
                    }}
                  >
                    {z.severity === "red" ? "Red" : "Orange"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                  {z.type === "sundown_town" ? (
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                  ) : (
                    <Info className="w-3 h-3 text-orange-500" />
                  )}
                  {z.type === "sundown_town" ? "Sundown Town" : "Elevated Incident Zone"}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mb-2">{z.historical_note}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-600 pt-2 border-t border-white/5">
                  <span className="truncate">{z.source}</span>
                  <span className="whitespace-nowrap ml-2">{z.last_updated}</span>
                </div>
              </div>
            ))}
            {!loading && cityZones.length === 0 && (
              <p className="text-sm text-stone-500 text-center py-8">No flagged zones in this region.</p>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600" />
          Sundown Town — documented racial exclusion
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-600" />
          Elevated Incident — heightened civil rights risk
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-amber-500" />
          Sanctuary route
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-stone-600" style={{ borderTop: "2px dashed #52525b" }} />
          Direct path
        </div>
      </div>
    </div>
  );
}

// Fits the map viewport to the active route whenever it changes.
function FitBounds({ path }) {
  const map = useMap();
  useEffect(() => {
    if (path.length > 1) {
      const bounds = L.latLngBounds(path.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [path, map]);
  return null;
}

// Dropdown of routable locations (city centers + verified businesses).
function LocationSelect({ label, value, locations, onChange }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wide mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-600/50 transition-colors appearance-none cursor-pointer"
      >
        <option value="" className="bg-[#131316]">Select a location…</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id} className="bg-[#131316]">
            {l.name} — {l.sub}
          </option>
        ))}
      </select>
    </label>
  );
}