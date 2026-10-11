// =====================================================================
// CONSTANTES GLOBALES DE LA SIMULACIÓN
// =====================================================================
import type { SimSpeed } from '../types/simulation';

export const STATION_NAMES   = ['Llegada', 'Aspirado', 'Lavado', 'Secado'] as const;
export const STATION_EMOJIS  = ['📥', '🌀', '🫧', '🌬️'] as const;
export const STATION_ICONS   = ['🚗', '💨', '🧼', '💨'] as const;

/**
 * Tiempo base de servicio por estación en ms (a velocidad 1x).
 * A mayor velocidad el intervalo se divide entre el factor.
 */
export const BASE_SERVICE_TIMES: number[] = [3000, 8000, 15000, 10000];

/** Ingreso por cada vehículo que completa las 4 estaciones */
export const REVENUE_PER_CAR = 25;

/** Intervalo de tick interno de la simulación en ms reales */
export const TICK_MS = 100;

/** Velocidades disponibles */
export const SPEED_OPTIONS: SimSpeed[] = [0.25, 0.5, 1, 2, 5, 10];

/** Colores de estado para las estaciones */
export const STATION_COLORS: Record<
  string,
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  free: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    label: 'LIBRE',
  },
  busy: {
    bg: 'bg-red-500/20',
    border: 'border-red-500',
    text: 'text-red-400',
    dot: 'bg-red-400',
    label: 'OCUPADO',
  },
  blocked: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
    label: 'BLOQUEADO',
  },
  idle: {
    bg: 'bg-slate-700/20',
    border: 'border-slate-600',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    label: 'INACTIVO',
  },
};

/** Colores disponibles para pintar autos aleatoriamente */
export const CAR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#a3e635', '#f9a8d4',
];
