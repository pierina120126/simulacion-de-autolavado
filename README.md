# 🚗 AutoLavado Sim — Simulación de Autolavado

![AutoLavado Sim](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)

> Aplicación web interactiva para simular el proceso de un autolavado con 4 estaciones en secuencia, métricas en tiempo real y visualización del flujo de vehículos.

## ✨ Características

### 🏭 Estaciones de Proceso (4 en secuencia)
| # | Estación | Icono | Tiempo Base |
|---|----------|-------|-------------|
| 1 | Llegada | 📥 | 3 seg |
| 2 | Aspirado | 🌀 | 8 seg |
| 3 | Lavado | 🫧 | 15 seg |
| 4 | Secado | 🌬️ | 10 seg |

### 🎨 Estados Visuales
- 🟢 **LIBRE** — Estación disponible
- 🔴 **OCUPADO** — Estación procesando un vehículo
- 🟡 **BLOQUEADO** — Cola de espera saturada

### 📊 Dashboard de Métricas en Tiempo Real
- 💰 **Total de Ingresos** durante la simulación
- 🧾 **Facturas Totales** / Servicios completados
- ⚠️ **Porcentaje de Cuello de Botella** (% con estación identificada)
- 📊 **Utilización por Estación** (%)
- ⏱️ **Tiempo Promedio de Servicio** por vehículo
- ⚡ **Controles de Velocidad**: 0.25x, 0.5x, 1x, 2x, 5x, 10x

### 🎮 Controles de Simulación
- Ajuste de **tasa de llegada** de vehículos (5s a 60s entre autos)
- Selección de **número de estaciones activas** (1 a 4)
- Control de **velocidad de simulación** con botones y atajos
- Botón **Iniciar / Pausar / Reset**

## 🚀 Deploy

### Opción 1: Abrir directamente
```bash
# Solo abre el archivo en tu navegador
start index.html
```

### Opción 2: GitHub Pages
```bash
git init
git add .
git commit -m "feat: AutoLavado Sim v1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/autolavado-sim.git
git push -u origin main
# Activa GitHub Pages en Settings → Pages → Branch: main
```

### Opción 3: Vercel (1 click)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Sube el repositorio a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Selecciona **Framework: Other** y despliega

## 🛠️ Tecnologías
- **React 18** (via CDN — sin build step)
- **Tailwind CSS** (via CDN)
- **Babel Standalone** (JSX en navegador)
- **HTML5 + CSS3** puro con animaciones

## 📁 Estructura
```
autolavado-sim/
├── index.html        # App completa (todo-en-uno)
├── vercel.json       # Config de Vercel
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## 📸 Vista Previa

```
┌─────────────────────────────────────────────────────────────┐
│  🚗 AutoLavado Sim          [▶ Iniciar] [↺ Reset] [⚙️]      │
├─────────────────────────────────────────────────────────────┤
│  💰 $250.00   🧾 10 servicios   ⚠️ 82% Lavado   ⏱️ 36s      │
├─────────────────────────────────────────────────────────────┤
│  📥 Llegada  →  🌀 Aspirado  →  🫧 Lavado  →  🌬️ Secado    │
│  [LIBRE 🟢]    [OCUPADO 🔴]   [OCUPADO 🔴]  [LIBRE 🟢]     │
└─────────────────────────────────────────────────────────────┘
```

## 📄 Licencia
MIT © 2025
