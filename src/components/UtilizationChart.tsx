// =====================================================================
// UtilizationChart — Barras de utilización por estación
// =====================================================================
import type { Station } from '../types/simulation';

interface UtilizationChartProps {
  stations:             Station[];
  utilizationByStation: number[];
  activeStations:       number;
}

export function UtilizationChart({
  stations, utilizationByStation, activeStations,
}: UtilizationChartProps) {
  return (
    <div className="space-y-3">
      {stations.map((s, i) => {
        const util     = utilizationByStation[i] ?? 0;
        const isActive = i < activeStations;
        const barColor =
          util > 80 ? '#ef4444' :
          util > 50 ? '#eab308' : '#22c55e';

        return (
          <div key={s.id} className={!isActive ? 'opacity-30' : ''}>
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5">
                <span>{s.emoji}</span>
                <span className="text-slate-300 font-medium">{s.name}</span>
                {!isActive && <span className="text-slate-600">(Inactiva)</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{s.processedCount} autos</span>
                <span
                  className="font-bold"
                  style={{ color: barColor }}
                >
                  {util.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-700 relative"
                style={{ width: `${util}%`, background: barColor }}
              >
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
