// =====================================================================
// HOOK PRINCIPAL DE SIMULACIÓN  (useSimulation)
// =====================================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type {
  Station, Vehicle, CompletedVehicle,
  SimMetrics, BottleneckInfo, SimEvent, SimSpeed,
} from '../types/simulation';
import {
  STATION_NAMES, STATION_EMOJIS, STATION_ICONS,
  BASE_SERVICE_TIMES, REVENUE_PER_CAR, TICK_MS,
} from '../constants/simulation';
import { randomPlate, randomCarColor } from '../utils/helpers';

// ── helpers internos ──────────────────────────────────────────────────
const makeInitialStations = (): Station[] =>
  STATION_NAMES.map((name, i) => ({
    id: i,
    name,
    emoji: STATION_EMOJIS[i],
    icon:  STATION_ICONS[i],
    status: 'free',
    currentVehicle: null,
    queue: [],
    busyTime: 0,
    totalTime: 0,
    processedCount: 0,
    serviceProgress: 0,
  }));

const makeInitialMetrics = (): SimMetrics => ({
  totalRevenue: 0,
  completedServices: 0,
  totalServiceTime: 0,
  simulationTime: 0,
  vehicleIdCounter: 0,
});

// ─────────────────────────────────────────────────────────────────────
export interface UseSimulationReturn {
  isRunning:        boolean;
  setIsRunning:     (v: boolean | ((prev: boolean) => boolean)) => void;
  speed:            SimSpeed;
  setSpeed:         (s: SimSpeed) => void;
  arrivalRate:      number;
  setArrivalRate:   (n: number) => void;
  activeStations:   number;
  setActiveStations:(n: number) => void;
  vehicles:         Vehicle[];
  stations:         Station[];
  metrics:          SimMetrics;
  completedVehicles:CompletedVehicle[];
  recentEvent:      SimEvent | null;
  bottleneck:       BottleneckInfo;
  utilizationByStation: number[];
  avgServiceTime:   number;
  reset:            () => void;
}

