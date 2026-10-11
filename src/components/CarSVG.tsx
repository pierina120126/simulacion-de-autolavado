// =====================================================================
// CarSVG — Representación visual de un automóvil
// =====================================================================
interface CarSVGProps {
  color?: string;
  small?: boolean;
  animated?: boolean;
}

export function CarSVG({ color = '#3b82f6', small = false, animated = false }: CarSVGProps) {
  const w = small ? 32 : 48;
  const h = small ? 20 : 30;

  return (
    <svg
      width={w} height={h}
      viewBox="0 0 100 60"
      className={animated ? 'car-bounce' : ''}
    >
      {/* Carrocería */}
      <rect x="8"  y="20" width="84" height="28" rx="7" fill={color} />
      {/* Techo */}
      <rect x="20" y="6"  width="60" height="20" rx="9" fill={color} opacity="0.82" />
      {/* Parabrisas delantero */}
      <rect x="57" y="8"  width="20" height="15" rx="4" fill="#bae6fd" opacity="0.75" />
      {/* Parabrisas trasero */}
      <rect x="25" y="8"  width="20" height="15" rx="4" fill="#bae6fd" opacity="0.75" />
      {/* Ruedas */}
      <circle cx="24" cy="48" r="10" fill="#1e293b" />
      <circle cx="24" cy="48" r="5"  fill="#64748b" />
      <circle cx="76" cy="48" r="10" fill="#1e293b" />
      <circle cx="76" cy="48" r="5"  fill="#64748b" />
      {/* Faros delanteros */}
      <rect x="89" y="25" width="6" height="7" rx="2" fill="#fef08a" opacity="0.95" />
      {/* Luces traseras */}
      <rect x="5"  y="25" width="5" height="7" rx="2" fill="#fca5a5" opacity="0.9"  />
    </svg>
  );
}
