import { useState } from 'react'
import { Link } from 'react-router-dom'
import { states, getRiskColor, getRiskBgColor } from '../data/locations'
import { useLocations } from '../hooks/useLocations'
import DataSourceBadge from '../components/common/DataSourceBadge'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import {
  MapPin,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react'
import type { Location } from '../types'

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [selectedRisk, setSelectedRisk] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortField, setSortField] = useState<'riskScore' | 'rainfallMm' | 'slope' | 'name'>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: locationsData, isLoading, error, retry } = useLocations({
    state: selectedState !== 'All' ? selectedState : undefined,
    risk_level: selectedRisk !== 'All' ? selectedRisk : undefined,
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
  })

  const rawLocations = locationsData || []

  // Filter
  const filteredLocations = rawLocations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.geologicalClass.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesState = selectedState === 'All' || loc.state === selectedState
    const matchesRisk = selectedRisk === 'All' || loc.riskLevel.toLowerCase() === selectedRisk.toLowerCase()
    const matchesStatus = selectedStatus === 'All' || loc.status.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesState && matchesRisk && matchesStatus
  })

  // Sort
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]

    if (typeof valA === 'string') {
      return sortOrder === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string)
    }
    return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number)
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedLocations.length / pageSize))
  const paginatedLocations = sortedLocations.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (field: 'riskScore' | 'rainfallMm' | 'slope' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const exportCSV = () => {
    const headers = 'ID,Name,District,State,Risk Score,Risk Level,Rainfall (mm),Slope (deg),Status\n'
    const rows = sortedLocations
      .map(
        (l) =>
          `"${l.id}","${l.name}","${l.district}","${l.state}",${l.riskScore},"${l.riskLevel}",${l.rainfallMm},${l.slope},"${l.status}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slopeshield-locations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Monitored Risk Locations &amp; Assets
              </h1>
              <p className="text-xs text-navy-400">
                {rawLocations.length} active geotechnical telemetry and slope monitoring stations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <DataSourceBadge source="DEMO" provider="SlopeShield Station Network" />
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-200 hover:text-white font-semibold text-xs border border-navy-700 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Telemetry Feed Sync Error"
          message={error}
          onRetry={retry}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-navy-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search location, geology..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All States (NER)</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical (80-100)</option>
              <option value="High">High (60-79)</option>
              <option value="Moderate">Moderate (40-59)</option>
              <option value="Low">Low (0-39)</option>
            </select>
          </div>

          {/* Operational Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Alert">Alert</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-navy-400 pt-2 border-t border-navy-700/40">
          <span>Showing {sortedLocations.length} locations matching filters</span>
          {(selectedState !== 'All' || selectedRisk !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState('All')
                setSelectedRisk('All')
                setSelectedStatus('All')
                setSearchQuery('')
              }}
              className="text-blue-400 hover:underline text-[11px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Locations Table */}
      {isLoading ? (
        <LoadingState message="Fetching regional slope telemetry..." rows={5} />
      ) : sortedLocations.length === 0 ? (
        <EmptyState
          title="No Monitored Locations Found"
          message="No telemetry stations match your query. Try broadening your filter criteria."
        />
      ) : (
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900/80 text-navy-400 font-semibold border-b border-navy-700/50">
                <tr>
                  <th
                    className="p-3.5 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Location &amp; District</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">State</th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('riskScore')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Risk Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Geology &amp; Cover</th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('rainfallMm')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>24h Rainfall</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="p-3.5 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('slope')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Slope</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/40">
                {paginatedLocations.map((loc) => {
                  const color = getRiskColor(loc.riskLevel)
                  return (
                    <tr key={loc.id} className="hover:bg-navy-750/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs">{loc.name}</div>
                        <div className="text-[11px] text-navy-400">{loc.district}</div>
                      </td>
                      <td className="p-3.5 text-navy-300 font-medium">{loc.state}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                              border: `1px solid ${color}40`,
                            }}
                          >
                            {loc.riskLevel}
                          </span>
                          <span className="font-bold text-white">{loc.riskScore}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-white text-[11px] font-medium">{loc.geologicalClass}</div>
                        <div className="text-[10px] text-navy-400">{loc.landCover}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-cyan-400">{loc.rainfallMm} mm</div>
                        <div className="text-[10px] text-navy-400">{loc.rainfall}</div>
                      </td>
                      <td className="p-3.5 text-navy-300 font-semibold">{loc.slope}°</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            loc.status === 'Alert'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : loc.status === 'Monitoring'
                              ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {loc.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          to={`/locations/${loc.id}`}
                          className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold text-xs border border-blue-500/40 inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-navy-900/80 px-4 py-3 border-t border-navy-700/50 flex items-center justify-between text-xs">
            <span className="text-navy-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-navy-800 border border-navy-700 text-navy-300 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-navy-800 border border-navy-700 text-navy-300 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
