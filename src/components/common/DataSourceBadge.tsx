import type { DataSource } from '../../types/risk';

const config: Record<DataSource, { label: string; class: string; dot: string }> = {
  LIVE:       { label: 'Live',        class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  FORECAST:   { label: 'Forecast',    class: 'bg-blue-500/15 text-blue-400 border-blue-500/30',         dot: 'bg-blue-400' },
  HISTORICAL: { label: 'Historical',  class: 'bg-amber-500/15 text-amber-400 border-amber-500/30',      dot: 'bg-amber-400' },
  DEMO:       { label: 'Development', class: 'bg-purple-500/15 text-purple-400 border-purple-500/30',   dot: 'bg-purple-400' },
};

interface Props {
  source: DataSource;
  provider?: string;
  className?: string;
}

export default function DataSourceBadge({ source, provider, className = '' }: Props) {
  const c = config[source];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${c.class} ${className}`}
      title={provider ? `Provider: ${provider}` : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${source === 'LIVE' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}
