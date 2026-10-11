// =====================================================================
// FUNCIONES UTILITARIAS
// =====================================================================
import { CAR_COLORS } from '../constants/simulation';

/** Genera una placa aleatoria tipo "ABC-123" */
export function randomPlate(): string {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const N = '0123456789';
  const letter = () => L[Math.floor(Math.random() * L.length)];
  const digit  = () => N[Math.floor(Math.random() * N.length)];
  return `${letter()}${letter()}${letter()}-${digit()}${digit()}${digit()}`;
}

/** Elige un color hex aleatorio para un auto */
export function randomCarColor(): string {
  return CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
}

/** Formatea milisegundos de simulación a una cadena legible */
export function formatSimTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

/** Formatea un número como moneda */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
