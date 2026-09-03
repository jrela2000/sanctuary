import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Phone, Clock, BadgeCheck, Filter, Siren, LifeBuoy, ShieldCheck } from "lucide-react";

const cities = ["All", "Atlanta", "Houston", "Los Angeles"];
const communities = ["All", "Black-owned", "Latino-owned"];
const categories = ["All", "Food", "Financial", "Health", "Legal", "Auto", "Retail"];

const emergencyResources = [
  { label: "ACLU — Immigrant Rights", phone: "", desc: "National legal support for civil rights and immigration enforcement encounters." },
  { label: "United We Dream", phone: "", desc: "ICE enforcement reporting and rapid response network for Latino communities." },
  { label: "NAACP Legal Defense Fund", phone: "", desc: "Civil rights legal support and hate crime reporting for Black communities." },
  { label: "Mijente", phone: "", desc: "Community defense and immigration enforcement intelligence." },
];

export default function Travel() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("All");
  const [community, setCommunity] = useState("All");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Business.list();
        setBusinesses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      businesses.filter(
        (b) =>
          (city === "All" || b.city === city) &&
          (community === "All" || b.owner_community === community) &&
          (category === "All" || b.category === category)
      ),
    [businesses, city, community, category]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium mb-2">
          <MapPin className="w-4 h-4" />
          Travel Mode
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Verified businesses & safety intelligence</h1>
        <p className="text-stone-400 max-w-2xl">
          Real-time geofencing alerts, nearby verified Black-owned and Latino-owned businesses, and one-tap emergency resources.
        </p>
      </div>

      {/* Safety alert banner */}
      <div className="flex items-start gap-3 border border-orange-600/20 rounded-xl p-4 bg-orange-600/[0.06] mb-8">
        <Siren className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-orange-300">Active Safety Advisory</p>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Civil rights and immigration enforcement intelligence feeds from Mijente, United We Dream, and ACLU state chapters are active. Exercise heightened awareness in flagged corridors.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterGroup label="City" options={cities} value={city} onChange={setCity} />
        <FilterGroup label="Community" options={communities} value={community} onChange={setCommunity} />
        <FilterGroup label="Category" options={categories} value={category} onChange={setCategory} />
      </div>

      {/* Business grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-stone-700 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-stone-500 text-center py-20">No businesses match your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filtered.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}

      {/* Emergency resources */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <LifeBuoy className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold tracking-tight">Emergency Resources</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {emergencyResources.map((r) => (
            <div key={r.label} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
              <p className="font-medium text-sm mb-1">{r.label}</p>
              <p className="text-xs text-stone-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-500 flex items-center gap-1">
        <Filter className="w-3 h-3" />
        {label}
      </span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === opt ? "bg-amber-600 text-stone-950" : "bg-white/5 text-stone-400 hover:bg-white/10"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function BusinessCard({ business }) {
  const isBlack = business.owner_community === "Black-owned";
  return (
    <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02] hover:border-white/10 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-base leading-tight">{business.name}</h3>
          <p className="text-xs text-stone-500 mt-1">{business.address}</p>
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full whitespace-nowrap ${
            isBlack ? "bg-amber-600/15 text-amber-500" : "bg-emerald-600/15 text-emerald-500"
          }`}
        >
          {business.owner_community}
        </span>
      </div>
      <p className="text-sm text-stone-400 leading-relaxed mb-4">{business.description}</p>
      <div className="space-y-1.5 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
          Verified {business.verified_date}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          {business.phone}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          {business.hours}
        </div>
      </div>
    </div>
  );
}