# AutoLavado Sim — Simulación de Autolavado

Aplicación web interactiva desarrollada para simular y analizar el flujo de atención vehicular en un autolavado con 4 estaciones de servicio en secuencia, cálculo de métricas en tiempo real y detección de cuellos de botella.

Demo en línea (Vercel): https://autolavado-app-ten.vercel.app  
Repositorio (GitHub): https://github.com/pierina120126/simulacion-de-autolavado  

---

## Estaciones del Proceso

El autolavado opera mediante 4 estaciones en serie. Cada una cumple una función específica dentro del ciclo:

| # | Estación | Función Principal | Tiempo Base |
|---|----------|-------------------|:-----------:|
| 1 | **Llegada** | Recepción e ingreso de vehículos al sistema | 3 seg |
| 2 | **Aspirado** | Limpieza y aspirado del interior del auto | 8 seg |
| 3 | **Lavado** | Enjabonado y lavado exterior a presión | 15 seg |
| 4 | **Secado** | Secado con turbinas de aire y entrega | 10 seg |

---

## Estados de las Estaciones

Cada estación cuenta con indicadores visuales que reflejan su condición operativa en cada segundo:

* **LIBRE:** La estación está desocupada y disponible para recibir el siguiente vehículo.
* **OCUPADO:** La estación se encuentra procesando activamente un auto.
* **BLOQUEADO:** La estación terminó su trabajo pero no puede transferir el auto porque la siguiente estación sigue ocupada (cuello de botella).

---

## Panel de Métricas

La simulación calcula y actualiza en tiempo real los siguientes indicadores de rendimiento:

* **Ingresos Totales:** Ganancias acumuladas por los vehículos atendidos.
* **Vehículos Atendidos:** Cantidad total de autos que completaron el circuito.
* **Cuello de Botella:** Porcentaje y detección automática de la estación más congestionada.
* **Utilización por Estación:** Porcentaje de tiempo que cada estación se mantuvo ocupada.
* **Tiempo Promedio de Servicio:** Duración media que tarda un vehículo en completar todo el proceso.

---

## Opciones y Controles de la Simulación

* **Tasa de llegada:** Configuración del intervalo de llegada de vehículos (de 5 a 60 segundos).
* **Estaciones activas:** Permite seleccionar cuántas estaciones participan en la simulación (de 1 a 4).
* **Control de velocidad:** Opciones para acelerar o ralentizar el tiempo (0.25x, 0.5x, 1x, 2x, 5x, 10x).
* **Botones de control:** Opciones para Iniciar, Pausar y Reiniciar (Reset) el flujo completo.

---

## Tecnologías Utilizadas

* **React 19:** Componentes y gestión del estado reactivo de la simulación.
* **TypeScript:** Estructura y tipos de datos del modelo operativo.
* **Vite:** Herramienta de compilación y servidor de desarrollo.
* **Tailwind CSS:** Diseño de la interfaz, panel oscuro y adaptación responsiva.
* **Vercel:** Despliegue y alojamiento en la nube.

---

## Estructura del Proyecto

```text
├── public/                 # Iconos y recursos estáticos
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Estaciones, controles y dashboard
│   ├── constants/          # Tiempos base y configuración inicial
│   ├── types/              # Tipos e interfaces de TypeScript
│   ├── utils/              # Funciones auxiliares y cálculos de métricas
│   ├── App.tsx             # Componente principal de la simulación
│   └── main.tsx            # Punto de entrada de React
├── index.html              # Archivo principal de la aplicación
├── package.json            # Dependencias y scripts del proyecto
├── tsconfig.json           # Configuración del compilador TypeScript
└── vite.config.ts          # Configuración del empaquetador Vite


Vista Previa de la Interfaz
┌─────────────────────────────────────────────────────────────┐
│  AutoLavado Sim             [ Iniciar ]  [ Reset ]          │
├─────────────────────────────────────────────────────────────┤
│  Ingresos: $250.00   Atendidos: 10   Cuello: 82% Lavado     │
├─────────────────────────────────────────────────────────────┤
│  Llegada   -->   Aspirado   -->   Lavado   -->   Secado     │
│  [ LIBRE ]       [ OCUPADO ]     [ OCUPADO ]     [ LIBRE ]  │
└─────────────────────────────────────────────────────────────┘

## Autora

**Pierina** — Proyecto de Simulación de Procesos  
Licencia MIT © 2026
