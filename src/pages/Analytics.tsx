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
import { monthlyTrendData as fallbackMonthly, stateRiskData as fallbackStates } from '../data/charts'
import { useAnalytics } from '../hooks/useDashboard'
import DataSourceBadge from '../components/common/DataSourceBadge'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
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
  const { data: analyticsData, isLoading, error, retry } = useAnalytics(timeRange)

  // Feature Importance data (Trained Random Forest model)
  const featureImportance = (analyticsData as any)?.featureImportance?.length
    ? (analyticsData as any).featureImportance
    : [
        { feature: 'Cumulative 72h Rainfall', weight: 24.2, color: '#3b82f6' },
        { feature: '24h Rainfall Intensity', weight: 16.8, color: '#06b6d4' },
        { feature: 'Soil Moisture Saturation', weight: 15.4, color: '#8b5cf6' },
        { feature: 'Terrain Slope Gradient', weight: 13.9, color: '#f59e0b' },
        { feature: 'Historical Landslide Count', weight: 10.2, color: '#ef4444' },
        { feature: 'Geological Bedrock Class', weight: 8.1, color: '#ec4899' },
        { feature: 'InSAR Ground Movement', weight: 6.7, color: '#14b8a6' },
        { feature: 'Road Proximity Exposure', weight: 4.7, color: '#f97316' },
      ]

  const stateData = analyticsData?.stateRiskData?.length ? analyticsData.stateRiskData : fallbackStates
  const monthlyData = analyticsData?.monthlyTrendData?.length ? analyticsData.monthlyTrendData : fallbackMonthly

  // Infrastructure exposure summary
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
                Geospatial Risk Analytics &amp; Telemetry
              </h1>
              <p className="text-xs text-navy-400">
                Multi-factor climate correlation, historical anomaly detection &amp; Random Forest explainability
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <DataSourceBadge source="DEMO" provider="Geospatial Telemetry Intelligence" />
          <div className="flex items-center bg-navy-900 rounded-lg p-1 border border-navy-700 text-xs">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'monsoon', label: 'Monsoon 2026' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-3 py-1.5 rounded-md font-semibold text-[11px] transition-all ${
                  timeRange === t.id ? 'bg-blue-600 text-white shadow' : 'text-navy-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Analytics Telemetry Feed Offline"
          message={`Using fallback analytics dataset (${error}).`}
          onRetry={retry}
        />
      )}

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Model Engine Architecture</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">Random Forest</div>
          <div className="text-[11px] text-navy-400 mt-1">Version: rf-ner-v1.0 (Explainable)</div>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Critical Highway Exposure</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">342 km</div>
          <div className="text-[11px] text-navy-400 mt-1">Across NH-13, NH-37, NH-10</div>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Peak Cumulative 72h Rain</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">420 mm</div>
          <div className="text-[11px] text-navy-400 mt-1">Recorded in East Khasi Hills</div>
        </div>

        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
            <span>Telemetry Stations</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">16 Sectors</div>
          <div className="text-[11px] text-navy-400 mt-1">Active across 8 NER States</div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading analytical models..." rows={4} />
      ) : (
        <>
          {/* Main Charts Row: State Vulnerability & Monthly Monsoon Correlation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* State-Wise Landslide Vulnerability */}
            <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  State-Wise Mean Hazard Vulnerability (NER)
                </h3>
                <span className="text-[11px] text-navy-400">0–100 Scale</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="state" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Bar dataKey="avgRisk" name="Avg Risk Index" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Precipitation vs. Slope Failure Index */}
            <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Monsoon Rainfall vs. Landslide Risk Correlation
                </h3>
                <span className="text-[11px] text-navy-400">Multi-Year Seasonal Model</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="risk"
                      name="Risk Score"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rainfall"
                      name="Rainfall (mm)"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 2-Column Section: ML Feature Importance & Infrastructure Exposure Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Machine Learning Feature Importance (Weights) */}
            <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-700/50">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Machine Learning Feature Weights
                  </h3>
                </div>
                <span className="text-[10px] text-navy-400">Random Forest Importance</span>
              </div>

              <div className="space-y-3">
                {featureImportance.map((item: any) => (
                  <div key={item.feature} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-200 font-medium">{item.feature}</span>
                      <span className="font-bold text-white">{item.weight}%</span>
                    </div>
                    <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden border border-navy-700/40">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.weight * 3}%`, backgroundColor: item.color || '#3b82f6' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Infrastructure Exposure Matrix */}
            <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-700/50">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Strategic Infrastructure Exposure Matrix
                  </h3>
                </div>
                <span className="text-[10px] text-navy-400">NER Asset Tracking</span>
              </div>

              <div className="divide-y divide-navy-700/40 text-xs">
                {infrastructureExposure.map((item) => (
                  <div key={item.type} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{item.type}</span>
                      <span className="text-[11px] text-navy-400">
                        {item.exposed} • {item.criticalHotspots} Critical Sections
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-red-400">{item.riskIndex} / 100</span>
                      <span className="text-[10px] text-navy-500 block">Hazard Index</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
