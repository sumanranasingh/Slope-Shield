import { useState, useEffect } from 'react'
import { Brain, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react'
import { locations, LocationData } from '../../data/locations'
import { riskApi } from '../../services/riskApi'
import DataSourceBadge from '../common/DataSourceBadge'
import type { PredictRiskResponse, RiskFactor } from '../../types'

interface AIExplanationCardProps {
  initialLocationId?: string
}

export default function AIExplanationCard({
  initialLocationId = 'loc-002',
}: AIExplanationCardProps) {
  const [selectedId, setSelectedId] = useState<string>(initialLocationId)
  const [prediction, setPrediction] = useState<PredictRiskResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Candidate locations with high or critical risk
  const candidateLocations = locations.filter(
    (l) => l.riskLevel === 'Critical' || l.riskLevel === 'High'
  )

  const currentLocation: LocationData =
    locations.find((l) => l.id === selectedId) || locations[1]

  useEffect(() => {
    let isMounted = true
    async function fetchAiExplanation() {
      setLoading(true)
      try {
        const res = await riskApi.predict({
          locationId: currentLocation.id,
          rainfall24h: currentLocation.rainfallMm,
          rainfall72h: currentLocation.rainfallMm * 2.6,
          rainfall7d: currentLocation.rainfallMm * 4.2,
          soilMoisture: currentLocation.riskScore > 80 ? 92 : 78,
          temperature: 21,
          humidity: 88,
          slopeDegree: currentLocation.slope,
          elevation: currentLocation.elevation,
          historicalLandslideCount: currentLocation.historicalEvents.length,
          distanceToRoad: 0.3,
          distanceToDrainage: 0.2,
          landCover: currentLocation.landCover,
          geologicalFactor: 0.82,
          groundMovement: currentLocation.riskScore > 80 ? 14.2 : 4.5,
        })
        if (isMounted) setPrediction(res)
      } catch {
        // Fallback to local structured factors
        if (isMounted) setPrediction(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchAiExplanation()
    return () => {
      isMounted = false
    }
  }, [currentLocation])

  const factors: RiskFactor[] = prediction?.riskFactors?.length
    ? prediction.riskFactors
    : currentLocation.riskFactors

  const explanations: string[] = prediction?.explanation?.length
    ? prediction.explanation
    : [
        `24-hour rainfall intensity (${currentLocation.rainfallMm} mm) exceeding local infiltration capacity.`,
        `Steep terrain slope angle (${currentLocation.slope}°) reducing shear resistance.`,
        `Geological bedrock class: ${currentLocation.geologicalClass}.`,
      ]

  const modelVer = prediction?.modelVersion || 'rf-ner-v1.0'

  return (
    <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover flex flex-col justify-between">
      <div>
        {/* Header */}
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
                Random Forest Feature Attribution &amp; Geotechnical Causality
              </p>
            </div>
          </div>

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
        <div className="space-y-3 mb-5 min-h-[170px]">
          <div className="flex items-center justify-between text-[11px] text-navy-400 font-medium">
            <span>Primary Contributing Risk Factors</span>
            <span>Attribution %</span>
          </div>

          {factors.slice(0, 5).map((factor) => (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-navy-200 font-medium">{factor.name}</span>
                <span className="font-bold text-white">{factor.contribution}%</span>
              </div>
              <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden border border-navy-700/40">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, factor.contribution * 2.2)}%`,
                    backgroundColor: factor.color || '#8b5cf6',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Explanation Details */}
      <div className="bg-purple-950/30 border border-purple-500/25 rounded-lg p-3.5 mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Physical Causality Attribution
            </span>
          </div>
          <DataSourceBadge source="DEMO" provider="NER Random Forest Engine" />
        </div>

        <ul className="space-y-1 text-xs text-purple-100/90 leading-relaxed list-disc list-inside">
          {explanations.slice(0, 3).map((exp, idx) => (
            <li key={idx} className="text-[11px] text-purple-200">
              {exp}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-2 border-t border-purple-500/20 text-[10px] text-purple-300/70">
          <span>Model: {modelVer}</span>
          <span>Recommended Action: Field Inspection within 24h</span>
        </div>
      </div>
    </div>
  )
}
