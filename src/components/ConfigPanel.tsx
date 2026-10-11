// =====================================================================
// ConfigPanel — Panel de configuración de la simulación
// =====================================================================
import type { SimSpeed } from '../types/simulation';
import { SpeedControl } from './SpeedControl';
import { REVENUE_PER_CAR } from '../constants/simulation';

interface ConfigPanelProps {
  arrivalRate:      number;
  setArrivalRate:   (n: number) => void;
  activeStations:   number;
  setActiveStations:(n: number) => void;
  speed:            SimSpeed;
  setSpeed:         (s: SimSpeed) => void;
}

export function ConfigPanel({
  arrivalRate, setArrivalRate,
  activeStations, setActiveStations,
  speed, setSpeed,
}: ConfigPanelProps) {
  return (
    <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-5 fade-in-up">
      <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
        <span>⚙️</span> Configuración de Simulación
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Tasa de llegada */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            🚗 Tasa de llegada
            <span className="ml-2 text-white font-bold">1 auto / {arrivalRate}s</span>
          </label>
          <input
            type="range" min={5} max={60} step={5}
            value={arrivalRate}
            onChange={e => setArrivalRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>Rápido (5s)</span>
            <span>Lento (60s)</span>
          </div>
        </div>

        {/* Número de estaciones activas */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            🏭 Estaciones activas
            <span className="ml-2 text-white font-bold">{activeStations} / 4</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setActiveStations(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeStations === n
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Velocidad de simulación */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            ⚡ Velocidad de simulación
            <span className="ml-2 text-white font-bold">{speed}x</span>
          </label>
          <SpeedControl speed={speed} setSpeed={setSpeed} />
        </div>

        {/* Tarifa por servicio */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            💵 Tarifa por servicio
          </label>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-lg font-bold text-white">${REVENUE_PER_CAR}.00</p>
              <p className="text-xs text-slate-500">por vehículo completado</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
