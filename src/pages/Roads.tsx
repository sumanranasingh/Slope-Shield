import { useState } from 'react'
import { getRiskBgColor, getRiskColor } from '../data/locations'
import { useRoads } from '../hooks/useRoads'
import DataSourceBadge from '../components/common/DataSourceBadge'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import {
  Compass,
  Search,
  Filter,
  AlertTriangle,
  ShieldCheck,
  Construction,
  Clock,
  ChevronRight,
  Eye,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import type { RoadSegment } from '../types'

export default function Roads() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [sortField, setSortField] = useState<'riskScore' | 'name' | 'lengthKm'>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: roadsData, isLoading, error, retry } = useRoads()
  const allSegments: RoadSegment[] = roadsData || []

  const filtered = allSegments.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.highwayCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    const matchRisk = riskFilter === 'All' || s.riskLevel === riskFilter
    return matchSearch && matchStatus && matchRisk
  })

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortField] as number | string
    const vb = b[sortField] as number | string
    if (typeof va === 'string') return sortOrder === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
    return sortOrder === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
  })

  const handleSort = (field: 'riskScore' | 'name' | 'lengthKm') => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('desc') }
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'Open': return 'text-emerald-400'
      case 'Restricted': return 'text-orange-400'
      case 'Closed': return 'text-red-400'
      case 'Under Inspection': return 'text-yellow-400'
      default: return 'text-navy-400'
    }
  }

  const priorityBadge = (p?: string, score: number = 50, status: string = 'Open') => {
    const priority = p || (status === 'Closed' || score >= 80 ? 'P1 — Immediate' : score >= 60 ? 'P2 — High' : score >= 40 ? 'P3 — Monitor' : 'P4 — Normal')
    if (priority.startsWith('P1')) {
      return <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold tracking-wider">{priority}</span>
    } else if (priority.startsWith('P2')) {
      return <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold tracking-wider">{priority}</span>
    } else if (priority.startsWith('P3')) {
      return <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-extrabold tracking-wider">{priority}</span>
    }
    return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold tracking-wider">{priority}</span>
  }

  const closedCount = allSegments.filter(s => s.status === 'Closed' || s.status === 'Under Inspection').length
  const criticalCount = allSegments.filter(s => s.riskLevel === 'Critical').length
  const highCount = allSegments.filter(s => s.riskLevel === 'High').length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Infrastructure &amp; Road Monitoring
              </h1>
              <p className="text-xs text-navy-400">
                Highway corridor risk assessment, response prioritization &amp; blockage mitigation
              </p>
            </div>
          </div>
        </div>
        <DataSourceBadge source="LIVE" provider="BRO &amp; NHIDCL Highway Telemetry" />
      </div>

      {error && (
        <ErrorState
          title="Corridor Telemetry Sync Error"
          message={`Operating with cached highway segment data (${error}).`}
          onRetry={retry}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1">Total Segments</div>
          <div className="text-2xl font-extrabold text-white">{allSegments.length}</div>
        </div>
        <div className="bg-navy-800/60 border border-red-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1">Critical Risk</div>
          <div className="text-2xl font-extrabold text-white">{criticalCount}</div>
        </div>
        <div className="bg-navy-800/60 border border-orange-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider mb-1">High Risk</div>
          <div className="text-2xl font-extrabold text-white">{highCount}</div>
        </div>
        <div className="bg-navy-800/60 border border-yellow-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider mb-1">Restricted/Closed</div>
          <div className="text-2xl font-extrabold text-yellow-400">{closedCount}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-navy-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by highway code, name, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Restricted">Restricted</option>
            <option value="Closed">Closed</option>
            <option value="Under Inspection">Under Inspection</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Segments Table */}
      {isLoading ? (
        <LoadingState message="Loading road network status..." rows={5} />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="No Road Corridors Found"
          message="No highway segments match the search filters."
        />
      ) : (
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900/80 text-navy-400 font-semibold border-b border-navy-700/50">
                <tr>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Highway / Corridor</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">State</th>
                  <th className="p-3.5">Stretch</th>
                  <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('lengthKm')}>
                    <div className="flex items-center gap-1">
                      <span>Length</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('riskScore')}>
                    <div className="flex items-center gap-1">
                      <span>Risk</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Authority</th>
                  <th className="p-3.5 text-right">Action Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/40">
                {sorted.map((s) => {
                  const color = getRiskColor(s.riskLevel)
                  return (
                    <tr key={s.id} className="hover:bg-navy-750/50 transition-colors">
                      <td className="p-3.5 whitespace-nowrap">
                        {priorityBadge(s.priority as string, s.riskScore, s.status)}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs">{s.highwayCode}</div>
                        <div className="text-[11px] text-navy-400">{s.name}</div>
                      </td>
                      <td className="p-3.5 text-navy-300 font-medium">{s.state}</td>
                      <td className="p-3.5 text-navy-400 text-[11px]">
                        {s.startPoint} ➔ {s.endPoint}
                      </td>
                      <td className="p-3.5 text-navy-300 font-semibold">{s.lengthKm} km</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                            style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
                          >
                            {s.riskLevel}
                          </span>
                          <span className="font-bold text-white">{s.riskScore}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`font-semibold ${statusColor(s.status)}`}>{s.status}</span>
                      </td>
                      <td className="p-3.5 text-navy-400 text-[11px]">{s.authority}</td>
                      <td className="p-3.5 text-right text-[11px] text-navy-300 max-w-[220px] truncate">
                        {s.recommendedAction || 'Pre-position maintenance teams.'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
