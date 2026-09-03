import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Compass, MapPin, Building2, Home as HomeIcon, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "Navigation", path: "/navigation", icon: Compass },
  { label: "Travel", path: "/travel", icon: MapPin },
  { label: "Relocation", path: "/relocation", icon: Building2 },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-stone-100 flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r border-white/5 bg-[#0e0e10] z-30">
        <div className="px-6 py-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-amber-600/90 flex items-center justify-center shadow-lg shadow-amber-900/30">
              <Shield className="w-5 h-5 text-stone-950" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-semibold tracking-tight text-lg leading-none">Sanctuary</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-1">Uninfluenced Data</div>
            </div>
          </Link>
        </div>
        <nav className="px-3 flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-amber-600/10 text-amber-500 font-medium"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                )}
              >
                <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-6 border-t border-white/5">
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Built for Black and Latino communities. Every data point sourced. No filler.
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0e0e10] sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600/90 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-stone-950" strokeWidth={2.5} style={{ width: 18, height: 18 }} />
          </div>
          <span className="font-semibold tracking-tight text-lg">Sanctuary</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0e0e10] border-t border-white/5 flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                active ? "text-amber-500" : "text-stone-500"
              )}
            >
              <Icon style={{ width: 20, height: 20 }} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}