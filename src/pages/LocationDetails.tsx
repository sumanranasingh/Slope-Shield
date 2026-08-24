import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLocationById, locations, getRiskColor, getRiskBgColor } from '../data/locations'
import ReportPreviewModal from '../components/modals/ReportPreviewModal'
import CreateWarningModal from '../components/modals/CreateWarningModal'
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
} from 'lucide-react'

export default function LocationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find location by id or fallback to first location
  const location = (id ? getLocationById(id) : null) || locations[0]

  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)

  // 7-day soil telemetry mock data for this location
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
            </div>
            <p className="text-xs text-navy-400">
              {location.district} District • {location.state} • Coordinates: {location.coordinates[0]}° N, {location.coordinates[1]}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsWarningModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold text-xs border border-red-500/40 flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Issue Warning</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/20"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Site Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Risk & Forecasts) | Right Column (AI & Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Circular Risk Gauge & Key Physical Attributes */}
        <div className="space-y-6">
          {/* Circular Risk Gauge Card (Prompt Specification) */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-6 text-center card-hover flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 mb-4">
              Current Geospatial Risk Index
            </span>

            {/* Circular Gauge Graphic */}
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="10"
                />
                {/* Value Stroke */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - location.riskScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Content */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {location.riskScore}
                </span>
                <span className="text-xs text-navy-400 font-medium">/ 100</span>
                <span
                  className="text-[11px] font-extrabold uppercase tracking-widest mt-0.5"
                  style={{ color }}
                >
                  {location.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-navy-400 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-navy-700">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Data Coverage: <strong className="text-white">{location.dataCoverage}%</strong> active sensors</span>
            </div>
          </div>

          {/* 24h / 48h / 72h Predictive Forecast (Prompt Specification) */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Predictive Risk Trajectory
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-navy-900/80 p-3 rounded-lg border border-navy-700/50 text-center">
                <span className="text-[10px] text-navy-400 uppercase font-semibold block mb-1">
                  24-Hour
                </span>
                <span className="text-xl font-extrabold text-red-400">
                  {location.forecast.hours24}
                </span>
                <span className="text-[10px] text-navy-500 block">/ 100</span>
              </div>

              <div className="bg-navy-900/80 p-3 rounded-lg border border-navy-700/50 text-center">
                <span className="text-[10px] text-navy-400 uppercase font-semibold block mb-1">
                  48-Hour
                </span>
                <span className="text-xl font-extrabold text-orange-400">
                  {location.forecast.hours48}
                </span>
                <span className="text-[10px] text-navy-500 block">/ 100</span>
              </div>

              <div className="bg-navy-900/80 p-3 rounded-lg border border-navy-700/50 text-center">
                <span className="text-[10px] text-navy-400 uppercase font-semibold block mb-1">
                  72-Hour
                </span>
                <span className="text-xl font-extrabold text-yellow-400">
                  {location.forecast.hours72}
                </span>
                <span className="text-[10px] text-navy-500 block">/ 100</span>
              </div>
            </div>
          </div>

          {/* Location Terrain Attributes (Prompt Specification) */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3 text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-emerald-400" />
              Terrain & Geology Profile
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-navy-900/80">
                <span className="text-navy-400">Slope Gradient:</span>
                <span className="font-bold text-white">{location.slope}° (Steep)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900/80">
                <span className="text-navy-400">Elevation:</span>
                <span className="font-bold text-white">{location.elevation} m MSL</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900/80">
                <span className="text-navy-400">Land Cover Class:</span>
                <span className="font-bold text-white">{location.landCover}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900/80">
                <span className="text-navy-400">Geological Formation:</span>
                <span className="font-bold text-cyan-400">{location.geologicalClass}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle & Right Columns (AI Explainability, Action Protocol, Soil Telemetry & History) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendation Banner (Prompt Specification) */}
          <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-navy-900 border border-blue-500/30 rounded-xl p-5 card-hover">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  AI Action Protocol & Field Directive
                </h3>
                <p className="text-xs text-navy-400">Prescribed operational procedures for road and disaster teams</p>
              </div>
            </div>
            <p className="text-xs text-navy-200 leading-relaxed font-medium bg-navy-950/70 p-3.5 rounded-lg border border-navy-800 mt-3">
              {location.aiRecommendation}
            </p>
          </div>

          {/* AI Feature Contribution Bars (Prompt Specification) */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Primary Risk Factor Contributions
            </h3>

            <div className="space-y-3.5">
              {location.riskFactors.map((factor) => (
                <div key={factor.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-navy-200 font-medium">{factor.name}</span>
                    <span className="font-bold text-white">{factor.contribution}% contribution</span>
                  </div>
                  <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden border border-navy-700/50">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${factor.contribution * 2.5}%`,
                        backgroundColor: factor.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Rainfall & Soil Moisture Telemetry Chart */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-700/50">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                7-Day Soil Saturation & Precipitation Telemetry
              </h3>
              <span className="text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Pore Pressure Critical
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    name="Soil Saturation %"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#moistureGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Landslide Events Timeline (Prompt Specification) */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Recorded Historical Landslide Events ({location.historicalEvents.length})
            </h3>

            {location.historicalEvents.length === 0 ? (
              <p className="text-xs text-navy-400 italic">No historical major slope failures recorded at this monitoring station.</p>
            ) : (
              <div className="relative border-l-2 border-navy-700 ml-3 pl-5 space-y-4">
                {location.historicalEvents.map((evt, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-navy-900 group-hover:scale-125 transition-transform" />

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{evt.date}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {evt.type}
                      </span>
                      <span className="text-[10px] text-navy-400 font-semibold">• Severity: {evt.severity}</span>
                    </div>

                    <p className="text-xs text-navy-300 leading-relaxed bg-navy-900/60 p-2.5 rounded-lg border border-navy-800">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportPreviewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <CreateWarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onCreateWarning={handleCreateWarning}
      />
    </div>
  )
}
