import { MapPin, AlertTriangle, Bell, Database, TrendingUp, TrendingDown } from 'lucide-react'

const kpis = [
  {
    label: 'Monitored Locations',
    value: '247',
    trend: '+12',
    trendUp: true,
    description: 'Active monitoring stations across NE India',
    icon: MapPin,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    label: 'High-Risk Locations',
    value: '18',
    trend: '+3',
    trendUp: true,
    description: 'Locations above risk threshold of 65',
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    label: 'Active Warnings',
    value: '7',
    trend: '+2',
    trendUp: true,
    description: 'Warnings requiring immediate attention',
    icon: Bell,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    label: 'Data Coverage',
    value: '92.4%',
    trend: '+1.2%',
    trendUp: true,
    description: 'Sensor and satellite data availability',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
]

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={kpi.label}
          className={`bg-navy-800/60 border ${kpi.borderColor} rounded-xl p-5 card-hover animate-fade-in stagger-${i + 1}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${kpi.bgColor} p-2.5 rounded-lg`}>
              <kpi.icon className={`w-5 h-5 bg-gradient-to-r ${kpi.color} bg-clip-text`} style={{ color: kpi.color.includes('blue') ? '#3b82f6' : kpi.color.includes('orange') ? '#f97316' : kpi.color.includes('red') ? '#ef4444' : '#22c55e' }} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trendUp ? (kpi.label === 'Data Coverage' ? 'text-emerald-400' : 'text-orange-400') : 'text-emerald-400'}`}>
              {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.trend}
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
          <div className="text-xs text-navy-400 font-medium mb-1">{kpi.label}</div>
          <div className="text-[11px] text-navy-500">{kpi.description}</div>
        </div>
      ))}
    </div>
  )
}
