import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Building2, TrendingUp, TrendingDown, Minus, GitCompare, X, FileDown } from "lucide-react";

const pillarLabels = {
  safety: "Safety",
  schools: "Schools",
  financial: "Financial Institutions",
  community_resources: "Community Resources",
  minority_business: "Minority Business",
  faith_community: "Faith Community",
};

const riskColors = {
  Low: "text-emerald-500 bg-emerald-600/10",
  Medium: "text-amber-500 bg-amber-600/10",
  High: "text-orange-500 bg-orange-600/10",
  Critical: "text-red-500 bg-red-600/10",
};

const trendIcons = {
  stable: { icon: Minus, color: "text-stone-400" },
  declining: { icon: TrendingDown, color: "text-orange-500" },
  declining_rapidly: { icon: TrendingDown, color: "text-red-500" },
};

export default function Relocation() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.SanctuaryScore.list();
        setScores(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleCompare = (score) => {
    setCompareList((prev) => {
      const exists = prev.find((s) => s.id === score.id);
      if (exists) return prev.filter((s) => s.id !== score.id);
      if (prev.length >= 2) return [prev[1], score];
      return [...prev, score];
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sky-500 text-sm font-medium mb-2">
          <Building2 className="w-4 h-4" />
          Relocation Mode
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Sanctuary Scores</h1>
        <p className="text-stone-400 max-w-2xl">
          Comprehensive scores across six verified data pillars. Every data point shows its source and last updated date. No sponsored content touches the calculation.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-stone-700 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Score cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {scores.map((s) => (
              <ScoreCard
                key={s.id}
                score={s}
                onSelect={() => setSelected(s)}
                inCompare={!!compareList.find((c) => c.id === s.id)}
                onToggleCompare={() => toggleCompare(s)}
              />
            ))}
          </div>

          {/* Comparison panel */}
          {compareList.length > 0 && (
            <div className="border border-sky-600/20 rounded-2xl p-6 bg-sky-600/[0.04] mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-sky-500" />
                  <h2 className="text-lg font-semibold">Side-by-Side Comparison</h2>
                </div>
                <button onClick={() => setCompareList([])} className="text-stone-500 hover:text-stone-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ComparisonView scores={compareList} />
            </div>
          )}

          {/* Detail modal */}
          {selected && <ScoreDetail score={selected} onClose={() => setSelected(null)} />}
        </>
      )}
    </div>
  );
}

