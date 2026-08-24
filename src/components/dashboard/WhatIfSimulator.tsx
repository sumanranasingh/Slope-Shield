import { useState } from 'react'
import {
  CloudRain,
  Zap,
  RotateCcw,
  AlertTriangle,
  Users,
  Compass,
  ArrowUpRight,
} from 'lucide-react'

interface WhatIfSimulatorProps {
  rainfallMultiplier: number
  onChangeMultiplier: (multiplier: number) => void
}

export default function WhatIfSimulator({
  rainfallMultiplier,
  onChangeMultiplier,
}: WhatIfSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Simulation presets
  const presets = [
    { label: 'Baseline (0mm)', multiplier: 1.0, icon: '🌤️', desc: 'Current IMD 24h forecast' },
    { label: '+50mm Heavy Rain', multiplier: 1.35, icon: '🌧️', desc: 'Widespread monsoon depression' },
    { label: '+100mm Cloudburst', multiplier: 1.75, icon: '⛈️', desc: 'Severe localized cloudburst event' },
    { label: '+200mm Cyclone Surge', multiplier: 2.2, icon: '🌀', desc: 'Extreme multi-day cyclone impact' },
  ]

  // Calculate dynamic impact metrics based on multiplier
  const baselineHighRisk = 18
  const simulatedHighRisk = Math.round(baselineHighRisk * Math.pow(rainfallMultiplier, 1.25))
  const baselineWarnings = 7
  const simulatedWarnings = Math.round(baselineWarnings * Math.pow(rainfallMultiplier, 1.3))
  const baselineRoadsKm = 240
  const simulatedRoadsKm = Math.round(baselineRoadsKm * rainfallMultiplier * 1.15)
  const baselinePop = 52000
  const simulatedPop = Math.round(baselinePop * Math.pow(rainfallMultiplier, 1.4))

  return (
    <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-blue-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and Tagline */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex-shrink-0">
            <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Interactive Rainfall Scenario Simulator
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                Live AI Recalculation
              </span>
            </div>
            <p className="text-xs text-navy-300 mt-0.5">
              Simulate extreme weather shocks to test infrastructure resilience and automated alert triggers
            </p>
          </div>
        </div>

        {/* Reset button if modified */}
        {rainfallMultiplier !== 1.0 && (
          <button
            onClick={() => onChangeMultiplier(1.0)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-navy-300 border border-navy-700 transition-colors self-start lg:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Real Data
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
        {presets.map((preset) => {
          const isActive = Math.abs(rainfallMultiplier - preset.multiplier) < 0.05
          return (
            <button
              key={preset.label}
              onClick={() => onChangeMultiplier(preset.multiplier)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'bg-navy-900/60 hover:bg-navy-900 border-navy-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{preset.icon}</span>
                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-white">{preset.label}</div>
              <div className="text-[10px] text-navy-400 truncate mt-0.5">{preset.desc}</div>
            </button>
          )
        })}
      </div>

      {/* Real-time Dynamic Impact Counters */}
      {rainfallMultiplier > 1.0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-navy-700/60 animate-fade-in">
          <div className="bg-navy-900/80 p-2.5 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-1 text-[11px] text-red-300 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>High-Risk Locations</span>
            </div>
            <div className="text-lg font-extrabold text-red-400 flex items-baseline gap-1.5">
              {simulatedHighRisk}
              <span className="text-[11px] font-normal text-red-300">
                (+{simulatedHighRisk - baselineHighRisk})
              </span>
            </div>
          </div>

          <div className="bg-navy-900/80 p-2.5 rounded-lg border border-orange-500/30">
            <div className="flex items-center gap-1 text-[11px] text-orange-300 mb-0.5">
              <CloudRain className="w-3.5 h-3.5 text-orange-400" />
              <span>Active Warnings</span>
            </div>
            <div className="text-lg font-extrabold text-orange-400 flex items-baseline gap-1.5">
              {simulatedWarnings}
              <span className="text-[11px] font-normal text-orange-300">
                (+{simulatedWarnings - baselineWarnings})
              </span>
            </div>
          </div>

          <div className="bg-navy-900/80 p-2.5 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-1 text-[11px] text-blue-300 mb-0.5">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Vulnerable Highways</span>
            </div>
            <div className="text-lg font-extrabold text-blue-400 flex items-baseline gap-1.5">
              {simulatedRoadsKm} km
              <span className="text-[11px] font-normal text-blue-300">
                (+{simulatedRoadsKm - baselineRoadsKm} km)
              </span>
            </div>
          </div>

          <div className="bg-navy-900/80 p-2.5 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-1 text-[11px] text-purple-300 mb-0.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Population at Risk</span>
            </div>
            <div className="text-lg font-extrabold text-purple-300 flex items-baseline gap-1.5">
              {simulatedPop.toLocaleString('en-IN')}
              <span className="text-[11px] font-normal text-purple-400">
                (+{(simulatedPop - baselinePop).toLocaleString('en-IN')})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
