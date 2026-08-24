import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip, ZoomControl } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { locations, LocationData, getRiskColor } from '../../data/locations'
import { highways } from '../../data/roads'
import {
  Layers,
  MapPin,
  Eye,
  Maximize2,
  Minimize2,
  Navigation,
  CloudRain,
  Activity,
  Compass,
} from 'lucide-react'

interface LiveRiskMapProps {
  rainfallMultiplier?: number
  selectedLocationId?: string
  onSelectLocation?: (location: LocationData) => void
  compact?: boolean
}

export default function LiveRiskMap({
  rainfallMultiplier = 1.0,
  selectedLocationId,
  onSelectLocation,
  compact = false,
}: LiveRiskMapProps) {
  const [mapType, setMapType] = useState<'dark' | 'satellite' | 'topo'>('dark')
  const [showHighways, setShowHighways] = useState(true)
  const [showHistorical, setShowHistorical] = useState(true)
  const [showRainfallRadar, setShowRainfallRadar] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Basemap tile URLs
  const tileLayers = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  }

  // Adjust risk scores if simulation active
  const dynamicLocations = locations.map(loc => {
    if (rainfallMultiplier === 1.0) return loc
    const addedScore = Math.round((rainfallMultiplier - 1.0) * 18 * (loc.slope / 30))
    const simulatedScore = Math.min(100, Math.max(0, loc.riskScore + addedScore))
    let simulatedLevel = loc.riskLevel
    if (simulatedScore >= 85) simulatedLevel = 'Critical'
    else if (simulatedScore >= 68) simulatedLevel = 'High'
    else if (simulatedScore >= 45) simulatedLevel = 'Moderate'
    else simulatedLevel = 'Low'

    return {
      ...loc,
      riskScore: simulatedScore,
      riskLevel: simulatedLevel,
      rainfallMm: Math.round(loc.rainfallMm * rainfallMultiplier),
    }
  })

  const filteredLocations = dynamicLocations.filter(loc => {
    if (filterSeverity === 'all') return true
    return loc.riskLevel.toLowerCase() === filterSeverity.toLowerCase()
  })

  // Center on Northeast India
  const neCenter: [number, number] = [26.2, 92.9]

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-navy-700/60 bg-navy-950 flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : compact ? 'h-[440px]' : 'h-[580px]'
      }`}
    >
      {/* Map Header Toolbar */}
      <div className="bg-navy-900/90 backdrop-blur-md px-4 py-3 border-b border-navy-700/50 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Live GIS Landslide Risk Map</span>
          <span className="hidden sm:inline-block text-[11px] text-navy-400 bg-navy-800 px-2 py-0.5 rounded border border-navy-700">
            Northeast India • 8 States
          </span>
          {rainfallMultiplier > 1.0 && (
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded animate-pulse">
              Simulated +{Math.round((rainfallMultiplier - 1) * 100)}% Rainfall
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Severity Filters */}
          <div className="flex items-center bg-navy-800/80 rounded-lg p-0.5 border border-navy-700 text-xs">
            {['all', 'critical', 'high', 'moderate', 'low'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                  filterSeverity === sev
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-navy-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center bg-navy-800/80 rounded-lg p-0.5 border border-navy-700 text-xs">
            <button
              onClick={() => setMapType('dark')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                mapType === 'dark' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                mapType === 'satellite' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('topo')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                mapType === 'topo' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Topo
            </button>
          </div>

          {/* Highway & Radar toggles */}
          <button
            onClick={() => setShowHighways(!showHighways)}
            title="Toggle Monitored Highways"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showHighways
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                : 'bg-navy-800 border-navy-700 text-navy-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Highways</span>
          </button>

          <button
            onClick={() => setShowRainfallRadar(!showRainfallRadar)}
            title="Toggle Rainfall Radar Overlay"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showRainfallRadar
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                : 'bg-navy-800 border-navy-700 text-navy-400'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Radar</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-navy-800 border border-navy-700 text-navy-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative w-full h-full min-h-[300px]">
        <MapContainer
          center={neCenter}
          zoom={compact ? 6.5 : 7}
          zoomControl={false}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> | SlopeShield AI'
            url={tileLayers[mapType]}
          />

          {/* Highway Corridors Polylines */}
          {showHighways &&
            highways.map(hw =>
              hw.segments.map(seg => (
                <Polyline
                  key={seg.id}
                  positions={seg.coordinates}
                  pathOptions={{
                    color:
                      seg.riskLevel === 'Critical'
                        ? '#ef4444'
                        : seg.riskLevel === 'High'
                        ? '#f97316'
                        : '#3b82f6',
                    weight: 4,
                    opacity: 0.85,
                    dashArray: seg.status === 'Restricted' ? '6, 6' : undefined,
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs font-sans">
                      <p className="font-bold text-white">{seg.highwayCode} • {seg.name}</p>
                      <p className="text-slate-300">Risk Score: <span className="font-bold text-red-400">{seg.riskScore}/100 ({seg.riskLevel})</span></p>
                      <p className="text-slate-300">Authority: {seg.authority} • Status: {seg.status}</p>
                    </div>
                  </Tooltip>
                </Polyline>
              ))
            )}

          {/* Rainfall Radar Simulated Circles */}
          {showRainfallRadar &&
            dynamicLocations
              .filter(l => l.rainfallMm > 150)
              .map(l => (
                <CircleMarker
                  key={`radar-${l.id}`}
                  center={l.coordinates}
                  radius={45}
                  pathOptions={{
                    fillColor: '#06b6d4',
                    fillOpacity: 0.18,
                    color: '#0891b2',
                    weight: 1,
                    dashArray: '3, 6',
                  }}
                />
              ))}

          {/* Location Risk Markers */}
          {filteredLocations.map(loc => {
            const isSelected = selectedLocationId === loc.id
            const color = getRiskColor(loc.riskLevel)
            const radius = loc.riskLevel === 'Critical' ? 12 : loc.riskLevel === 'High' ? 10 : 8

            return (
              <CircleMarker
                key={loc.id}
                center={loc.coordinates}
                radius={radius}
                eventHandlers={{
                  click: () => {
                    if (onSelectLocation) onSelectLocation(loc)
                  },
                }}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isSelected ? 0.95 : 0.8,
                  color: isSelected ? '#ffffff' : color,
                  weight: isSelected ? 3 : 1.5,
                }}
              >
                <Popup className="slopeshield-popup">
                  <div className="p-1 min-w-[240px] text-navy-900 dark:text-navy-100">
                    <div className="flex items-center justify-between border-b border-navy-700/50 pb-2 mb-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{loc.name}</h4>
                        <p className="text-xs text-navy-400">{loc.district}, {loc.state}</p>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${color}25`,
                          color: color,
                          border: `1px solid ${color}60`,
                        }}
                      >
                        {loc.riskLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-navy-900/60 p-1.5 rounded border border-navy-700/40">
                        <span className="text-navy-500 block text-[10px]">Risk Score</span>
                        <span className="font-bold text-white text-sm">{loc.riskScore} <span className="text-xs text-navy-400">/100</span></span>
                      </div>
                      <div className="bg-navy-900/60 p-1.5 rounded border border-navy-700/40">
                        <span className="text-navy-500 block text-[10px]">24h Rainfall</span>
                        <span className="font-bold text-cyan-400 text-sm">{loc.rainfallMm} mm</span>
                      </div>
                      <div className="bg-navy-900/60 p-1.5 rounded border border-navy-700/40">
                        <span className="text-navy-500 block text-[10px]">Slope Angle</span>
                        <span className="font-medium text-white">{loc.slope}°</span>
                      </div>
                      <div className="bg-navy-900/60 p-1.5 rounded border border-navy-700/40">
                        <span className="text-navy-500 block text-[10px]">Past Events</span>
                        <span className="font-medium text-amber-400">{loc.historicalEvents.length} recorded</span>
                      </div>
                    </div>

                    <div className="bg-navy-900/80 p-2 rounded border border-navy-700/60 mb-3">
                      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block mb-0.5">AI Recommended Action</span>
                      <p className="text-[11px] text-navy-300 leading-snug">{loc.aiRecommendation}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-navy-700/50">
                      <Link
                        to={`/locations/${loc.id}`}
                        className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 px-2 rounded transition-colors"
                      >
                        Inspect Location
                      </Link>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 bg-navy-900/90 backdrop-blur-md border border-navy-700/60 rounded-xl p-3 shadow-2xl z-[1000] text-xs pointer-events-auto">
          <div className="font-semibold text-white mb-2 flex items-center justify-between gap-4">
            <span>Risk Level</span>
            <span className="text-[10px] text-navy-400">0–100 Scale</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
              <span className="text-navy-200">Critical</span>
              <span className="text-[10px] text-navy-500 ml-auto">85–100</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-navy-200">High</span>
              <span className="text-[10px] text-navy-500 ml-auto">68–84</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-navy-200">Moderate</span>
              <span className="text-[10px] text-navy-500 ml-auto">45–67</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-navy-200">Low</span>
              <span className="text-[10px] text-navy-500 ml-auto">0–44</span>
            </div>
          </div>
          {showHighways && (
            <div className="mt-2.5 pt-2 border-t border-navy-700/60 flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500 rounded-full" />
              <span className="text-[11px] text-navy-300">Monitored Highways</span>
            </div>
          )}
        </div>

        {/* Quick Stats pill */}
        <div className="absolute top-4 right-4 bg-navy-900/90 backdrop-blur-md border border-navy-700/60 rounded-xl px-3 py-2 shadow-2xl z-[1000] text-xs pointer-events-auto hidden sm:flex items-center gap-3">
          <div>
            <span className="text-navy-500 block text-[10px]">Active Hotspots</span>
            <span className="font-bold text-red-400">
              {dynamicLocations.filter(l => l.riskLevel === 'Critical' || l.riskLevel === 'High').length} High/Critical
            </span>
          </div>
          <div className="h-6 w-px bg-navy-700" />
          <div>
            <span className="text-navy-500 block text-[10px]">Monitored Assets</span>
            <span className="font-bold text-white">{dynamicLocations.length} locations</span>
          </div>
        </div>
      </div>
    </div>
  )
}
