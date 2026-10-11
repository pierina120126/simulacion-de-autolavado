// =====================================================================
// VehicleRoad — Visualización animada del flujo de vehículos
// =====================================================================
import type { Vehicle, Station } from '../types/simulation';
import { STATION_NAMES } from '../constants/simulation';
import { CarSVG } from './CarSVG';

interface VehicleRoadProps {
  vehicles:       Vehicle[];
  stations:       Station[];
  activeStations: number;
}

export function VehicleRoad({ vehicles, activeStations }: VehicleRoadProps) {
  const inProcess = vehicles.filter(v => v.status === 'processing');
  const waiting   = vehicles.filter(v => v.status === 'waiting');

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛣️</span>
          <h3 className="font-semibold text-slate-300 text-sm">Flujo de vehículos en tiempo real</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>🔧 En proceso: <strong className="text-white">{inProcess.length}</strong></span>
          <span>⏳ Esperando: <strong className="text-white">{waiting.length}</strong></span>
          <span>📊 Total activos: <strong className="text-white">{vehicles.length}</strong></span>
        </div>
      </div>

      {/* Carretera */}
      <div className="relative h-28 bg-slate-900/60 rounded-xl border border-slate-700 overflow-hidden">

        {/* Línea de carretera central */}
        <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
          <div className="w-full h-0.5 road-stripe flow-pulse" />
        </div>

        {/* Zonas de estaciones */}
        <div className="absolute inset-0 flex">
          {STATION_NAMES.slice(0, activeStations).map((name, i) => (
            <div
              key={i}
              className="flex-1 border-r border-slate-700/40 flex flex-col
                items-center justify-end pb-1 last:border-r-0"
            >
              <span className="text-xs text-slate-600 font-medium select-none">{name}</span>
            </div>
          ))}
        </div>

        {/* Vehículos animados */}
        <div className="absolute inset-0 flex items-center">
          {inProcess.length === 0 ? (
            <p className="w-full text-center text-slate-600 text-sm select-none">
              Sin vehículos en proceso...
            </p>
          ) : (
            inProcess.map(v => {
              const pct = activeStations > 0
                ? ((v.currentStation / activeStations) + 1 / (activeStations * 2)) * 100
                : 50;
              return (
                <div
                  key={v.id}
                  className="absolute transition-all duration-1000"
                  style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                  title={`${v.name} — ${STATION_NAMES[v.currentStation]}`}
                >
                  <CarSVG color={v.color} small animated />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cola de espera */}
      {waiting.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500">En cola general:</span>
          {waiting.slice(0, 10).map(v => (
            <div
              key={v.id}
              className="fade-in-up rounded px-1.5 py-0.5 text-xs font-mono"
              style={{
                background: v.color + '22',
                color:      v.color,
                border:    `1px solid ${v.color}44`,
              }}
            >
              {v.name}
            </div>
          ))}
          {waiting.length > 10 && (
            <span className="text-xs text-slate-500">+{waiting.length - 10} más</span>
          )}
        </div>
      )}
    </div>
  );
}
