import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { monthlyTrendData, stateRiskData } from '../data/charts'
import {
  BarChart3,
  TrendingUp,
  Brain,
  Layers,
  Calendar,
  Zap,
  Activity,
  ShieldCheck,
  Compass,
  AlertTriangle,
} from 'lucide-react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'monsoon'>('monsoon')

  // Feature Importance data (XGBoost SHAP values)
  const featureImportance = [
    { feature: 'Cumulative 72h Rainfall (mm)', weight: 34, color: '#3b82f6' },
    { feature: 'Digital Elevation Model Slope (°)', weight: 26, color: '#f59e0b' },
    { feature: 'InSAR Satellite Phase Decorrelation', weight: 16, color: '#06b6d4' },
    { feature: 'Historical Landslide Proximity', weight: 12, color: '#ef4444' },
    { feature: 'Lithology / Fault Line Proximity', weight: 8, color: '#8b5cf6' },
    { feature: 'Vegetation NDVI Degradation', weight: 4, color: '#22c55e' },
  ]

  // Infrastructure exposure data
  const infrastructureExposure = [
    { type: 'National Highways (BRO / NHIDCL)', exposed: '342 km', criticalHotspots: 8, riskIndex: 84 },
    { type: 'Hill Railway Corridors (NF Railway)', exposed: '118 km', criticalHotspots: 4, riskIndex: 88 },
    { type: 'Hydroelectric Power Dams (NHPC/NEEPCO)', exposed: '6 Projects', criticalHotspots: 2, riskIndex: 72 },
    { type: 'Vulnerable Rural Settlements', exposed: '42 Villages', criticalHotspots: 14, riskIndex: 91 },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Geospatial Risk Analytics & Machine Learning Telemetry
              </h1>
              <p className="text-xs text-navy-400">
                Multi-factor climate correlation, historical anomaly detection & XGBoost model explainability
              </p>
            </div>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center bg-navy-900 rounded-lg p-1 border border-navy-700 text-xs self-start sm:self-center">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'monsoon', label: 'Monsoon 2026' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`px-3 py-1.5 rounded-md font-semibold text-[11px] transition-all ${
                timeRange === t.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-navy-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Model Prediction Accuracy</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">94.8%</div>
          <p className="text-[10px] text-emerald-400 mt-1">Cross-validated against GSI historical database</p>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Precipitation Threshold</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">142 mm / 24h</div>
          <p className="text-[10px] text-navy-400 mt-1">Triggers high slope failure probability</p>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Highways Under Active Watch</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">342 km</div>
          <p className="text-[10px] text-orange-400 mt-1">12 priority chokepoints flagged</p>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>False Alarm Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">&lt; 3.2%</div>
          <p className="text-[10px] text-navy-400 mt-1">Reduced via InSAR double-verification</p>
        </div>
      </div>

      {/* 2-Column: 12-Month Monsoon Correlation & ML Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 12-Month Historical Landslide vs Rainfall Correlation */}
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-700/50">
            <div>
              <h3 className="text-sm font-bold text-white">12-Month Landslide Risk vs Monthly Rainfall</h3>
              <p className="text-xs text-navy-400">Long-term seasonal monsoon patterns across Northeast India</p>
            </div>
            <span className="text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              IMD Climatology
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  name="Monthly Rainfall (mm)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#rainGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  name="Landslide Incidence Index"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Learning Feature Importance (SHAP values) */}
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-700/50">
            <div>
              <h3 className="text-sm font-bold text-white">AI Feature Importance (XGBoost SHAP Weights)</h3>
              <p className="text-xs text-navy-400">Relative contribution of physical & satellite indicators</p>
            </div>
            <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              SHAP Explainer
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {featureImportance.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-navy-200 font-medium">{item.feature}</span>
                  <span className="font-bold text-white">{item.weight}%</span>
                </div>
                <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden border border-navy-700/50">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.weight * 2.8}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-navy-950/80 p-3 rounded-lg border border-navy-800 mt-5 text-xs text-navy-400">
            <span className="text-white font-semibold block mb-0.5">Model Topology:</span>
            Gradient Boosted Decision Trees trained on 15,000+ Geological Survey of India (GSI) event records, SRTM 30m DEM slope models, and Sentinel-1 Interferometric SAR phase unwrapping.
          </div>
        </div>
      </div>

      {/* Critical Infrastructure Exposure Matrix */}
      <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          Critical Infrastructure Vulnerability Exposure
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {infrastructureExposure.map((item, idx) => (
            <div key={idx} className="bg-navy-900/80 border border-navy-700/60 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-white block truncate">{item.type}</span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-lg font-extrabold text-blue-400">{item.exposed}</span>
                <span className="text-xs font-bold text-red-400">{item.criticalHotspots} Hotspots</span>
              </div>
              <div className="w-full bg-navy-950 h-1.5 rounded-full overflow-hidden border border-navy-800 mt-2">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${item.riskIndex}%` }}
                />
              </div>
              <span className="text-[10px] text-navy-500 block">Vulnerability Index: {item.riskIndex}/100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
