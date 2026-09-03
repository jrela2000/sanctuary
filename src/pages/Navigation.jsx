import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, ShieldAlert, Info, Navigation as NavIcon } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Atlanta");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.FlaggedZone.list();
        setZones(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const center = cityCenters[selectedCity];
  const cityZones = useMemo(
    () => zones.filter((z) => z.state === center.state || (selectedCity === "Los Angeles" && z.state === "CA")),
    [zones, selectedCity, center.state]
  );

  const severityColor = (sev) => (sev === "red" ? "#dc2626" : "#ea580c");

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
      <div className="flex gap-2 mb-6">
        {Object.keys(cityCenters).map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
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

        {/* Zone list */}
        <div className="space-y-3">
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
      </div>
    </div>
  );
}