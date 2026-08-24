import { useState } from 'react'
import { Link } from 'react-router-dom'
import { warnings as initialWarnings, WarningData, getSeverityBadge, getSeverityColor } from '../data/warnings'
import { states } from '../data/locations'
import CreateWarningModal from '../components/modals/CreateWarningModal'
import ReportPreviewModal from '../components/modals/ReportPreviewModal'
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
} from 'lucide-react'

export default function EarlyWarnings() {
  const [warningsList, setWarningsList] = useState<WarningData[]>(initialWarnings)
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>('active')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([])

  const handleCreateWarning = (newWarning: WarningData) => {
    setWarningsList([newWarning, ...warningsList])
  }

  const handleAcknowledge = (id: string) => {
    if (!acknowledgedIds.includes(id)) {
      setAcknowledgedIds([...acknowledgedIds, id])
    }
  }

  // Filtered warnings
  const filteredWarnings = warningsList.filter((w) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'active'
        ? w.status === 'Active'
        : w.status === 'Resolved' || w.status === 'Expired'

    const matchesSeverity =
      selectedSeverity === 'all' || w.severity.toLowerCase() === selectedSeverity.toLowerCase()

    const matchesState = selectedState === 'all' || w.state === selectedState

    const matchesSearch =
      w.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.state.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSeverity && matchesState && matchesSearch
  })

  const activeCount = warningsList.filter(w => w.status === 'Active').length
  const criticalCount = warningsList.filter(w => w.status === 'Active' && w.severity === 'Critical').length
  const resolvedCount = warningsList.filter(w => w.status === 'Resolved' || w.status === 'Expired').length

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

        {/* Create Warning Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/25 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Early Warning</span>
        </button>
      </div>

      {/* Warning Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-navy-800/60 border border-red-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1">
            Critical Alerts
          </div>
          <div className="text-2xl font-extrabold text-white flex items-baseline gap-2">
            {criticalCount}
            <span className="text-xs font-normal text-red-400">Red Alerts</span>
          </div>
        </div>

        <div className="bg-navy-800/60 border border-orange-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider mb-1">
            Active Warnings
          </div>
          <div className="text-2xl font-extrabold text-white flex items-baseline gap-2">
            {activeCount}
            <span className="text-xs font-normal text-orange-400">Under Action</span>
          </div>
        </div>

        <div className="bg-navy-800/60 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Resolved (Past 7D)
          </div>
          <div className="text-2xl font-extrabold text-white flex items-baseline gap-2">
            {resolvedCount}
            <span className="text-xs font-normal text-emerald-400">De-escalated</span>
          </div>
        </div>

        <div className="bg-navy-800/60 border border-blue-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
            Avg Detection Lead Time
          </div>
          <div className="text-2xl font-extrabold text-white flex items-baseline gap-2">
            18.4 <span className="text-xs font-normal text-navy-400">Hours Ahead</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs: Active / Resolved / All */}
          <div className="flex items-center bg-navy-900 rounded-lg p-1 border border-navy-700 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-navy-400 hover:text-white'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'resolved'
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-400 hover:text-white'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-400 hover:text-white'
              }`}
            >
              All History ({warningsList.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-navy-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search warnings, triggers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Secondary Filters: Severity & State */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-navy-700/50 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-navy-400">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-white rounded-md px-2 py-1 text-xs"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-navy-400">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-white rounded-md px-2 py-1 text-xs"
            >
              <option value="all">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <span className="text-navy-500 ml-auto">
            Showing {filteredWarnings.length} alerts
          </span>
        </div>
      </div>

      {/* Warning Cards List */}
      <div className="space-y-4">
        {filteredWarnings.map((w) => {
          const isAck = acknowledgedIds.includes(w.id)
          return (
            <div
              key={w.id}
              className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-navy-700/50">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider ${getSeverityBadge(
                      w.severity
                    )}`}
                  >
                    {w.severity}
                  </span>
                  <h3 className="text-base font-bold text-white">{w.location}</h3>
                  <span className="text-xs text-navy-400">({w.state})</span>
                  <span className="text-[10px] text-navy-500 font-mono">ID: {w.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-navy-500 uppercase block">Risk Score</span>
                    <span className="text-base font-bold text-red-400">{w.riskScore}/100</span>
                  </div>
                  <div className="h-6 w-px bg-navy-700" />
                  <div className="text-right text-xs text-navy-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-navy-500" />
                      <span>{new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="text-[10px] text-navy-500">
                      Expires: {new Date(w.expiryTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message & Trigger */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-0.5">
                      Trigger Conditions:
                    </span>
                    <p className="text-xs text-navy-200 font-medium">{w.trigger}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-0.5">
                      Alert Notification:
                    </span>
                    <p className="text-xs text-navy-300 leading-relaxed">{w.message}</p>
                  </div>
                </div>

                <div className="bg-navy-950/70 p-3 rounded-lg border border-navy-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-navy-500">Affected Area:</span>
                    <span className="text-white font-semibold">{w.affectedArea}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-navy-500">Vulnerable Pop:</span>
                    <span className="text-white font-semibold">{w.affectedPopulation.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-navy-500">Issued Authority:</span>
                    <span className="text-cyan-400 font-medium text-[11px]">{w.issuedBy}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="bg-blue-500/10 border border-blue-500/25 p-3 rounded-lg text-xs">
                <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Required Emergency Protocol:
                </span>
                <p className="text-navy-200 leading-relaxed font-medium">
                  {w.recommendedAction}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcknowledge(w.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isAck
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-navy-900 hover:bg-navy-700 text-navy-200 border border-navy-700'
                    }`}
                  >
                    {isAck ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledged by Command</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Acknowledge Warning</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const report = generateMockReport('daily-risk')
                      report.title = `Incident Early Warning Dispatch — ${w.location}`
                      setSelectedReport(report)
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export CAP Bulletin</span>
                  </button>
                </div>

                <Link
                  to={`/locations/${w.locationId}`}
                  className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold border border-navy-700 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Asset Telemetry</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      <CreateWarningModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWarning={handleCreateWarning}
      />

      <ReportPreviewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  )
}
