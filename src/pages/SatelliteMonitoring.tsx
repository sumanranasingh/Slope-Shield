import { useState, useEffect } from 'react'
import {
  Satellite,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  AlertTriangle,
  Send,
  Eye,
  Radio,
  CheckCircle,
  RefreshCw,
  Compass,
} from 'lucide-react'
import CreateWarningModal from '../components/modals/CreateWarningModal'
import DataSourceBadge from '../components/common/DataSourceBadge'
import { satelliteApi } from '../services/satelliteApi'
import { WarningData } from '../data/warnings'

interface Anomaly {
  id: string
  location: string
  state: string
  coordinates: string
  satellite: string
  detectionDate: string
  confidence: number
  displacementCm: number
  areaHectares: number
  type: string
  severity: 'Critical' | 'High' | 'Moderate'
}

export default function SatelliteMonitoring() {
  const [activeConstellation, setActiveConstellation] = useState<'sentinel1' | 'sentinel2' | 'risat' | 'cartosat'>('sentinel1')
  const [sliderPosition, setSliderPosition] = useState<number>(50) // 0 - 100
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>('anom-1')
  const [showInterferogram, setShowInterferogram] = useState(true)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [droneDispatched, setDroneDispatched] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const anomalies: Anomaly[] = [
    {
      id: 'anom-1',
      location: 'Dibang Valley — Mayodia Escarpment',
      state: 'Arunachal Pradesh',
      coordinates: '28.6900° N, 95.7400° E',
      satellite: 'Sentinel-1B (Ascending Track 121)',
      detectionDate: '24 Aug 2026, 14:15 IST',
      confidence: 87,
      displacementCm: -14.2,
      areaHectares: 2.3,
      type: 'Possible slope movement / Progressive creeping failure',
      severity: 'Critical',
    },
    {
      id: 'anom-2',
      location: 'Noney Corridor — Tupul Railway Yard',
      state: 'Manipur',
      coordinates: '24.7950° N, 93.5980° E',
      satellite: 'RISAT-1A (ISRO SAR)',
      detectionDate: '24 Aug 2026, 11:30 IST',
      confidence: 91,
      displacementCm: -19.6,
      areaHectares: 3.8,
      type: 'Excavated slope shear displacement',
      severity: 'Critical',
    },
    {
      id: 'anom-3',
      location: 'Sela Pass Approach (Km 54)',
      state: 'Arunachal Pradesh',
      coordinates: '27.5340° N, 92.1220° E',
      satellite: 'Sentinel-2 Optical NDVI Difference',
      detectionDate: '23 Aug 2026, 16:45 IST',
      confidence: 79,
      displacementCm: -8.4,
      areaHectares: 1.1,
      type: 'Debris chute expansion',
      severity: 'High',
    },
    {
      id: 'anom-4',
      location: 'Jatinga Lampu Ridge',
      state: 'Assam',
      coordinates: '25.1320° N, 93.0340° E',
      satellite: 'Sentinel-1A (Descending Track 48)',
      detectionDate: '23 Aug 2026, 09:20 IST',
      confidence: 83,
      displacementCm: -11.2,
      areaHectares: 1.7,
      type: 'Toe erosion & tension cracking',
      severity: 'High',
    },
  ]

  const currentAnomaly = anomalies.find((a) => a.id === selectedAnomalyId) || anomalies[0]

  const handleDispatchDrone = (id: string) => {
    setDroneDispatched(id)
    setTimeout(() => setDroneDispatched(null), 3000)
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await satelliteApi.getAnomalies()
    } catch {
      // ignore
    } finally {
      setTimeout(() => setSyncing(false), 800)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Satellite InSAR &amp; Optical Change Detection Lab
              </h1>
              <p className="text-xs text-navy-400">
                Spaceborne interferometry detecting millimeter-level slope deformations before catastrophic failure
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <DataSourceBadge source="DEMO" provider="Copernicus Sentinel InSAR Pipeline" />
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync InSAR Passes'}</span>
          </button>
        </div>
      </div>

      {/* Constellation Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'sentinel1', name: 'Sentinel-1 (ESA C-Band SAR)', desc: 'Interferometric Phase Drift (LOS)', active: true },
          { id: 'sentinel2', name: 'Sentinel-2 (ESA Optical)', desc: 'NDVI & Land Cover Disturbance', active: true },
          { id: 'risat', name: 'RISAT-1A (ISRO C-Band)', desc: 'All-Weather Deep Soil Penetration', active: true },
          { id: 'cartosat', name: 'Cartosat-3 (ISRO 0.28m)', desc: 'High-Res DEM Elevation Tracking', active: true },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveConstellation(c.id as any)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeConstellation === c.id
                ? 'bg-navy-800 border-cyan-500 ring-1 ring-cyan-500'
                : 'bg-navy-800/40 border-navy-700/60 hover:border-navy-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white text-xs">{c.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[11px] text-navy-400">{c.desc}</span>
          </button>
        ))}
      </div>

      {/* Main 2-Column: Left Anomaly List, Right Visual Compare */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detected Satellite Anomalies */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-navy-700/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Detected Surface Anomalies ({anomalies.length})
            </h3>
            <span className="text-[10px] text-navy-400">Last 48 Hours</span>
          </div>

          <div className="space-y-3">
            {anomalies.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAnomalyId(a.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedAnomalyId === a.id
                    ? 'bg-navy-800 border-cyan-500 shadow-lg'
                    : 'bg-navy-800/60 border-navy-700/60 hover:border-navy-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      a.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {a.severity}
                  </span>
                  <span className="text-xs font-bold text-red-400">{a.displacementCm} cm / LOS</span>
                </div>
                <div className="font-bold text-white text-xs mb-0.5">{a.location}</div>
                <div className="text-[11px] text-navy-400 mb-2">{a.state} • {a.coordinates}</div>
                <div className="text-[11px] text-navy-300 bg-navy-900/70 p-2 rounded border border-navy-700/40">
                  {a.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Before/After Satellite Comparison & Displacement Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-navy-700/50">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  InSAR Interferogram &amp; Multi-Temporal Visualizer
                </h3>
                <p className="text-xs text-navy-400">{currentAnomaly.location} ({currentAnomaly.satellite})</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInterferogram(!showInterferogram)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showInterferogram
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-navy-900 text-navy-400 border-navy-700'
                  }`}
                >
                  {showInterferogram ? 'Hide InSAR Fringe' : 'Show InSAR Fringe'}
                </button>
              </div>
            </div>

            {/* Interactive Before/After Split Container */}
            <div className="relative h-80 rounded-xl overflow-hidden border border-navy-700 bg-navy-950 select-none">
              {/* Background 1 (Pre-event baseline) */}
              <div
                className="absolute inset-0 bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.15), transparent 70%), linear-gradient(135deg, #0b132b, #1c2541)`,
                }}
              >
                <div className="text-center p-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400/80 block">
                    Baseline Master Pass (T-30 Days)
                  </span>
                  <div className="text-sm font-bold text-white">{currentAnomaly.location}</div>
                  <p className="text-xs text-navy-400 max-w-sm">
                    Stable slope profile before antecedent monsoon saturation.
                  </p>
                </div>
              </div>

              {/* Foreground (Current pass with displacement heat overlay) */}
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-cyan-400"
                style={{ width: `${sliderPosition}%` }}
              >
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center justify-center"
                  style={{
                    backgroundImage: showInterferogram
                      ? `radial-gradient(circle at 60% 50%, rgba(239, 68, 68, 0.35), rgba(245, 158, 11, 0.2), transparent 70%), linear-gradient(135deg, #1e1b4b, #311042)`
                      : `linear-gradient(135deg, #111827, #1f2937)`,
                  }}
                >
                  <div className="text-center p-6 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400 block">
                      Active Slave Pass (Current Displacement)
                    </span>
                    <div className="text-sm font-bold text-white">Line-of-Sight Shift: {currentAnomaly.displacementCm} cm</div>
                    <p className="text-xs text-red-200/80 max-w-sm">
                      Severe phase decorrelation and downslope shear movement detected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-cyan-400 text-navy-950 font-black text-[10px] flex items-center justify-center shadow-lg pointer-events-auto">
                  ⇄
                </div>
              </div>

              {/* Hidden Range Input */}
              <input
                type="range"
                min={0}
                max={100}
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
              />
            </div>

            {/* Slider Range Legend */}
            <div className="flex items-center justify-between text-xs text-navy-400 pt-1">
              <span>◀ Drag left for Baseline Master pass</span>
              <span>Drag right for Current SAR displacement ▶</span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-700/50">
              <div className="text-xs text-navy-300">
                Estimated Affected Area: <strong className="text-white">{currentAnomaly.areaHectares} Hectares</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDispatchDrone(currentAnomaly.id)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-semibold text-xs border border-cyan-500/40 flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{droneDispatched === currentAnomaly.id ? 'Task Force Dispatched' : 'Deploy UAV Survey Drone'}</span>
                </button>

                <button
                  onClick={() => setIsWarningModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-red-600/25"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Broadcast InSAR Warning</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <CreateWarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onCreateWarning={() => alert('Early warning broadcast initiated from InSAR anomaly detection!')}
        preselectedLocation={currentAnomaly.location}
      />
    </div>
  )
}
