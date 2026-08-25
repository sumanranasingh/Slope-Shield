import { useState } from 'react'
import DataSourceBadge from '../components/common/DataSourceBadge'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import { useReports } from '../hooks/useReports'
import { reportApi } from '../services/reportApi'
import {
  FileText,
  Camera,
  Video,
  MapPin,
  Search,
  Plus,
  Clock,
  CheckCircle,
  Eye,
  Filter,
  Upload,
  X,
  AlertTriangle,
  Send,
  RefreshCw,
} from 'lucide-react'
import type { CitizenReport, ReportSeverity } from '../types'

type ReportStatus = 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'ACTIONED' | 'RESOLVED'
type ReportCategory =
  | 'landslide'
  | 'rockfall'
  | 'mudslide'
  | 'road_blockage'
  | 'crack_observed'
  | 'water_seepage'
  | 'subsidence'
  | 'other'

const statusConfig: Record<ReportStatus, { label: string; class: string; icon: typeof Clock }> = {
  NEW: { label: 'New', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: Plus },
  UNDER_REVIEW: { label: 'Under Review', class: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: Eye },
  VERIFIED: { label: 'Verified', class: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', icon: CheckCircle },
  ACTIONED: { label: 'Actioned', class: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: AlertTriangle },
  RESOLVED: { label: 'Resolved', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
}

const categoryLabels: Record<ReportCategory, string> = {
  landslide: 'Landslide',
  rockfall: 'Rockfall',
  mudslide: 'Mudslide',
  road_blockage: 'Road Blockage',
  crack_observed: 'Crack Observed',
  water_seepage: 'Water Seepage',
  subsidence: 'Subsidence',
  other: 'Other Observation',
}

export default function CitizenReports() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data: reportsData, isLoading, error, retry } = useReports({
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [category, setCategory] = useState<ReportCategory>('landslide')
  const [severity, setSeverity] = useState<ReportSeverity>('High')
  const [description, setDescription] = useState('')
  const [latitude, setLatitude] = useState('27.534')
  const [longitude, setLongitude] = useState('92.122')
  const [locationName, setLocationName] = useState('Sela Pass Approach')
  const [reporterName, setReporterName] = useState('Field Officer (BRO / SDRF)')
  const [reporterPhone, setReporterPhone] = useState('+91-9876543210')

  const reports: CitizenReport[] = reportsData || []

  const filtered = reports.filter((r) => {
    const loc = r.locationName || ''
    const matchSearch =
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await reportApi.create({
        category,
        severity,
        description,
        latitude: parseFloat(latitude) || 27.534,
        longitude: parseFloat(longitude) || 92.122,
        locationName,
        reporterName,
        reporterPhone,
      })
      setShowCreateForm(false)
      setDescription('')
      retry()
    } catch {
      retry()
      setShowCreateForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: ReportStatus) => {
    try {
      await reportApi.update(id, { status: newStatus as any })
      retry()
    } catch {
      retry()
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Citizen &amp; Field Reports</h1>
              <p className="text-xs text-navy-400">
                Community and field officer ground-truth observations &amp; incident reports
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <DataSourceBadge source="DEMO" provider="Field Telemetry Ingestion" />
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25"
          >
            {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showCreateForm ? 'Cancel Form' : 'Submit Field Report'}</span>
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Field Report Feed Error"
          message={`Using cached observations (${error}).`}
          onRetry={retry}
        />
      )}

      {/* Submission Form Modal/Panel */}
      {showCreateForm && (
        <div className="bg-navy-800/80 border border-blue-500/40 rounded-xl p-5 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-700">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Ground-Truth Incident Report Submission
              </h3>
            </div>
            <span className="text-[10px] text-navy-400">GPS Auto-Location Enabled</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-navy-300 font-semibold mb-1">Hazard Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {Object.entries(categoryLabels).map(([val, lbl]) => (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-navy-300 font-semibold mb-1">Assessed Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Critical">Critical (Immediate Hazard)</option>
                  <option value="High">High (Impending Failure)</option>
                  <option value="Moderate">Moderate (Active Seepage / Minor Crack)</option>
                  <option value="Low">Low (Precautionary)</option>
                </select>
              </div>

              <div>
                <label className="block text-navy-300 font-semibold mb-1">Sector / Landmark</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-navy-300 font-semibold mb-1">Latitude (°N)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-navy-300 font-semibold mb-1">Longitude (°E)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-navy-300 font-semibold mb-1">Reporter Name / Role</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-navy-300 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-navy-300 font-semibold mb-1">
                Detailed Field Description &amp; Visual Observations
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe slope condition, road blockage, water seepage, or tension crack dimensions..."
                rows={3}
                className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2.5 text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-navy-700">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-750 text-navy-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Transmit Report'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status Filter Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.entries(statusConfig) as [ReportStatus, typeof statusConfig[ReportStatus]][]).map(([key, cfg]) => {
          const count = reports.filter((r) => r.status === key).length
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === key
                  ? 'bg-navy-700/80 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-navy-800/60 border-navy-700/60 hover:border-navy-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${cfg.class}`}>
                  {cfg.label}
                </span>
                <cfg.icon className="w-3.5 h-3.5 text-navy-400" />
              </div>
              <div className="text-xl font-bold text-white">{count}</div>
            </button>
          )
        })}
      </div>

      {/* Reports Feed */}
      {isLoading ? (
        <LoadingState message="Loading field report repository..." rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Field Reports Match Filter"
          message="No citizen or patrol observations found matching current criteria."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const st = (statusConfig[r.status as ReportStatus] || statusConfig.NEW)
            return (
              <div
                key={r.id}
                className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${st.class}`}>
                      {st.label}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-navy-900 text-cyan-300 text-[10px] font-semibold border border-navy-700">
                      {categoryLabels[r.category as ReportCategory] || r.category}
                    </span>
                    <span className="text-xs font-bold text-white">{r.locationName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-navy-400">
                    <span>Reporter: <strong className="text-white">{r.reporterName}</strong></span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-navy-200 leading-relaxed bg-navy-900/60 p-3 rounded-lg border border-navy-700/50">
                  {r.description}
                </p>

                {/* Workflow Transitions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-navy-700/40 text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-navy-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Coordinates: {r.latitude.toFixed(3)}°N, {r.longitude.toFixed(3)}°E</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {r.status === 'NEW' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'UNDER_REVIEW')}
                        className="px-2.5 py-1 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-semibold border border-yellow-500/40 transition-colors"
                      >
                        Review
                      </button>
                    )}
                    {r.status === 'UNDER_REVIEW' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'VERIFIED')}
                        className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors"
                      >
                        Verify Hazard
                      </button>
                    )}
                    {r.status === 'VERIFIED' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'ACTIONED')}
                        className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/40 transition-colors"
                      >
                        Dispatch Crew
                      </button>
                    )}
                    {r.status === 'ACTIONED' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'RESOLVED')}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