function ScoreCard({ score, onSelect, inCompare, onToggleCompare }) {
  const scoreColor = score.composite_score >= 80 ? "text-emerald-500" : score.composite_score >= 65 ? "text-amber-500" : "text-orange-500";
  return (
    <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02] hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">{score.neighborhood}</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {score.city}, {score.state} · {score.zip_code}
          </p>
        </div>
        <div className={`text-3xl font-semibold tracking-tight ${scoreColor}`}>{score.composite_score}</div>
      </div>

      {/* Mini pillar bars */}
      <div className="space-y-2 mb-4">
        {Object.entries(score.pillars || {}).map(([key, p]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500 w-28 truncate">{pillarLabels[key]}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-600/70"
                style={{ width: `${p.score}%` }}
              />
            </div>
            <span className="text-[11px] text-stone-400 w-6 text-right">{p.score}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${riskColors[score.displacement_risk] || "text-stone-400 bg-white/5"}`}>
          {score.displacement_risk} displacement risk
        </span>
      </div>

      <div className="flex gap-2">
        <button onClick={onSelect} className="flex-1 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-lg py-2 transition-colors">
          View Details
        </button>
        <button
          onClick={onToggleCompare}
          className={`text-sm font-medium rounded-lg px-3 py-2 transition-colors ${
            inCompare ? "bg-sky-600 text-stone-950" : "bg-white/5 hover:bg-white/10 text-stone-300"
          }`}
        >
          {inCompare ? "Added" : "Compare"}
        </button>
      </div>
    </div>
  );
}

function ScoreDetail({ score, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6" onClick={onClose}>
      <div
        className="bg-[#131316] border border-white/10 rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#131316] border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{score.neighborhood}</h2>
            <p className="text-xs text-stone-500">{score.city}, {score.state} · {score.zip_code}</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Composite score */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl font-semibold text-amber-500">{score.composite_score}</div>
            <div>
              <p className="text-sm text-stone-400">Composite Sanctuary Score</p>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full mt-1 inline-block ${riskColors[score.displacement_risk] || ""}`}>
                {score.displacement_risk} displacement risk
              </span>
            </div>
          </div>

          {/* Pillars */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wide">Six Pillars</h3>
            {Object.entries(score.pillars || {}).map(([key, p]) => (
              <div key={key} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{pillarLabels[key]}</span>
                  <span className="text-lg font-semibold text-amber-500">{p.score}</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mb-2">{p.note}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span>{p.source}</span>
                  <span>Updated {p.last_updated}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Displacement */}
          <div className="border border-white/5 rounded-xl p-4 bg-white/[0.02] mb-6">
            <h3 className="text-sm font-semibold mb-2">Displacement Analysis</h3>
            <p className="text-xs text-stone-400 leading-relaxed">{score.displacement_note}</p>
          </div>

          {/* Demographic trend */}
          {score.demographic_trend && (
            <div className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
              <h3 className="text-sm font-semibold mb-3">Demographic Trajectory — Black Population %</h3>
              <div className="flex items-end justify-between gap-4 mb-3">
                {[
                  { year: "2015", val: score.demographic_trend.black_population_pct_2015 },
                  { year: "2020", val: score.demographic_trend.black_population_pct_2020 },
                  { year: "2025", val: score.demographic_trend.black_population_pct_2025 },
                ].map((d) => (
                  <div key={d.year} className="flex-1 text-center">
                    <div className="h-24 flex items-end justify-center mb-1">
                      <div
                        className="w-full max-w-[60px] rounded-t bg-gradient-to-t from-amber-600/40 to-amber-500/80"
                        style={{ height: `${d.val}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium">{d.val}%</div>
                    <div className="text-[10px] text-stone-500">{d.year}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                {(() => {
                  const t = trendIcons[score.demographic_trend.trend_direction] || trendIcons.stable;
                  const Icon = t.icon;
                  return (
                    <>
                      <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                      Trend: {score.demographic_trend.trend_direction.replace(/_/g, " ")}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComparisonView({ scores }) {
  if (scores.length < 2) {
    return <p className="text-sm text-stone-400">Select two locations to compare side by side.</p>;
  }
  const [a, b] = scores;
  const pillars = Object.keys(a.pillars || {});

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 pr-4 text-xs font-medium text-stone-500 uppercase tracking-wide">Metric</th>
            <th className="text-right py-2 px-4 font-semibold">{a.neighborhood}</th>
            <th className="text-right py-2 px-4 font-semibold">{b.neighborhood}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5">
            <td className="py-2.5 pr-4 text-stone-400 text-xs">Composite Score</td>
            <td className="py-2.5 px-4 text-right text-lg font-semibold text-amber-500">{a.composite_score}</td>
            <td className="py-2.5 px-4 text-right text-lg font-semibold text-amber-500">{b.composite_score}</td>
          </tr>
          {pillars.map((key) => {
            const pa = a.pillars[key]?.score ?? "—";
            const pb = b.pillars[key]?.score ?? "—";
            return (
              <tr key={key} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-stone-400 text-xs">{pillarLabels[key]}</td>
                <td className="py-2.5 px-4 text-right">{pa}</td>
                <td className="py-2.5 px-4 text-right">{pb}</td>
              </tr>
            );
          })}
          <tr className="border-b border-white/5">
            <td className="py-2.5 pr-4 text-stone-400 text-xs">Displacement Risk</td>
            <td className="py-2.5 px-4 text-right">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColors[a.displacement_risk] || ""}`}>{a.displacement_risk}</span>
            </td>
            <td className="py-2.5 px-4 text-right">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColors[b.displacement_risk] || ""}`}>{b.displacement_risk}</span>
            </td>
          </tr>
          <tr>
            <td className="py-2.5 pr-4 text-stone-400 text-xs">Black Pop. Trend</td>
            <td className="py-2.5 px-4 text-right text-xs capitalize">{a.demographic_trend?.trend_direction?.replace(/_/g, " ") || "—"}</td>
            <td className="py-2.5 px-4 text-right text-xs capitalize">{b.demographic_trend?.trend_direction?.replace(/_/g, " ") || "—"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}