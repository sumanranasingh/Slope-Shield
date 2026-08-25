import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWarnings } from '../../hooks/useWarnings'
import { warningApi } from '../../services/warningApi'
import {
  AlertTriangle,
  FileText,
  Eye,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react'
import type { Warning } from '../../types'
import { severityBadgeClass } from '../../types/warning'

interface EarlyWarningPanelProps {
  onGenerateReport?: (warning: Warning) => void
}

export default function EarlyWarningPanel({ onGenerateReport }: EarlyWarningPanelProps) {
  const { data: warningsData, isLoading, retry } = useWarnings({ status: 'Active' })
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([])

  const warnings = warningsData || []
  const activeWarnings = warnings.slice(0, 4)

  const handleAcknowledge = async (id: string) => {
    try {
      await warningApi.acknowledge(id)
      setAcknowledgedIds((prev) => [...prev, id])
    } catch {
      // optimistic local
      setAcknowledgedIds((prev) => [...prev, id])
    }
  }

  return (
    <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Active Early Warnings
              </h3>
              <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                {warnings.length} Active
              </span>
            </div>
            <p className="text-xs text-navy-400">
              High-priority alerts requiring disaster authority response
            </p>
          </div>
        </div>

        <Link
          to="/early-warnings"
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>All Warnings ({warnings.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Warnings List */}
      {isLoading && activeWarnings.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-navy-900/80 rounded-xl p-4 border border-navy-700/60 space-y-2">
              <div className="h-4 w-1/3 bg-navy-700/60 rounded" />
              <div className="h-3 w-3/4 bg-navy-700/40 rounded" />
            </div>
          ))}
        </div>
      ) : activeWarnings.length === 0 ? (
        <div className="bg-navy-900/40 rounded-xl p-6 text-center text-xs text-navy-400 border border-navy-800">
          No active critical warnings. All monitored sectors within normal thresholds.
        </div>
      ) : (
        <div className="space-y-3">
          {activeWarnings.map((warning) => {
            const isAck = acknowledgedIds.includes(warning.id) || warning.status === 'Acknowledged'
            return (
              <div
                key={warning.id}
                className="bg-navy-900/80 border border-navy-700/60 hover:border-navy-600 rounded-xl p-4 transition-all"
              >
                {/* Top row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${severityBadgeClass(
                        warning.severity
                      )}`}
                    >
                      {warning.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{warning.location}</span>
                    <span className="text-xs text-navy-400">• {warning.state}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs">
                      <span className="text-navy-500">Risk: </span>
                      <span className="font-bold text-red-400">{warning.riskScore}/100</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-navy-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(warning.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trigger */}
                <div className="mb-2">
                  <div className="text-[11px] text-navy-400">
                    <span className="text-navy-500 font-semibold uppercase tracking-wider text-[10px]">
                      Trigger:{' '}
                    </span>
                    <span className="text-navy-200">{warning.trigger}</span>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="bg-navy-950/70 p-2.5 rounded-lg border border-navy-800 mb-3 text-xs">
                  <span className="text-blue-400 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                    Recommended Action:
                  </span>
                  <p className="text-navy-300 text-xs leading-relaxed">{warning.recommendedAction}</p>
                </div>

                {/* Buttons: View Location, Acknowledge, Report */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-navy-800">
                  <span className="text-[10px] text-navy-500">
                    Affected Area: <span className="text-navy-300">{warning.affectedArea}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {!isAck ? (
                      <button
                        onClick={() => handleAcknowledge(warning.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1 transition-colors"
                      >
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Acknowledged</span>
                      </span>
                    )}

                    <Link
                      to={`/locations/${warning.locationId || 'loc-001'}`}
                      className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-navy-200 text-xs font-medium border border-navy-700 flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Link>

                    <button
                      onClick={() => {
                        if (onGenerateReport) onGenerateReport(warning)
                      }}
                      className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold border border-blue-500/40 flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
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
