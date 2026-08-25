import { useState } from 'react'
import KPICards from '../components/dashboard/KPICards'
import LiveRiskMap from '../components/dashboard/LiveRiskMap'
import RoadRiskMonitor from '../components/dashboard/RoadRiskMonitor'
import WhatIfSimulator from '../components/dashboard/WhatIfSimulator'
import AIExplanationCard from '../components/dashboard/AIExplanationCard'
import SatellitePreviewCard from '../components/dashboard/SatellitePreviewCard'
import RiskAnalyticsCharts from '../components/dashboard/RiskAnalyticsCharts'
import EarlyWarningPanel from '../components/dashboard/EarlyWarningPanel'
import ReportPreviewModal from '../components/modals/ReportPreviewModal'
import DataSourceBadge from '../components/common/DataSourceBadge'
import ErrorState from '../components/common/ErrorState'
import { useDashboard } from '../hooks/useDashboard'
import { generateMockReport, MockReport } from '../data/reports'
import { LocationData } from '../data/locations'
import {
  Radio,
  ShieldAlert,
  Activity,
  FileText,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import type { Warning } from '../types'

export default function Dashboard() {
  const { data: summary, isLoading, error, retry } = useDashboard()
  const [rainfallMultiplier, setRainfallMultiplier] = useState(1.0)
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)

  const handleGenerateWarningReport = (warning: Warning) => {
    const report = generateMockReport('daily-risk')
    report.title = `Special Risk Advisory: ${warning.location} (${warning.severity})`
    report.summary = `Priority alert issued for ${warning.location}, ${warning.state}. Trigger: ${warning.trigger}. Risk score: ${warning.riskScore}/100. Recommended immediate action: ${warning.recommendedAction}`
    setSelectedReport(report)
  }

  const actions = summary?.actionsRequired || []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Live System Operational Status Bar */}
      <div className="bg-navy-950/70 border border-navy-800/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">SYSTEM OPERATIONAL:</span>
            <span className="text-navy-300">
              {summary?.totalMonitoredLocations ?? 16} Monitored Sectors Online
            </span>
          </div>
          <span className="hidden md:inline text-navy-600">|</span>
          <div className="hidden md:flex items-center gap-2 text-navy-400">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>Weather Telemetry: {summary?.systemStatus?.weatherProviderStatus ?? 'Active'}</span>
          </div>
          <span className="hidden lg:inline text-navy-600">|</span>
          <div className="hidden lg:flex items-center gap-2 text-navy-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>ML Engine: {summary?.systemStatus?.mlModelVersion ?? 'rf-ner-v1.0'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <DataSourceBadge
            source={summary?.dataSource?.source ?? 'DEMO'}
            provider={summary?.dataSource?.provider ?? 'SlopeShield Command Telemetry'}
          />

          <button
            onClick={() => setSelectedReport(generateMockReport('daily-risk'))}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quick Daily Report</span>
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Backend Telemetry Sync Degraded"
          message={`Using cached development state (${error}). Click retry to reconnect.`}
          onRetry={retry}
        />
      )}

      {/* Priority Action Required Alert Banner */}
      {actions.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Priority Action Required
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">
                  {actions[0].priority === 'immediate' ? 'Immediate Response' : 'Urgent Inspection'}
                </span>
              </div>
              <p className="text-xs text-navy-200 mt-0.5">
                <span className="font-semibold text-white">{actions[0].locationName} ({actions[0].state}):</span>{' '}
                {actions[0].action}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const rep = generateMockReport('daily-risk')
              rep.title = `Incident Action Directive: ${actions[0].locationName}`
              rep.summary = `Mandatory operational response initiated for ${actions[0].locationName}. Risk score: ${actions[0].riskScore}/100. Action required: ${actions[0].action}`
              setSelectedReport(rep)
            }}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-end md:self-auto"
          >
            <span>Dispatch Directive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <KPICards summary={summary} isLoading={isLoading} />

      {/* Interactive What-If Rainfall Scenario Simulator */}
      <WhatIfSimulator
        rainfallMultiplier={rainfallMultiplier}
        onChangeMultiplier={setRainfallMultiplier}
      />

      {/* Main Live GIS Risk Map */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-blue-500" />
            Live Geospatial Risk Map &amp; Highway Overlay
          </h2>
          <span className="text-xs text-navy-400">Click any marker or corridor to inspect</span>
        </div>
        <LiveRiskMap
          rainfallMultiplier={rainfallMultiplier}
          selectedLocationId={selectedLocation?.id}
          onSelectLocation={setSelectedLocation}
        />
      </section>

      {/* Road Risk Monitoring */}
      <section className="space-y-2">
        <RoadRiskMonitor />
      </section>

      {/* 2-Column Section: AI Explainability Card & Satellite Change Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIExplanationCard initialLocationId={selectedLocation?.id || 'loc-002'} />
        <SatellitePreviewCard />
      </div>

      {/* Active Early Warnings List */}
      <section className="space-y-2">
        <EarlyWarningPanel onGenerateReport={handleGenerateWarningReport} />
      </section>

      {/* Risk Analytics Charts */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-navy-700/50 pb-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-purple-500" />
            Risk Intelligence &amp; Predictive Telemetry
          </h2>
          <span className="text-xs text-navy-400">Random Forest Ensemble • 8 States</span>
        </div>
        <RiskAnalyticsCharts />
      </section>

      {/* Report Preview Modal */}
      <ReportPreviewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  )
}
