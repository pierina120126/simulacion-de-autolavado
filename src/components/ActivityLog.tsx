// =====================================================================
// ActivityLog — Registro de eventos en tiempo real
// =====================================================================
import { useEffect, useRef } from 'react';
import type { SimEvent } from '../types/simulation';

interface ActivityLogProps {
  events: SimEvent[];
  onClear: () => void;
}

export function ActivityLog({ events, onClear }: ActivityLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último evento
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
          <span>📋</span> Actividad Reciente
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Limpiar
        </button>
      </div>

      <div ref={logRef} className="h-36 overflow-y-auto space-y-1 pr-1">
        {events.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-6">
            Inicia la simulación para ver eventos...
          </p>
        ) : (
          events.map((e, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-xs py-1 px-2 rounded fade-in-up ${
                e.type === 'arrival'  ? 'bg-blue-500/10 text-blue-300'    :
                e.type === 'complete' ? 'bg-emerald-500/10 text-emerald-300' :
                'bg-slate-700/50 text-slate-400'
              }`}
            >
              <span className="flex-1">{e.msg}</span>
              <span className="text-slate-600 shrink-0">
                {new Date(e.time).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
