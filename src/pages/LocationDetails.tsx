import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLocationById, locations, getRiskColor, getRiskBgColor } from '../data/locations'
import { useLocationDetail } from '../hooks/useLocations'
import ReportPreviewModal from '../components/modals/ReportPreviewModal'
import CreateWarningModal from '../components/modals/CreateWarningModal'
import DataSourceBadge from '../components/common/DataSourceBadge'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import { generateMockReport, MockReport } from '../data/reports'
import { WarningData } from '../data/warnings'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  MapPin,
  ChevronLeft,
  Calendar,
  CloudRain,
  Mountain,
  Layers,
  Compass,
  FileText,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Sparkles,
  Activity,
  History,
  CheckCircle,
  Share2,
  Cpu,
} from 'lucide-react'

export default function LocationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: detailData, isLoading, error, retry } = useLocationDetail(id)

  const fallbackLoc = (id ? getLocationById(id) : null) || locations[0]
  const location = detailData || fallbackLoc

  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)

  // 7-day soil telemetry data for this location
  const telemetryData = [
    { day: 'Day -6', rainfall: Math.round(location.rainfallMm * 0.4), moisture: 45 },
    { day: 'Day -5', rainfall: Math.round(location.rainfallMm * 0.6), moisture: 52 },
    { day: 'Day -4', rainfall: Math.round(location.rainfallMm * 0.5), moisture: 58 },
    { day: 'Day -3', rainfall: Math.round(location.rainfallMm * 0.8), moisture: 68 },
    { day: 'Day -2', rainfall: Math.round(location.rainfallMm * 0.9), moisture: 78 },
    { day: 'Yesterday', rainfall: Math.round(location.rainfallMm * 1.1), moisture: 85 },
    { day: 'Today', rainfall: location.rainfallMm, moisture: 92 },
  ]

  const handleGenerateReport = () => {
    const r = generateMockReport('district-risk')
    r.title = `Site Geotechnical Audit: ${location.name}`
    r.summary = `Detailed stability assessment for ${location.name}, ${location.district} District, ${location.state}. Slope: ${location.slope}°, Elevation: ${location.elevation}m, 24h Rainfall: ${location.rainfallMm}mm. Overall risk score evaluated at ${location.riskScore}/100.`
    setSelectedReport(r)
  }

  const handleCreateWarning = (warning: WarningData) => {
    alert(`Early warning broadcast initiated for ${location.name}!`)
  }

  const color = getRiskColor(location.riskLevel)

  if (isLoading && !detailData) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <LoadingState message={`Retrieving intelligence dossier for location ${id}...`} rows={6} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div className="flex items-center gap-3">
          <Link
            to="/locations"
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white border border-navy-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{location.name}</h1>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider border ${getRiskBgColor(
                  location.riskLevel
                )}`}
              >
                {location.riskLevel}
              </span>
              <DataSourceBadge source="LIVE" provider="NER Telemetry Grid" />
            </div>
            <p className="text-xs text-navy-400">
              {location.district} District • {location.state} • Coordinates: {location.coordinates[0]}° N, {location.coordinates[1]}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsWarningModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-semibold text-xs border border-red-500/40 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Issue Warning</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/25"
          >
            <FileText className="w-4 h-4" />
            <span>Export Audit Dossier</span>
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Live Telemetry Sync Unavailable"
          message={`Operating in development seed mode (${error}).`}
          onRetry={retry}
        />
      )}

      {/* Top 4 Quick Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Evaluated Risk Score</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {location.riskScore} <span className="text-xs font-normal text-navy-500">/100</span>
          </div>
          <div className="text-[11px] text-navy-400 mt-1">
            Band: <span className="font-semibold text-red-400">{location.riskLevel} Hazard</span>
          </div>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>24h Precipitation</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">{location.rainfallMm} mm</div>
          <div className="text-[11px] text-navy-400 mt-1">{location.rainfall} Precipitation Index</div>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Slope Geometry</span>
            <Mountain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{location.slope}°</div>
          <div className="text-[11px] text-navy-400 mt-1">Elev: {location.elevation}m ASL</div>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Historical Failures</span>
            <History className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{location.historicalEvents?.length ?? 0}</div>
          <div className="text-[11px] text-navy-400 mt-1">Documented Events on Record</div>
        </div>
      </div>

      {/* Main 2-Column Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Telemetry Charts, Forecast & Historical Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* 7-Day Rainfall & Soil Moisture Curve */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  7-Day Rainfall vs. Soil Saturation Telemetry
                </h3>
              </div>
              <span className="text-[11px] text-navy-400">Antecedent Moisture Threshold</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rainfall"
                    name="Rainfall (mm)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#rainGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    name="Soil Saturation (%)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#moistGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* In-Situ IoT Sensors Panel */}
          {detailData?.sensors && detailData.sensors.length > 0 && (
            <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    In-Situ Geotechnical Instrumentation Telemetry
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Active Sensors Deployed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {detailData.sensors.map((s) => (
                  <div key={s.id} className="bg-navy-900/80 p-3.5 rounded-lg border border-navy-700/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-navy-400 font-medium truncate">{s.type}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${s.readingStatus === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {s.readingStatus}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {s.currentReading} <span className="text-xs text-navy-400 font-normal">{s.unit}</span>
                    </div>
                    <div className="text-[10px] text-navy-500">{s.dataFreshness}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictive 72h Forecast Horizon */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-700/50">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                72-Hour Landslide Risk Trajectory Forecast
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-navy-900/80 p-4 rounded-xl border border-navy-700/60">
                <span className="text-[11px] text-navy-400 block mb-1">Next 24 Hours</span>
                <span className="text-2xl font-extrabold text-red-400">
                  {location.forecast?.hours24 ?? location.riskScore}
                </span>
                <span className="text-[10px] text-navy-500 block mt-1">High Probability Failure</span>
              </div>
              <div className="bg-navy-900/80 p-4 rounded-xl border border-navy-700/60">
                <span className="text-[11px] text-navy-400 block mb-1">Next 48 Hours</span>
                <span className="text-2xl font-extrabold text-orange-400">
                  {location.forecast?.hours48 ?? Math.max(0, location.riskScore - 5)}
                </span>
                <span className="text-[10px] text-navy-500 block mt-1">Elevated Instability</span>
              </div>
              <div className="bg-navy-900/80 p-4 rounded-xl border border-navy-700/60">
                <span className="text-[11px] text-navy-400 block mb-1">Next 72 Hours</span>
                <span className="text-2xl font-extrabold text-yellow-400">
                  {location.forecast?.hours72 ?? Math.max(0, location.riskScore - 12)}
                </span>
                <span className="text-[10px] text-navy-500 block mt-1">Post-Monsoon Receding</span>
              </div>
            </div>
          </div>

          {/* Historical Landslide Activity Archive */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-700/50">
              <History className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Historical Disaster &amp; Slope Failure Log
              </h3>
            </div>

            <div className="space-y-3">
              {location.historicalEvents && location.historicalEvents.length > 0 ? (
                location.historicalEvents.map((evt, i) => (
                  <div
                    key={i}
                    className="bg-navy-900/70 p-3.5 rounded-lg border border-navy-700/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{evt.type}</span>
                        <span className="text-navy-500">•</span>
                        <span className="text-navy-400">{evt.date}</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px]">
                          {evt.severity}
                        </span>
                      </div>
                      <p className="text-navy-300 text-xs">{evt.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-navy-400 py-4 text-center">
                  No previous recorded catastrophic failures at this specific station.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: AI Explainability, Geology & Recommended Action */}
        <div className="space-y-6">
          {/* AI Recommended Mitigation Action */}
          <div className="bg-navy-800/60 border border-blue-500/30 rounded-xl p-5 card-hover space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-navy-700/50">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Recommendation
              </h3>
            </div>
            <p className="text-xs text-navy-200 leading-relaxed">
              {location.aiRecommendation ||
                'Deploy emergency geotechnical team for tension crack mapping. Pre-position heavy equipment.'}
            </p>
            <div className="pt-2 border-t border-navy-700/40 flex items-center justify-between text-[10px] text-navy-400">
              <span>Engine: Random Forest v1.0</span>
              <span>Priority: Level 1 Emergency</span>
            </div>
          </div>

          {/* Contributing Risk Factor Weights */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-navy-700/50">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Risk Attribution
              </h3>
            </div>

            <div className="space-y-3">
              {location.riskFactors && location.riskFactors.length > 0 ? (
                location.riskFactors.map((rf) => (
                  <div key={rf.name} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-navy-300">{rf.name}</span>
                      <span className="font-bold text-white">{rf.contribution}%</span>
                    </div>
                    <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${rf.contribution * 2.5}%`,
                          backgroundColor: rf.color || '#3b82f6',
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-navy-400">Factors computed dynamically by ML service.</div>
              )}
            </div>
          </div>

          {/* Geotechnical Terrain Specifications */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-navy-700/50">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Geological Profile
              </h3>
            </div>

            <div className="space-y-2 text-xs divide-y divide-navy-700/40">
              <div className="flex justify-between pt-1">
                <span className="text-navy-400">Geological Bedrock</span>
                <span className="font-semibold text-white">{location.geologicalClass}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-navy-400">Land Cover / Canopy</span>
                <span className="font-semibold text-white">{location.landCover}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-navy-400">Station Data Coverage</span>
                <span className="font-semibold text-emerald-400">{location.dataCoverage}% Telemetry</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-navy-400">InSAR Surface Drift</span>
                <span className="font-semibold text-cyan-400">-14.2 mm/yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportPreviewModal report={selectedReport} onClose={() => setSelectedReport(null)} />

      {/* Warning Modal */}
      <CreateWarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onCreateWarning={handleCreateWarning}
        preselectedLocation={location.id}
      />
    </div>
  )
}
