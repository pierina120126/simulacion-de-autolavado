// =====================================================================
// MetricCard — Tarjeta de métrica individual del Dashboard
// =====================================================================
interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
}

const COLOR_MAP: Record<string, string> = {
  blue:   'from-blue-600/20   to-blue-900/20   border-blue-700/50   text-blue-400',
  green:  'from-emerald-600/20 to-emerald-900/20 border-emerald-700/50 text-emerald-400',
  purple: 'from-purple-600/20 to-purple-900/20 border-purple-700/50 text-purple-400',
  orange: 'from-orange-600/20 to-orange-900/20 border-orange-700/50 text-orange-400',
  red:    'from-red-600/20    to-red-900/20    border-red-700/50    text-red-400',
  cyan:   'from-cyan-600/20   to-cyan-900/20   border-cyan-700/50   text-cyan-400',
};

export function MetricCard({
  icon, label, value, subValue, color = 'blue',
}: MetricCardProps) {
  return (
    <div className={`metric-card rounded-xl p-4 border bg-gradient-to-br ${COLOR_MAP[color]}`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-white mt-2 leading-none">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
      {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
    </div>
  );
}
