import { useState } from 'react'
import { Link } from 'react-router-dom'
import LiveRiskMap from '../components/dashboard/LiveRiskMap'
import { locations, LocationData, states, getRiskColor, getRiskBgColor } from '../data/locations'
import { highways } from '../data/roads'
import {
  Map,
  Search,
  Filter,
  Layers,
  Clock,
  Compass,
  AlertTriangle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Radio,
  Sliders,
  Eye,
} from 'lucide-react'

export default function RiskMapPage() {
  const [selectedState, setSelectedState] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [forecastHour, setForecastHour] = useState<number>(0) // 0 = Current, 24, 48, 72
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(locations[1]) // Dibang Valley default
  const [filterType, setFilterType] = useState<'all' | 'highways' | 'settlements'>('all')

  // Filter locations
  const filteredLocations = locations.filter(loc => {
    const matchesState = selectedState === 'All' || loc.state === selectedState
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesState && matchesSearch
  })

  // Multiplier for forecast slider
  const forecastMultiplier = forecastHour === 0 ? 1.0 : forecastHour === 24 ? 1.15 : forecastHour === 48 ? 1.28 : 1.4

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-navy-950">
      {/* Left Control & Inspector Panel */}
      <div className="w-full lg:w-[380px] xl:w-[420px] bg-navy-900 border-r border-navy-700/60 flex flex-col h-full z-20 overflow-y-auto">
        {/* Panel Header */}
        <div className="p-4 border-b border-navy-700/60 bg-navy-950/60">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Map className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">GIS Risk Command Center</h2>
          </div>
          <p className="text-xs text-navy-400">
            Multi-layer landslide susceptibility & infrastructure monitor
          </p>

          {/* Search bar */}
          <div className="mt-3 relative">
            <Search className="w-3.5 h-3.5 text-navy-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search location, district, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Predictive Time-Slider (Current, 24h, 48h, 72h) */}
        <div className="p-4 border-b border-navy-700/60 bg-navy-900/40">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Predictive Forecast Window:
            </span>
            <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {forecastHour === 0 ? 'Live (Current)' : `+${forecastHour} Hours Forecast`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[0, 24, 48, 72].map((h) => (
              <button
                key={h}
                onClick={() => setForecastHour(h)}
                className={`py-1.5 rounded text-xs font-semibold transition-all ${
                  forecastHour === h
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-navy-800 text-navy-400 hover:text-white hover:bg-navy-700'
                }`}
              >
                {h === 0 ? 'Live' : `+${h}h`}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-navy-500 mt-1.5 block">
            {forecastHour === 0
              ? 'Real-time telemetry and active rainfall triggers'
              : `Predictive model combining 72h IMD precipitation forecast and slope saturation`}
          </span>
        </div>

        {/* State Filter pills */}
        <div className="p-4 border-b border-navy-700/60">
          <label className="block text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-2">
            Filter by State ({filteredLocations.length} locations)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedState('All')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedState === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-navy-800 text-navy-400 hover:text-white'
              }`}
            >
              All States
            </button>
            {states.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedState === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-navy-800 text-navy-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Location Detailed Inspection Drawer */}
        {selectedLocation && (
          <div className="p-4 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
                Selected Hotspot
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRiskBgColor(
                  selectedLocation.riskLevel
                )}`}
              >
                {selectedLocation.riskLevel}
              </span>
            </div>

            <div className="bg-navy-950 p-4 rounded-xl border border-navy-700/60 space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedLocation.name}</h3>
                <p className="text-xs text-navy-400">
                  {selectedLocation.district} District, {selectedLocation.state}
                </p>
                <div className="text-[11px] text-navy-500 font-mono mt-0.5">
                  Lat: {selectedLocation.coordinates[0]}° N, Lng: {selectedLocation.coordinates[1]}° E
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-navy-900/80 p-2 rounded border border-navy-800">
                  <span className="text-navy-500 block text-[10px]">Risk Score</span>
                  <span className="text-lg font-bold text-red-400">{selectedLocation.riskScore}/100</span>
                </div>
                <div className="bg-navy-900/80 p-2 rounded border border-navy-800">
                  <span className="text-navy-500 block text-[10px]">24h Rainfall</span>
                  <span className="text-lg font-bold text-cyan-400">{selectedLocation.rainfallMm} mm</span>
                </div>
                <div className="bg-navy-900/80 p-2 rounded border border-navy-800">
                  <span className="text-navy-500 block text-[10px]">Slope Angle</span>
                  <span className="text-sm font-semibold text-white">{selectedLocation.slope}°</span>
                </div>
                <div className="bg-navy-900/80 p-2 rounded border border-navy-800">
                  <span className="text-navy-500 block text-[10px]">Elevation</span>
                  <span className="text-sm font-semibold text-white">{selectedLocation.elevation} m</span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  AI Action Protocol
                </span>
                <p className="text-navy-200 text-xs leading-relaxed">
                  {selectedLocation.aiRecommendation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  to={`/locations/${selectedLocation.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Deep-Dive</span>
                </Link>
                <Link
                  to="/early-warnings"
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  Alerts
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Map Canvas (Expansive GIS View) */}
      <div className="flex-1 h-full relative">
        <LiveRiskMap
          rainfallMultiplier={forecastMultiplier}
          selectedLocationId={selectedLocation?.id}
          onSelectLocation={(loc) => setSelectedLocation(loc)}
        />
      </div>
    </div>
  )
}
