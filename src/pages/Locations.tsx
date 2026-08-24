import { useState } from 'react'
import { Link } from 'react-router-dom'
import { locations, LocationData, states, getRiskColor, getRiskBgColor } from '../data/locations'
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

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [selectedRisk, setSelectedRisk] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortField, setSortField] = useState<'riskScore' | 'rainfallMm' | 'slope' | 'name'>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Filter
  const filteredLocations = locations.filter((loc) => {
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
    let valA = a[sortField]
    let valB = b[sortField]

    if (typeof valA === 'string') {
      return sortOrder === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string)
    }
    return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number)
  })

  // Pagination
  const totalPages = Math.ceil(sortedLocations.length / pageSize)
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
                Monitored Risk Locations & Assets
              </h1>
              <p className="text-xs text-navy-400">
                247 active slope monitoring stations and critical infrastructure nodes
              </p>
            </div>
          </div>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-200 hover:text-white font-semibold text-xs border border-navy-700 flex items-center gap-2 transition-colors self-start sm:self-center"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export Dataset (CSV)</span>
        </button>
      </div>

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
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="All">All States (8 Regions)</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical (85–100)</option>
              <option value="High">High (68–84)</option>
              <option value="Moderate">Moderate (45–67)</option>
              <option value="Low">Low (0–44)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-navy-900 border border-navy-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Operational Statuses</option>
              <option value="Alert">Alert (High Activity)</option>
              <option value="Monitoring">Monitoring (Normal)</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-navy-700/50 text-xs text-navy-400">
          <span>Found {sortedLocations.length} locations matching criteria</span>
          <span>Sorted by {sortField} ({sortOrder.toUpperCase()})</span>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/90 text-navy-300 uppercase tracking-wider text-[10px] font-bold border-b border-navy-700/80">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Location & District</span>
                    <ArrowUpDown className="w-3 h-3 text-navy-500" />
                  </div>
                </th>
                <th className="px-4 py-3.5">State</th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Risk Score (0–100)</span>
                    <ArrowUpDown className="w-3 h-3 text-navy-500" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Risk Level</th>
                <th
                  onClick={() => handleSort('rainfallMm')}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>24h Rainfall</span>
                    <ArrowUpDown className="w-3 h-3 text-navy-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('slope')}
                  className="px-4 py-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Slope / Elev</span>
                    <ArrowUpDown className="w-3 h-3 text-navy-500" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Geological Class</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {paginatedLocations.map((loc) => {
                const color = getRiskColor(loc.riskLevel)
                return (
                  <tr
                    key={loc.id}
                    className="table-row-hover transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <Link to={`/locations/${loc.id}`} className="block">
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-navy-400">{loc.district} District</div>
                      </Link>
                    </td>

                    <td className="px-4 py-3.5 text-navy-300 font-medium">{loc.state}</td>

                    <td className="px-4 py-3.5">
                      <div className="w-36">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="font-extrabold text-white">{loc.riskScore}</span>
                          <span className="text-[10px] text-navy-500">/100</span>
                        </div>
                        <div className="w-full bg-navy-950 h-1.5 rounded-full overflow-hidden border border-navy-700/50">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${loc.riskScore}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRiskBgColor(
                          loc.riskLevel
                        )}`}
                      >
                        {loc.riskLevel}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-cyan-400">{loc.rainfallMm} mm</span>
                      <span className="text-[10px] text-navy-500 block">{loc.rainfall}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-white font-medium">{loc.slope}°</span>
                      <span className="text-[10px] text-navy-500 block">{loc.elevation}m</span>
                    </td>

                    <td className="px-4 py-3.5 text-navy-400 text-[11px] max-w-[140px] truncate">
                      {loc.geologicalClass}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          loc.status === 'Alert'
                            ? 'text-red-400'
                            : loc.status === 'Monitoring'
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            loc.status === 'Alert'
                              ? 'bg-red-400 animate-ping'
                              : loc.status === 'Monitoring'
                              ? 'bg-yellow-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        {loc.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        to={`/locations/${loc.id}`}
                        className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold text-xs border border-blue-500/30 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-navy-900/80 px-4 py-3 border-t border-navy-700/60 flex items-center justify-between text-xs">
          <div className="text-navy-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedLocations.length)} of{' '}
            {sortedLocations.length} locations
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:pointer-events-none text-navy-300 hover:text-white border border-navy-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-bold px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:pointer-events-none text-navy-300 hover:text-white border border-navy-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
