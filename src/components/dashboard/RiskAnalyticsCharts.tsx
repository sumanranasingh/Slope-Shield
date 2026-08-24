import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  riskTrendData,
  rainfallRiskData,
  riskDistributionData,
  stateRiskData,
} from '../../data/charts'
import { BarChart3, TrendingUp, CloudRain, PieChart as PieIcon, Map } from 'lucide-react'

// Custom tooltip renderer for Recharts dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 border border-navy-700 p-2.5 rounded-lg shadow-xl text-xs z-50">
        <p className="font-semibold text-white mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-navy-300">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color || item.fill || item.stroke }}
              />
              {item.name}:
            </span>
            <span className="font-bold text-white">
              {item.value} {item.unit || (item.name === 'rainfall' ? 'mm' : '')}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RiskAnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* 2-Column Grid: 7-Day Trend & Rainfall vs Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. 7-Day Risk Trend */}
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-navy-700/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">7-Day Risk Trend</h3>
                <p className="text-xs text-navy-400">Regional daily susceptibility fluctuation</p>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Regional Avg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[20, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="arunachal"
                  name="Arunachal"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="meghalaya"
                  name="Meghalaya"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f97316' }}
                />
                <Line
                  type="monotone"
                  dataKey="manipur"
                  name="Manipur"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#a855f7' }}
                />
                <Line
                  type="monotone"
                  dataKey="assam"
                  name="Assam"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="sikkim"
                  name="Sikkim"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Rainfall vs Risk Combined Chart */}
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-navy-700/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <CloudRain className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Rainfall vs Risk Correlation</h3>
                <p className="text-xs text-navy-400">Precipitation surge triggering probability spike</p>
              </div>
            </div>
            <span className="text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              R² = 0.89 Correlation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rainfallRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#06b6d4" domain={[0, 300]} tick={{ fill: '#06b6d4', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" domain={[0, 100]} tick={{ fill: '#ef4444', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar
                  yAxisId="left"
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  fill="#06b6d4"
                  opacity={0.65}
                  radius={[4, 4, 0, 0]}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="risk"
                  name="Landslide Risk Index"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="#ef4444"
                  fillOpacity={0.15}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Risk Distribution & State-wise Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Risk Distribution (Donut Chart) */}
        <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-navy-700/50">
            <div className="p-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <PieIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Risk Distribution</h3>
              <p className="text-xs text-navy-400">247 monitored locations breakdown</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Donut Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-700/50 text-xs">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-navy-900/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-navy-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. State-wise Risk Bar Chart */}
        <div className="lg:col-span-2 bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-navy-700/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Map className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">State-wise Risk & High-Risk Zones</h3>
                <p className="text-xs text-navy-400">Comparative vulnerability index across Northeast India</p>
              </div>
            </div>
            <span className="text-[11px] text-navy-400 bg-navy-900 px-2 py-0.5 rounded border border-navy-700">
              8 States
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="abbrev" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="avgRisk"
                  name="Average Risk Score (/100)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="highRiskZones"
                  name="High-Risk Hotspots"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
