import { MapPin, AlertTriangle, Bell, Compass, TrendingUp, TrendingDown } from 'lucide-react'
import type { DashboardSummary } from '../../types'

interface KPICardsProps {
  summary?: DashboardSummary | null
  isLoading?: boolean
}

export default function KPICards({ summary, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 space-y-3 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-lg bg-navy-700/60" />
              <div className="w-12 h-3 rounded bg-navy-700/40" />
            </div>
            <div className="h-7 w-20 bg-navy-700/60 rounded" />
            <div className="h-3 w-32 bg-navy-700/40 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const monitored = summary?.totalMonitoredLocations ?? 16
  const critical = summary?.criticalRiskLocations ?? 2
  const high = summary?.highRiskLocations ?? 4
  const warnings = summary?.activeWarnings ?? 4
  const roads = summary?.affectedRoads ?? 8

  const kpis = [
    {
      label: 'Monitored Sectors',
      value: monitored.toString(),
      trend: `${monitored} active telemetry nodes`,
      trendUp: true,
      description: 'Telemetry and slope sensor stations in NER',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      iconColor: '#3b82f6',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'High & Critical Risk Sectors',
      value: (critical + high).toString(),
      trend: `${critical} Critical • ${high} High`,
      trendUp: false,
      description: 'Locations above threshold of 60 / 100',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      iconColor: '#ef4444',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      label: 'Active Early Warnings',
      value: warnings.toString(),
      trend: summary?.criticalWarnings ? `${summary.criticalWarnings} Red Alerts` : 'Live Broadcast Active',
      trendUp: false,
      description: 'Active CAP advisories requiring operational action',
      icon: Bell,
      color: 'from-red-500 to-rose-600',
      iconColor: '#f97316',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      label: 'Monitored Highway Corridors',
      value: roads.toString(),
      trend: 'NH-13, NH-37, NH-10, NH-40',
      trendUp: true,
      description: 'Strategic highway & rail transportation arteries',
      icon: Compass,
      color: 'from-emerald-500 to-teal-500',
      iconColor: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={kpi.label}
          className={`bg-navy-800/60 border ${kpi.borderColor} rounded-xl p-5 card-hover animate-fade-in stagger-${i + 1}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${kpi.bgColor} p-2.5 rounded-lg`}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.iconColor }} />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-navy-400">
              <span>{kpi.trend}</span>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1 tracking-tight">{kpi.value}</div>
          <div className="text-xs text-navy-300 font-semibold mb-1">{kpi.label}</div>
          <div className="text-[11px] text-navy-500 leading-tight">{kpi.description}</div>
        </div>
      ))}
    </div>
  )
}
