import { useState } from 'react'
import { Link } from 'react-router-dom'
import { states } from '../data/locations'
import { useWarnings } from '../hooks/useWarnings'
import { warningApi } from '../services/warningApi'
import CreateWarningModal from '../components/modals/CreateWarningModal'
import ReportPreviewModal from '../components/modals/ReportPreviewModal'
import DataSourceBadge from '../components/common/DataSourceBadge'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import { generateMockReport, MockReport } from '../data/reports'
import {
  AlertTriangle,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  FileText,
  Eye,
  Send,
  Radio,
  Check,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import type { Warning } from '../types'
import { severityBadgeClass } from '../types/warning'

export default function EarlyWarnings() {
  const { data: warningsData, isLoading, error, retry } = useWarnings()
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>('active')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([])
  const [escalatedIds, setEscalatedIds] = useState<string[]>([])
  const [resolvedIds, setResolvedIds] = useState<string[]>([])

  const rawWarnings: Warning[] = warningsData || []

  const handleCreateWarning = async (newWarning: any) => {
    try {
      await warningApi.create({
        locationId: newWarning.locationId || 'loc-001',
        severity: newWarning.severity,
        message: newWarning.message || `Hazard alert for ${newWarning.location}`,
        recommendedAction: newWarning.recommendedAction || 'Field inspection recommended',
        affectedArea: newWarning.affectedArea,
        responseTeam: newWarning.responseTeam,
      })
      retry()
    } catch {
      retry()
    }
  }

  const handleAcknowledge = async (id: string) => {
    try {
      await warningApi.acknowledge(id)
      setAcknowledgedIds((prev) => [...prev, id])
    } catch {
      setAcknowledgedIds((prev) => [...prev, id])
    }
  }

  const handleEscalate = async (id: string) => {
    try {
      await warningApi.escalate(id, {
        targetSeverity: 'Critical',
        escalationReason: 'Emergency operations desk escalated threshold due to rapid slope deformation.',
        dispatchedTeam: 'SDRF Tactical Unit + BRO Mobile Clearance Unit',
      })
      setEscalatedIds((prev) => [...prev, id])
      retry()
    } catch {
      setEscalatedIds((prev) => [...prev, id])
    }
  }

  const handleResolve = async (id: string) => {
    try {
      await warningApi.resolve(id)
      setResolvedIds((prev) => [...prev, id])
      retry()
    } catch {
      setResolvedIds((prev) => [...prev, id])
    }
  }

  // Filtered warnings
  const filteredWarnings = rawWarnings.map((w) => {
    if (escalatedIds.includes(w.id)) {
      return { ...w, severity: 'Critical' as const, status: 'Escalated' as const }
    }
    return w
  }).filter((w) => {
    const isResolved = resolvedIds.includes(w.id) || w.status === 'Resolved' || w.status === 'Expired'
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'active'
        ? !isResolved
        : isResolved

    const matchesSeverity =
      selectedSeverity === 'all' || w.severity.toLowerCase() === selectedSeverity.toLowerCase()

    const matchesState = selectedState === 'all' || w.state === selectedState

    const matchesSearch =
      w.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.state.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSeverity && matchesState && matchesSearch
  })

  const activeCount = rawWarnings.filter((w) => !resolvedIds.includes(w.id) && w.status !== 'Resolved').length
  const criticalCount = rawWarnings.filter(
    (w) => !resolvedIds.includes(w.id) && w.status !== 'Resolved' && (w.severity === 'Critical' || escalatedIds.includes(w.id))
  ).length
  const resolvedCount = rawWarnings.filter(
    (w) => resolvedIds.includes(w.id) || w.status === 'Resolved' || w.status === 'Expired'
  ).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Early Warning Operations Hub
              </h1>
              <p className="text-xs text-navy-400">
                CAP Protocol multi-channel emergency broadcast and authority dispatch
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <DataSourceBadge source="LIVE" provider="CAP Emergency Broadcast Engine" />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Early Warning</span>
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Warning Hub Sync Offline"
          message={`Using fallback warning records (${error}).`}
          onRetry={retry}
        />
      )}

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1">
            Active Warnings
          </div>
          <div className="text-2xl font-extrabold text-white">{activeCount}</div>
        </div>
        <div className="bg-navy-800/60 border border-red-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1">
            Critical Level Red
          </div>
          <div className="text-2xl font-extrabold text-red-400">{criticalCount}</div>
        </div>
        <div className="bg-navy-800/60 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Resolved / Expired
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{resolvedCount}</div>
        </div>
        <div className="bg-navy-800/60 border border-blue-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
            Broadcast Protocol
          </div>
          <div className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>CAP-v1.2 &amp; SMS</span>
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-navy-700/50">
          <div className="flex items-center bg-navy-900 rounded-lg p-1 border border-navy-700 text-xs">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'active' ? 'bg-red-600 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'resolved' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'all' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              All Records
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="moderate">Moderate Only</option>
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-navy-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search warnings by location, trigger factor, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Warnings Feed */}
      {isLoading ? (
        <LoadingState message="Loading warning operations feed..." rows={4} />
      ) : filteredWarnings.length === 0 ? (
        <EmptyState
          title="No Warning Records Found"
          message="No active or historical early warnings match the selected filters."
        />
      ) : (
        <div className="space-y-3">
          {filteredWarnings.map((w) => {
            const isAck = acknowledgedIds.includes(w.id) || w.status === 'Acknowledged'
            const isEsc = escalatedIds.includes(w.id) || w.status === 'Escalated'
            const isRes = resolvedIds.includes(w.id) || w.status === 'Resolved'
            return (
              <div
                key={w.id}
                className="bg-navy-800/60 border border-navy-700/60 hover:border-navy-600 rounded-xl p-5 card-hover space-y-3 transition-all"
              >
                {/* Top header line */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${severityBadgeClass(
                        w.severity
                      )}`}
                    >
                      {w.severity}
                    </span>
                    {isEsc && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/40 uppercase">
                        Escalated
                      </span>
                    )}
                    <span className="font-bold text-white text-sm">{w.location}</span>
                    <span className="text-xs text-navy-400">• {w.state}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-navy-400">
                      Evaluated Score: <span className="font-bold text-red-400">{w.riskScore}/100</span>
                    </span>
                    <span className="text-navy-500">•</span>
                    <div className="flex items-center gap-1 text-navy-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(w.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>

                {/* Trigger */}
                <div className="text-xs text-navy-300">
                  <span className="text-navy-500 font-bold uppercase text-[10px] tracking-wider">
                    Physical Trigger:{' '}
                  </span>
                  {w.trigger}
                </div>

                {/* Message */}
                <p className="text-xs text-white leading-relaxed">{w.message}</p>

                {/* Action Box */}
                <div className="bg-navy-900/80 border border-navy-700/60 rounded-lg p-3 text-xs">
                  <span className="text-blue-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                    Statutory Recommended Action Directive:
                  </span>
                  <p className="text-navy-200 text-xs leading-relaxed">{w.recommendedAction}</p>
                </div>

                {/* Bottom row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-700/50 text-xs">
                  <div className="text-navy-400 text-[11px]">
                    Affected: <span className="text-white">{w.affectedArea}</span> • Target: {w.affectedPopulation.toLocaleString('en-IN')} pop
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {!isRes && (
                      <>
                        {!isAck ? (
                          <button
                            onClick={() => handleAcknowledge(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Acknowledged</span>
                          </span>
                        )}

                        {!isEsc && w.severity !== 'Critical' && (
                          <button
                            onClick={() => handleEscalate(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/25 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold border border-red-500/40 flex items-center gap-1 transition-colors"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Escalate</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleResolve(w.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold border border-emerald-500/40 transition-colors"
                        >
                          Resolve Alert
                        </button>
                      </>
                    )}

                    <Link
                      to={`/locations/${w.locationId || 'loc-001'}`}
                      className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-700 text-navy-200 text-xs font-semibold border border-navy-700 flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Sector</span>
                    </Link>

                    <button
                      onClick={() => {
                        const rep = generateMockReport('daily-risk')
                        rep.title = `Special Risk Advisory: ${w.location} (${w.severity})`
                        rep.summary = `Priority alert issued for ${w.location}, ${w.state}. Trigger: ${w.trigger}. Risk score: ${w.riskScore}/100. Action: ${w.recommendedAction}`
                        setSelectedReport(rep)
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Dialogs */}
      <CreateWarningModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWarning={handleCreateWarning}
      />

      <ReportPreviewModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  )
}
