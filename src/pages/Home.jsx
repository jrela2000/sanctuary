import React from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin, Building2, ArrowRight, ShieldCheck, AlertTriangle, Database } from "lucide-react";

const stats = [
  { value: "44M", label: "Black Americans" },
  { value: "63M", label: "Latino Americans" },
  { value: "1,300+", label: "Confirmed Sundown Towns" },
  { value: "12-yr", label: "Hate Crime High (2023)" },
];

const modes = [
  {
    icon: Compass,
    title: "Navigation",
    description: "Community-aware routing that actively avoids sundown towns and elevated incident zones. Real-time community reports and dynamic rerouting.",
    path: "/navigation",
    accent: "text-amber-500",
  },
  {
    icon: MapPin,
    title: "Travel",
    description: "Geofencing safety alerts, nearby verified Black-owned and Latino-owned businesses, travel corridor pre-screening, and one-tap emergency resources.",
    path: "/travel",
    accent: "text-emerald-500",
  },
  {
    icon: Building2,
    title: "Relocation",
    description: "Sanctuary Scores across six verified pillars for any U.S. zip code. Side-by-side comparison, displacement risk, and shareable reports.",
    path: "/relocation",
    accent: "text-sky-500",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
      {/* Hero */}
      <div className="mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-500 text-xs font-medium mb-8">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified · Sourced · Uninfluenced
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
          Uninfluenced data for{" "}
          <span className="text-amber-500">Black and Latino</span> communities.
        </h1>
        <p className="text-lg md:text-xl text-stone-400 leading-relaxed max-w-2xl">
          A navigation and intelligence platform built on verified, sourced data — no social feed, no influencer layer, no promotional content mixed into safety data. Every data point shows its source.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
        {stats.map((s) => (
          <div key={s.label} className="border border-white/5 rounded-xl p-5 bg-white/[0.02]">
            <div className="text-3xl md:text-4xl font-semibold text-amber-500 tracking-tight">{s.value}</div>
            <div className="text-xs md:text-sm text-stone-500 mt-1.5 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Three Modes */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Three modes. One clean platform.</h2>
        <p className="text-stone-400 mb-8">Each answers a question our communities carry every day.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                to={m.path}
                className="group border border-white/5 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <Icon className={`w-7 h-7 mb-4 ${m.accent}`} />
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-1.5">
                  {m.title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">{m.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* No Filler Principle */}
      <div className="border border-white/5 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-white/[0.03] to-transparent mb-16 md:mb-20">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-semibold tracking-tight">The "No Filler" Principle</h2>
        </div>
        <p className="text-stone-400 leading-relaxed mb-4">
          Every feature passes one test before it ships: does this make the data clearer, or does it add noise? If it adds noise, it does not ship.
        </p>
        <p className="text-stone-400 leading-relaxed">
          Existing platforms push safe places to go. Sanctuary delivers both sides — verified safe destinations <span className="text-stone-200">and</span> documented areas to avoid, with active routing around the latter.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-300">Shaun Barton & Jarrod Simpson</p>
            <p className="text-xs text-stone-500 mt-0.5">Co-Founders, Sanctuary</p>
          </div>
          <p className="text-xs text-stone-600 max-w-md md:text-right">
            The original Green Book existed because Black Americans needed intelligence to survive travel. That need evolved. Sanctuary meets it where it lives in 2026.
          </p>
        </div>
      </div>
    </div>
  );
}