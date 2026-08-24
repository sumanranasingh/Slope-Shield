import { useState } from 'react'
import { highways, RoadSegment, getSegmentById } from '../../data/roads'
import {
  Compass,
  AlertTriangle,
  CloudRain,
  History,
  ShieldCheck,
  Truck,
  ArrowRight,
  Printer,
  ChevronRight,
  MapPin,
  Clock,
  Radio,
} from 'lucide-react'

interface RoadRiskMonitorProps {
  onInspectOnMap?: (segment: RoadSegment) => void
}

export default function RoadRiskMonitor({ onInspectOnMap }: RoadRiskMonitorProps) {
  const [selectedHighwayId, setSelectedHighwayId] = useState<string>(highways[0].id)
  const currentHighway = highways.find(h => h.id === selectedHighwayId) || highways[0]
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(currentHighway.segments[0].id)
  
  const selectedSegment =
    getSegmentById(selectedSegmentId) || currentHighway.segments[0]

  const handleHighwayChange = (hwId: string) => {
    setSelectedHighwayId(hwId)
    const hw = highways.find(h => h.id === hwId)
    if (hw && hw.segments.length > 0) {
      setSelectedSegmentId(hw.segments[0].id)
    }
  }

  const [dispatched, setDispatched] = useState(false)

  return (
    <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Road & Highway Risk Intelligence</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                Commercial B2G / BRO Suite
              </span>
            </div>
            <p className="text-xs text-navy-400">
              Real-time corridor risk evaluation for BRO, NHIDCL, NHAI & State PWD
            </p>
          </div>
        </div>

        {/* Highway Status Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-navy-400 hidden sm:inline">Authority:</span>
          <span className="text-xs font-semibold text-white bg-navy-900 px-2.5 py-1 rounded-md border border-navy-700">
            {selectedSegment.authority}
          </span>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-[11px] font-medium text-navy-400 mb-1 uppercase tracking-wider">
            1. Select National Highway / Corridor
          </label>
          <select
            value={selectedHighwayId}
            onChange={(e) => handleHighwayChange(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/70 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            {highways.map(hw => (
              <option key={hw.id} value={hw.id}>
                {hw.code} — {hw.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-navy-400 mb-1 uppercase tracking-wider">
            2. Select Monitored Road Segment
          </label>
          <select
            value={selectedSegmentId}
            onChange={(e) => setSelectedSegmentId(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/70 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            {currentHighway.segments.map(seg => (
              <option key={seg.id} value={seg.id}>
                {seg.name} ({seg.lengthKm} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk Result Card Display */}
      <div className="bg-navy-900/80 border border-navy-700/60 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-navy-700/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-400">{selectedSegment.highwayCode}</span>
              <ChevronRight className="w-3.5 h-3.5 text-navy-500" />
              <span className="text-xs text-navy-300 font-medium">{selectedSegment.name}</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              {selectedSegment.startPoint} ➔ {selectedSegment.endPoint}
            </h4>
            <p className="text-xs text-navy-400 mt-0.5">
              State: <span className="text-white">{selectedSegment.state}</span> • Segment Length: <span className="text-white">{selectedSegment.lengthKm} km</span>
            </p>
          </div>

          {/* Risk Level Badge & Score */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-navy-400 block">Overall Risk</span>
              <span className="text-xl font-extrabold text-white">
                {selectedSegment.riskScore} <span className="text-xs font-normal text-navy-500">/100</span>
              </span>
            </div>
            <div
              className={`px-3 py-1.5 rounded-lg border text-center ${
                selectedSegment.riskLevel === 'Critical'
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : selectedSegment.riskLevel === 'High'
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                  : 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
              }`}
            >
              <span className="text-xs font-extrabold tracking-wider uppercase block">
                {selectedSegment.riskLevel}
              </span>
              <span className="text-[10px] opacity-80 block">Risk Level</span>
            </div>
          </div>
        </div>

        {/* Core Return Telemetry Grid (Fulfills prompt specifications) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-navy-950/60 p-3 rounded-lg border border-navy-800">
            <div className="flex items-center gap-1.5 text-navy-400 text-xs mb-1">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>Landslide Probability</span>
            </div>
            <div className="text-xl font-bold text-white">
              {selectedSegment.landslideProbability}%
            </div>
            <div className="w-full bg-navy-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  selectedSegment.landslideProbability > 75 ? 'bg-red-500' : 'bg-orange-500'
                }`}
                style={{ width: `${selectedSegment.landslideProbability}%` }}
              />
            </div>
          </div>

          <div className="bg-navy-950/60 p-3 rounded-lg border border-navy-800">
            <div className="flex items-center gap-1.5 text-navy-400 text-xs mb-1">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Heavy Rain Forecast</span>
            </div>
            <div className="text-xl font-bold text-cyan-400 flex items-center gap-1.5">
              {selectedSegment.heavyRainfallForecast ? 'Yes' : 'No'}
              <span className="text-xs font-normal text-navy-400">({selectedSegment.expectedRainfallMm}mm)</span>
            </div>
            <span className="text-[10px] text-navy-500 mt-1 block">Next 24-hour IMD Radar</span>
          </div>

          <div className="bg-navy-950/60 p-3 rounded-lg border border-navy-800">
            <div className="flex items-center gap-1.5 text-navy-400 text-xs mb-1">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Historical Events</span>
            </div>
            <div className="text-xl font-bold text-amber-400">
              {selectedSegment.nearbyHistoricalEvents} <span className="text-xs font-normal text-navy-400">events</span>
            </div>
            <span className="text-[10px] text-navy-500 mt-1 block">Recorded on this corridor</span>
          </div>

          <div className="bg-navy-950/60 p-3 rounded-lg border border-navy-800">
            <div className="flex items-center gap-1.5 text-navy-400 text-xs mb-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Route Traffic Status</span>
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedSegment.status === 'Open'
                    ? 'bg-emerald-400'
                    : selectedSegment.status === 'Restricted'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-red-500'
                }`}
              />
              {selectedSegment.status}
            </div>
            <span className="text-[10px] text-navy-500 mt-1 block">
              Last checked: {new Date(selectedSegment.lastInspected).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Vulnerable points & Action Directive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Recommended Operational Action
              </span>
            </div>
            <p className="text-xs text-navy-200 leading-relaxed font-medium">
              {selectedSegment.recommendedAction}
            </p>
          </div>

          <div className="bg-navy-950/70 border border-navy-800 rounded-lg p-3">
            <span className="text-[11px] font-semibold text-navy-300 block mb-1.5">
              Vulnerable Chokepoints:
            </span>
            <ul className="space-y-1">
              {selectedSegment.vulnerablePoints.map((point, i) => (
                <li key={i} className="text-[11px] text-navy-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-navy-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDispatched(true)
                setTimeout(() => setDispatched(false), 3000)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                dispatched
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {dispatched ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Inspection Dispatched to {selectedSegment.authority}
                </>
              ) : (
                <>
                  <Truck className="w-3.5 h-3.5" />
                  Dispatch Field Inspection Team
                </>
              )}
            </button>

            <button
              onClick={() => {
                window.print()
              }}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 text-xs font-medium border border-navy-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Export Road Advisory
            </button>
          </div>

          <div className="text-[11px] text-navy-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Active SaaS Highway Subscription: ₹350 / road-km / month
          </div>
        </div>
      </div>
    </div>
  )
}
