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
import { generateMockReport, MockReport } from '../data/reports'
import { WarningData } from '../data/warnings'
import { LocationData } from '../data/locations'
import { Radio, ShieldAlert, Sparkles, Activity, Download, FileText } from 'lucide-react'

export default function Dashboard() {
  const [rainfallMultiplier, setRainfallMultiplier] = useState(1.0)
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)

  const handleGenerateWarningReport = (warning: WarningData) => {
    const report = generateMockReport('daily-risk')
    report.title = `Special Risk Advisory: ${warning.location} (${warning.severity})`
    report.summary = `Priority alert issued for ${warning.location}, ${warning.state}. Trigger: ${warning.trigger}. Risk score: ${warning.riskScore}/100. Recommended immediate action: ${warning.recommendedAction}`
    setSelectedReport(report)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Live System Operational Status Bar */}
      <div className="bg-navy-950/70 border border-navy-800/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">SYSTEM OPERATIONAL:</span>
            <span className="text-navy-300">All 247 Telemetry Stations Online</span>
          </div>
          <span className="hidden md:inline text-navy-600">|</span>
          <div className="hidden md:flex items-center gap-2 text-navy-400">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>IMD Doppler Radar: Synced</span>
          </div>
          <span className="hidden lg:inline text-navy-600">|</span>
          <div className="hidden lg:flex items-center gap-2 text-navy-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentinel-1 SAR Pass: 14m ago</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedReport(generateMockReport('daily-risk'))}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors ml-auto sm:ml-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Quick Daily Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <KPICards />

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
            Live Geospatial Risk Map & Highway Overlay
          </h2>
          <span className="text-xs text-navy-400">Click any marker or corridor to inspect</span>
        </div>
        <LiveRiskMap
          rainfallMultiplier={rainfallMultiplier}
          selectedLocationId={selectedLocation?.id}
          onSelectLocation={setSelectedLocation}
        />
      </section>

      {/* Road Risk Monitoring — Killer Feature for Authorities */}
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
            Risk Intelligence & Predictive Telemetry
          </h2>
          <span className="text-xs text-navy-400">Real-time XGBoost + IMD Ensemble</span>
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
