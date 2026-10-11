// =====================================================================
// TIPOS CENTRALES DE LA SIMULACIÓN DE AUTOLAVADO
// =====================================================================

/** Estado posible de una estación */
export type StationStatus = 'free' | 'busy' | 'blocked' | 'idle';

/** Velocidades permitidas de simulación */
export type SimSpeed = 0.25 | 0.5 | 1 | 2 | 5 | 10;

/** Representa un vehículo dentro del sistema */
export interface Vehicle {
  id: number;
  name: string;       // Ej. "#001"
  plate: string;      // Placa aleatoria
  color: string;      // Color hex del auto
  currentStation: number;
  startTime: number;  // Tiempo de simulación al ingresar
  arrivalTime: number;
  status: 'waiting' | 'processing';
}

/** Vehículo que ya completó todo el proceso */
export interface CompletedVehicle extends Vehicle {
  endTime: number;
}

/** Representa una estación de servicio */
export interface Station {
  id: number;
  name: string;
  emoji: string;
  icon: string;
  status: StationStatus;
  currentVehicle: Vehicle | null;
  queue: Vehicle[];
  busyTime: number;   // ms acumulados ocupada
  totalTime: number;  // ms totales activa
  processedCount: number;
  serviceProgress: number; // 0–100 %
}

/** Métricas globales de la simulación */
export interface SimMetrics {
  totalRevenue: number;
  completedServices: number;
  totalServiceTime: number;  // suma de tiempos de cada auto
  simulationTime: number;    // ms de simulación transcurridos
  vehicleIdCounter: number;
}

/** Resultado del cálculo del cuello de botella */
export interface BottleneckInfo {
  stationId: number;  // -1 si no hay
  pct: number;
}

/** Evento de actividad reciente */
export interface SimEvent {
  type: 'arrival' | 'complete' | 'info';
  msg: string;
  time: number; // timestamp real
}
