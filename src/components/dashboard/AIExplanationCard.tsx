import { useState } from 'react'
import { locations, LocationData } from '../../data/locations'
import {
  Brain,
  Sparkles,
  ChevronDown,
  Info,
  TrendingUp,
  Layers,
  HelpCircle,
} from 'lucide-react'

interface AIExplanationCardProps {
  initialLocationId?: string
}

export default function AIExplanationCard({
  initialLocationId = 'loc-002',
}: AIExplanationCardProps) {
  const [selectedId, setSelectedId] = useState<string>(initialLocationId)

  // Top critical / high risk locations for selector
  const candidateLocations = locations.filter(
    l => l.riskLevel === 'Critical' || l.riskLevel === 'High'
  )

  const currentLocation: LocationData =
    locations.find(l => l.id === selectedId) || locations[1]

  return (
    <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Why is this location at risk?
              </h3>
              <p className="text-xs text-navy-400">
                XGBoost SHAP Feature Attribution & Terrain Causality
              </p>
            </div>
          </div>

          {/* Location Selector dropdown */}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-navy-900 border border-navy-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500 max-w-[180px] truncate"
          >
            {candidateLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.riskScore}/100)
              </option>
            ))}
          </select>
        </div>

        {/* Location Summary Strip */}
        <div className="flex items-center justify-between bg-navy-900/80 p-3 rounded-lg border border-navy-700/60 mb-4">
          <div>
            <div className="text-xs font-bold text-white">{currentLocation.name}</div>
            <div className="text-[11px] text-navy-400">
              {currentLocation.district}, {currentLocation.state}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-navy-400 block">Risk Score</span>
            <span className="text-base font-extrabold text-red-400">
              {currentLocation.riskScore} <span className="text-xs font-normal text-navy-500">/100</span>
            </span>
          </div>
        </div>

        {/* Horizontal Contribution Bars */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-[11px] text-navy-400 font-medium">
            <span>Primary Contributing Risk Factors</span>
            <span>Attribution %</span>
          </div>

          {currentLocation.riskFactors.map((factor) => (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-navy-200 font-medium">{factor.name}</span>
                <span className="font-bold text-white">{factor.contribution}%</span>
              </div>
              <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden border border-navy-700/40">
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

      {/* AI Insight Box (Prompt specification) */}
      <div className="bg-purple-950/30 border border-purple-500/25 rounded-lg p-3.5 mt-2">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            AI Insight
          </span>
        </div>
        <p className="text-xs text-purple-100/90 leading-relaxed italic">
          "{currentLocation.aiRecommendation || 'High rainfall combined with steep terrain and previous landslide activity has significantly increased the predicted risk.'}"
        </p>
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-500/20 text-[10px] text-purple-300/70">
          <span>Model: XGBoost-InSAR v3.2</span>
          <span>Confidence: 94.2%</span>
        </div>
      </div>
    </div>
  )
}
