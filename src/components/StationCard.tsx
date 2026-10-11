// =====================================================================
// StationCard — Tarjeta visual de cada estación
// =====================================================================
import type { Station } from '../types/simulation';
import { STATION_COLORS } from '../constants/simulation';
import { CarSVG } from './CarSVG';

interface StationCardProps {
  station: Station;
  idx: number;
  activeStations: number;
  bottleneckId: number;
  utilization: number;
}

export function StationCard({
  station, idx, activeStations, bottleneckId, utilization,
}: StationCardProps) {
  const isActive     = idx < activeStations;
  const isBottleneck = isActive && bottleneckId === idx;
  const status       = isActive ? station.status : 'idle';
  const colors       = STATION_COLORS[status];

  const glowClass =
    status === 'free'    ? 'station-free'    :
    status === 'busy'    ? 'station-busy'    :
    status === 'blocked' ? 'station-blocked' : '';

  return (
    <div
      className={`station-card relative rounded-2xl p-4 border-2
        ${colors.bg} ${colors.border} ${glowClass}
        ${isBottleneck ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900' : ''}
        ${!isActive ? 'opacity-40' : ''}
      `}
    >
      {/* Badge cuello de botella */}
      {isBottleneck && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500
          text-white text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap z-10">
          ⚠️ CUELLO DE BOTELLA
        </div>
      )}

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{station.emoji}</span>
          <div>
            <p className="font-bold text-white text-sm">{station.name}</p>
            <p className="text-xs text-slate-400">Estación {idx + 1}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full
          ${colors.bg} border ${colors.border}`}>
          <span className={`w-2 h-2 rounded-full ${colors.dot}
            ${status === 'busy' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-semibold ${colors.text}`}>{colors.label}</span>
        </div>
      </div>

      {/* Vehículo actual */}
      <div className="min-h-[64px] flex items-center justify-center">
        {station.currentVehicle ? (
          <div className="w-full fade-in-up">
            <div className="flex items-center justify-between mb-1">
              <CarSVG color={station.currentVehicle.color} small animated />
              <div className="text-right">
                <p className="text-xs font-bold text-white">{station.currentVehicle.name}</p>
                <p className="text-xs text-slate-400">{station.currentVehicle.plate}</p>
              </div>
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-100 progress-gradient"
                style={{ width: `${station.serviceProgress}%` }}
              />
            </div>
            <p className="text-xs text-center text-slate-400 mt-1">
              {Math.floor(station.serviceProgress)}% completado
            </p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-3xl opacity-20">🔲</span>
            <p className="text-xs text-slate-500 mt-1">Sin vehículo</p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 my-3" />

      {/* Cola de espera */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-slate-400 font-medium">Cola de espera</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded
            ${station.queue.length > 3
              ? 'bg-red-500/20 text-red-400'
              : station.queue.length > 0
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-slate-700 text-slate-400'}`}>
            {station.queue.length}
          </span>
        </div>
        <div className="flex gap-1 flex-wrap min-h-[20px]">
          {station.queue.slice(0, 6).map(v => (
            <div
              key={v.id}
              className="fade-in-up rounded px-1.5 py-0.5 text-xs font-mono"
              style={{
                background: v.color + '33',
                color: v.color,
                border: `1px solid ${v.color}55`,
              }}
              title={v.plate}
            >
              {v.name}
            </div>
          ))}
          {station.queue.length > 6 && (
            <span className="text-xs text-slate-500">+{station.queue.length - 6}</span>
          )}
        </div>
      </div>

      {/* Barra de utilización */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Utilización</span>
          <span className={`font-bold
            ${utilization > 80 ? 'text-red-400' : utilization > 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {utilization.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${utilization}%`,
              background:
                utilization > 80 ? '#ef4444' :
                utilization > 50 ? '#eab308' : '#22c55e',
            }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-white">{station.processedCount}</p>
          <p className="text-xs text-slate-400">Procesados</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-white">{station.queue.length}</p>
          <p className="text-xs text-slate-400">En espera</p>
        </div>
      </div>
    </div>
  );
}
