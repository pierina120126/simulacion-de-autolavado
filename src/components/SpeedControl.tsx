// =====================================================================
// SpeedControl — Botones para cambiar velocidad de simulación
// =====================================================================
import type { SimSpeed } from '../types/simulation';
import { SPEED_OPTIONS } from '../constants/simulation';

interface SpeedControlProps {
  speed: SimSpeed;
  setSpeed: (s: SimSpeed) => void;
}

export function SpeedControl({ speed, setSpeed }: SpeedControlProps) {
  const currentIdx = SPEED_OPTIONS.indexOf(speed);

  const decrease = () => {
    if (currentIdx > 0) setSpeed(SPEED_OPTIONS[currentIdx - 1]);
  };
  const increase = () => {
    if (currentIdx < SPEED_OPTIONS.length - 1) setSpeed(SPEED_OPTIONS[currentIdx + 1]);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Bajar velocidad */}
      <button
        onClick={decrease}
        disabled={currentIdx === 0}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600
          disabled:opacity-30 disabled:cursor-not-allowed
          flex items-center justify-center text-white font-bold text-sm transition-colors"
        title="Disminuir velocidad"
      >
        ‹‹
      </button>

      {/* Botones de velocidad */}
      <div className="flex items-center gap-1">
        {SPEED_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
              speed === s
                ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Subir velocidad */}
      <button
        onClick={increase}
        disabled={currentIdx === SPEED_OPTIONS.length - 1}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600
          disabled:opacity-30 disabled:cursor-not-allowed
          flex items-center justify-center text-white font-bold text-sm transition-colors"
        title="Aumentar velocidad"
      >
        ››
      </button>
    </div>
  );
}