// ─────────────────────────────────────────────────────────────────────
export function useSimulation(): UseSimulationReturn {
  const [isRunning,       setIsRunning]       = useState(false);
  const [speed,           setSpeed]           = useState<SimSpeed>(1);
  const [arrivalRate,     setArrivalRate]     = useState(15); // segundos entre autos
  const [activeStations,  setActiveStations]  = useState(4);
  const [vehicles,        setVehicles]        = useState<Vehicle[]>([]);
  const [stations,        setStations]        = useState<Station[]>(makeInitialStations());
  const [metrics,         setMetrics]         = useState<SimMetrics>(makeInitialMetrics());
  const [completedVehicles, setCompletedVehicles] = useState<CompletedVehicle[]>([]);
  const [recentEvent,     setRecentEvent]     = useState<SimEvent | null>(null);

  // Refs para acceder a los valores más recientes dentro de callbacks sin re-crear intervalos
  const metricsRef        = useRef(metrics);
  const speedRef          = useRef(speed);
  const activeRef         = useRef(activeStations);
  metricsRef.current      = metrics;
  speedRef.current        = speed;
  activeRef.current       = activeStations;

  // ── Agregar nuevo vehículo ──────────────────────────────────────────
  const addVehicle = useCallback(() => {
    const newId  = metricsRef.current.vehicleIdCounter + 1;
    const vehicle: Vehicle = {
      id:             newId,
      name:           `#${String(newId).padStart(3, '0')}`,
      plate:          randomPlate(),
      color:          randomCarColor(),
      currentStation: 0,
      startTime:      metricsRef.current.simulationTime,
      arrivalTime:    metricsRef.current.simulationTime,
      status:         'waiting',
    };

    setMetrics(m => ({ ...m, vehicleIdCounter: newId }));
    setVehicles(v => [...v, vehicle]);
    setRecentEvent({ type: 'arrival', msg: `🚗 Auto ${vehicle.name} (${vehicle.plate}) llegó`, time: Date.now() });

    // Encolar en la primera estación activa
    setStations(prev => {
      const next = prev.map(s => ({ ...s, queue: [...s.queue] }));
      next[0].queue.push(vehicle);
      return next;
    });
  }, []);

  // ── Tick de simulación ──────────────────────────────────────────────
  const processTick = useCallback(() => {
    const spd    = speedRef.current;
    const active = activeRef.current;
    const tickDelta = TICK_MS * spd; // ms simulación por tick real

    setStations(prev => {
      const next: Station[] = prev.map(s => ({
        ...s,
        queue: [...s.queue],
      }));

      for (let i = 0; i < active; i++) {
        const st = next[i];

        // ── Procesar vehículo en curso ──────────────────────────────
        if (st.currentVehicle) {
          const tickPct = (TICK_MS / (BASE_SERVICE_TIMES[i] / spd)) * 100;
          st.serviceProgress = Math.min(100, st.serviceProgress + tickPct);
          st.busyTime += TICK_MS;

          if (st.serviceProgress >= 100) {
            const done = st.currentVehicle;
            st.currentVehicle  = null;
            st.serviceProgress = 0;
            st.processedCount += 1;

            if (i === active - 1) {
              // Última estación → auto completado
              setMetrics(m => ({
                ...m,
                totalRevenue:      m.totalRevenue + REVENUE_PER_CAR,
                completedServices: m.completedServices + 1,
                totalServiceTime:  m.totalServiceTime + (metricsRef.current.simulationTime - done.startTime),
              }));
              setCompletedVehicles(cv => [
                ...cv.slice(-19),
                { ...done, endTime: metricsRef.current.simulationTime },
              ]);
              setVehicles(v => v.filter(vv => vv.id !== done.id));
              setRecentEvent({
                type: 'complete',
                msg:  `✅ Auto ${done.name} completado (+$${REVENUE_PER_CAR})`,
                time: Date.now(),
              });
            } else {
              // Mover a la siguiente estación
              next[i + 1].queue.push(done);
            }
          }
        }

        // ── Tomar siguiente de la cola si la estación quedó libre ───
        if (!st.currentVehicle && st.queue.length > 0) {
          const next_v = st.queue.shift()!;
          st.currentVehicle  = next_v;
          st.serviceProgress = 0;
          // Actualizar estación del vehículo
          setVehicles(v =>
            v.map(vv => vv.id === next_v.id ? { ...vv, currentStation: i, status: 'processing' } : vv)
          );
        }

        // ── Calcular totalTime y status ─────────────────────────────
        st.totalTime += TICK_MS;

        if (st.currentVehicle) {
          st.status = 'busy';
        } else if (st.queue.length > 0) {
          st.status = 'blocked';
        } else {
          st.status = 'free';
        }
      }

      // Estaciones inactivas
      for (let i = active; i < next.length; i++) {
        next[i].status = 'idle';
        next[i].currentVehicle = null;
      }

      return next;
    });

    setMetrics(m => ({ ...m, simulationTime: m.simulationTime + tickDelta }));
  }, []);

  // ── Intervalo principal (tick) ──────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(processTick, TICK_MS);
    return () => clearInterval(id);
  }, [isRunning, processTick]);

  // ── Intervalo de llegada de vehículos ───────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const interval = Math.max(500, (arrivalRate * 1000) / speed);
    const id = setInterval(addVehicle, interval);
    return () => clearInterval(id);
  }, [isRunning, arrivalRate, speed, addVehicle]);

  // ── Reset ───────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setIsRunning(false);
    setVehicles([]);
    setCompletedVehicles([]);
    setMetrics(makeInitialMetrics());
    setStations(makeInitialStations());
    setRecentEvent(null);
  }, []);

  // ── Cálculos derivados ──────────────────────────────────────────────
  const utilizationByStation = useMemo<number[]>(
    () => stations.map(s => s.totalTime > 0 ? Math.min(100, (s.busyTime / s.totalTime) * 100) : 0),
    [stations]
  );

  const bottleneck = useMemo<BottleneckInfo>(() => {
    const actives = utilizationByStation.slice(0, activeStations);
    if (actives.every(u => u === 0)) return { stationId: -1, pct: 0 };
    const maxPct = Math.max(...actives);
    return { stationId: actives.indexOf(maxPct), pct: maxPct };
  }, [utilizationByStation, activeStations]);

  const avgServiceTime = useMemo<number>(() => {
    if (metrics.completedServices === 0) return 0;
    return metrics.totalServiceTime / metrics.completedServices / 1000;
  }, [metrics]);

  return {
    isRunning, setIsRunning,
    speed, setSpeed,
    arrivalRate, setArrivalRate,
    activeStations, setActiveStations,
    vehicles, stations, metrics,
    completedVehicles, recentEvent,
    bottleneck, utilizationByStation,
    avgServiceTime, reset,
  };
}
