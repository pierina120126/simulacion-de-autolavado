// =====================================================================
// App.tsx — Componente raíz principal
// =====================================================================
import { useState, useEffect, useMemo } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { MetricCard }      from './components/MetricCard';
import { StationCard }     from './components/StationCard';
import { VehicleRoad }     from './components/VehicleRoad';
import { UtilizationChart } from './components/UtilizationChart';
import { ActivityLog }     from './components/ActivityLog';
import { ConfigPanel }     from './components/ConfigPanel';
import { CarSVG }          from './components/CarSVG';
import { SpeedControl }    from './components/SpeedControl';
import { STATION_NAMES, BASE_SERVICE_TIMES, REVENUE_PER_CAR } from './constants/simulation';
import { formatCurrency, formatSimTime } from './utils/helpers';
import type { SimEvent }   from './types/simulation';

// ── Flecha de flujo entre estaciones ─────────────────────────────────
function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-1">
      <svg
        width="20" height="20" viewBox="0 0 20 20"
        className={`transition-colors duration-300 ${active ? 'text-blue-400' : 'text-slate-700'}`}
      >
        <path d="M4 10h10M10 6l4 4-4 4" stroke="currentColor"
          strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {active && (
        <div className="w-5 h-0.5 road-stripe flow-pulse mt-0.5 rounded" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
export default function App() {
  const sim = useSimulation();

  const [events,       setEvents]       = useState<SimEvent[]>([]);
  const [showConfig,   setShowConfig]   = useState(true);

  // Acumular eventos recientes
  useEffect(() => {
    if (sim.recentEvent) {
      setEvents(prev => [...prev.slice(-49), sim.recentEvent!]);
    }
  }, [sim.recentEvent]);

  // Tiempo de simulación formateado
  const simTime = useMemo(
    () => formatSimTime(sim.metrics.simulationTime),
    [sim.metrics.simulationTime],
  );

  const bottleneckName = sim.bottleneck.stationId >= 0
    ? STATION_NAMES[sim.bottleneck.stationId]
    : 'Sin cuello de botella';

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800
        bg-slate-900/95 backdrop-blur">
        <div className="max-w-screen-2xl mx-auto px-4 py-3
          flex items-center justify-between gap-3 flex-wrap">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl
              bg-gradient-to-br from-blue-500 to-purple-600
              flex items-center justify-center shadow-lg text-xl">
              🚗
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r
                from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AutoLavado Sim
              </h1>
              <p className="text-xs text-slate-500">
                Simulación de Procesos en Tiempo Real
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Tiempo de simulación */}
            <div className="hidden sm:flex items-center gap-2
              bg-slate-800 rounded-lg px-3 py-1.5">
              <span className="text-xs text-slate-400">⏱ Sim:</span>
              <span className="text-xs font-mono font-bold text-blue-400">
                {simTime}
              </span>
            </div>

            {/* Speed (escritorio) */}
            <div className="hidden lg:flex items-center gap-2
              bg-slate-800 rounded-lg px-3 py-1.5">
              <span className="text-xs text-slate-400">⚡</span>
              <SpeedControl speed={sim.speed} setSpeed={sim.setSpeed} />
            </div>

            {/* Iniciar / Pausar */}
            <button
              onClick={() => sim.setIsRunning(r => !r)}
              className={`px-4 py-2 rounded-xl font-bold text-sm
                transition-all shadow-lg ${
                sim.isRunning
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25'
              }`}
            >
              {sim.isRunning ? '⏸ Pausar' : '▶ Iniciar'}
            </button>

            {/* Reset */}
            <button
              onClick={sim.reset}
              className="px-4 py-2 rounded-xl font-bold text-sm
                bg-slate-700 hover:bg-slate-600 transition-all"
            >
              ↺ Reset
            </button>

            {/* Toggle config */}
            <button
              onClick={() => setShowConfig(s => !s)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center
                transition-all text-lg ${
                showConfig
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
              title="Configuración"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">

        {/* ── CONFIGURACIÓN ───────────────────────────────────────── */}
        {showConfig && (
          <ConfigPanel
            arrivalRate={sim.arrivalRate}     setArrivalRate={sim.setArrivalRate}
            activeStations={sim.activeStations} setActiveStations={sim.setActiveStations}
            speed={sim.speed}                 setSpeed={sim.setSpeed}
          />
        )}

        {/* ── MÉTRICAS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            icon="💰" label="Total Ingresos" color="green"
            value={formatCurrency(sim.metrics.totalRevenue)}
            subValue={`${sim.metrics.completedServices} servicios`}
          />
          <MetricCard
            icon="🧾" label="Facturas Totales" color="blue"
            value={sim.metrics.completedServices}
            subValue="vehículos completados"
          />
          <MetricCard
            icon="⚠️" label="Cuello de Botella"
            color={sim.bottleneck.pct > 80 ? 'red' : 'orange'}
            value={`${sim.bottleneck.pct.toFixed(1)}%`}
            subValue={bottleneckName}
          />
          <MetricCard
            icon="⏱️" label="Tiempo Prom. Servicio" color="purple"
            value={`${sim.avgServiceTime.toFixed(1)}s`}
            subValue="sim. por vehículo"
          />
          <MetricCard
            icon="🚗" label="Vehículos Activos" color="cyan"
            value={sim.vehicles.length}
            subValue="en el sistema"
          />
          <MetricCard
            icon="⚡" label="Velocidad" color="blue"
            value={`${sim.speed}x`}
            subValue="velocidad simulación"
          />
        </div>

        {/* ── CARRETERA / FLUJO ────────────────────────────────────── */}
        <VehicleRoad
          vehicles={sim.vehicles}
          stations={sim.stations}
          activeStations={sim.activeStations}
        />

        {/* ── ESTACIONES + PANEL LATERAL ───────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Estaciones */}
          <div className="xl:col-span-3">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h2 className="font-bold text-slate-200 text-base">
                🏭 Estaciones de Servicio
              </h2>
              {/* Leyenda de estados */}
              <div className="flex items-center gap-3 text-xs">
                {[
                  { dot: 'bg-emerald-400', label: 'LIBRE'     },
                  { dot: 'bg-red-400',     label: 'OCUPADO'   },
                  { dot: 'bg-yellow-400',  label: 'BLOQUEADO' },
                  { dot: 'bg-slate-500',   label: 'INACTIVO'  },
                ].map(({ dot, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className="text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-stretch">
              {sim.stations.map((station, idx) => (
                <div key={station.id} className="contents">
                  <div className="flex-1 min-w-0">
                    <StationCard
                      station={station}
                      idx={idx}
                      activeStations={sim.activeStations}
                      bottleneckId={sim.bottleneck.stationId}
                      utilization={sim.utilizationByStation[idx] ?? 0}
                    />
                  </div>
                  {idx < 3 && (
                    <FlowArrow active={sim.isRunning && idx < sim.activeStations - 1} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">

            {/* Gráfico de utilización */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-4">
              <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center gap-2">
                <span>📊</span> Utilización por Estación
              </h3>
              <UtilizationChart
                stations={sim.stations}
                utilizationByStation={sim.utilizationByStation}
                activeStations={sim.activeStations}
              />
            </div>

            {/* Log de actividad */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-4">
              <ActivityLog events={events} onClear={() => setEvents([])} />
            </div>

            {/* Últimos vehículos completados */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-4">
              <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-2">
                <span>✅</span> Últimos Completados
              </h3>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {sim.completedVehicles.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">
                    Sin completados aún...
                  </p>
                ) : (
                  [...sim.completedVehicles].reverse().slice(0, 12).map(v => (
                    <div
                      key={`${v.id}-${v.endTime}`}
                      className="flex items-center gap-2
                        bg-emerald-500/5 border border-emerald-500/20
                        rounded-lg px-2 py-1.5 fade-in-up"
                    >
                      <CarSVG color={v.color} small />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{v.name}</p>
                        <p className="text-xs text-slate-500">{v.plate}</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold whitespace-nowrap">
                        +{formatCurrency(REVENUE_PER_CAR)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tiempos de servicio de referencia */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-4">
              <h3 className="font-bold text-slate-200 text-sm mb-3">
                ℹ️ Tiempos Base de Servicio
              </h3>
              <div className="space-y-2">
                {STATION_NAMES.map((name, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{name}</span>
                    <span className="text-slate-400 font-mono">
                      {(BASE_SERVICE_TIMES[i] / 1000).toFixed(0)}s base
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-700">
                * Se dividen por la velocidad seleccionada.
              </p>
            </div>

          </div>
        </div>

        {/* ── BARRA DE ESTADO INFERIOR ─────────────────────────────── */}
        <div className="flex items-center justify-between
          bg-slate-800/40 rounded-xl border border-slate-700/50
          px-4 py-2 text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                sim.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`} />
              <span>{sim.isRunning ? 'Simulación en curso' : 'Simulación pausada'}</span>
            </div>
            <span>Estaciones: {sim.activeStations}/4</span>
            <span>Velocidad: {sim.speed}x</span>
            <span>Tiempo sim: {simTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>AutoLavado Sim v2.0</span>
            <span>•</span>
            <span>React 19 + TypeScript + Tailwind CSS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
