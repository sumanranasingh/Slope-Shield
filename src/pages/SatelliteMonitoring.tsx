import { useState } from 'react'
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

  const currentAnomaly = anomalies.find(a => a.id === selectedAnomalyId) || anomalies[0]

  const handleDispatchDrone = (id: string) => {
    setDroneDispatched(id)
    setTimeout(() => setDroneDispatched(null), 3000)
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
                Satellite InSAR & Optical Change Detection Lab
              </h1>
              <p className="text-xs text-navy-400">
                Spaceborne interferometry detecting millimeter-level slope deformations before catastrophic failure
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={() => alert('Synced with latest European Space Agency (ESA) Copernicus Hub.')}
          className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-center"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync InSAR Passes</span>
        </button>
      </div>

      {/* Satellite Feed Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'sentinel1', name: 'Sentinel-1 (ESA)', type: 'C-Band Radar SAR', resolution: '5m Resolution', status: 'Active (14m ago)' },
          { id: 'sentinel2', name: 'Sentinel-2 (ESA)', type: 'Multispectral Optical', resolution: '10m Resolution', status: 'Cloud Cleared' },
          { id: 'risat', name: 'RISAT-1A (ISRO)', type: 'Synthetic Aperture Radar', resolution: '3m Resolution', status: 'Priority Pass' },
          { id: 'cartosat', name: 'Cartosat-3 (ISRO)', type: 'Sub-Meter Optical', resolution: '0.28m Resolution', status: 'On Demand' },
        ].map((sat) => (
          <button
            key={sat.id}
            onClick={() => setActiveConstellation(sat.id as any)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeConstellation === sat.id
                ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                : 'bg-navy-800/60 hover:bg-navy-800 border-navy-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">{sat.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-cyan-400 font-medium">{sat.type}</div>
            <div className="flex items-center justify-between text-[10px] text-navy-400 mt-2">
              <span>{sat.resolution}</span>
              <span className="text-slate-300">{sat.status}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Interactive Split-Screen Comparison Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{currentAnomaly.location}</h3>
                <p className="text-xs text-navy-400">{currentAnomaly.satellite} • {currentAnomaly.coordinates}</p>
              </div>

              <button
                onClick={() => setShowInterferogram(!showInterferogram)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  showInterferogram
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-navy-900 text-navy-400 border-navy-700'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{showInterferogram ? 'Anomaly Overlay: ON' : 'Anomaly Overlay: OFF'}</span>
              </button>
            </div>

            {/* Visual Interactive Image Comparison */}
            <div className="relative rounded-xl overflow-hidden border border-navy-700 bg-navy-950 aspect-[16/9] select-none">
              {/* Layer 1: BEFORE (12 Aug 2026) */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,#15803d_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#0f766e_0%,transparent_50%)]" />
                <div className="absolute top-3 left-3 bg-navy-950/90 border border-navy-700 px-3 py-1 rounded text-xs font-bold text-slate-200">
                  Baseline (12 Aug 2026)
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-slate-400 font-mono">
                  Stable Baseline Interferogram • 0.0 cm delta
                </div>
              </div>

              {/* Layer 2: CURRENT with Clip Path for Split Slider */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950 p-4 overflow-hidden"
                style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
              >
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_40%_40%,#b45309_0%,transparent_50%),radial-gradient(circle_at_60%_60%,#991b1b_0%,transparent_60%)]" />

                {/* Detected Displacement Overlay */}
                {showInterferogram && (
                  <div className="absolute top-1/3 left-1/3 w-48 h-32 bg-red-500/30 border-2 border-dashed border-red-400 rounded-xl animate-pulse flex flex-col items-center justify-center p-2 shadow-2xl">
                    <span className="bg-red-950/95 text-red-300 font-mono text-xs px-2 py-1 rounded border border-red-500/50 font-bold mb-1">
                      Δz Displacement: {currentAnomaly.displacementCm} cm
                    </span>
                    <span className="text-[10px] text-white font-semibold">
                      Phase Fringe Anomaly
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-red-950/90 border border-red-500/50 px-3 py-1 rounded text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  Current Pass (24 Aug 2026)
                </div>
                <div className="absolute bottom-3 right-3 text-xs text-red-400 font-mono">
                  Decorrelated InSAR Phase • High Failure Hazard
                </div>
              </div>

              {/* Split Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-bold text-white">
                  ⬌
                </div>
              </div>

              {/* Slider Input range overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>

            {/* Slider Guidance */}
            <div className="flex items-center justify-between text-xs text-navy-400 pt-1">
              <span>⬅ Drag slider left to inspect Current deformation</span>
              <span className="text-white font-semibold">Slider: {sliderPosition}%</span>
              <span>Drag right to inspect Baseline topography ➡</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detected Ground Anomalies Queue */}
        <div className="space-y-4">
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-navy-700/50">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Detected Terrain Anomalies ({anomalies.length})
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">Real-time InSAR</span>
            </div>

            <div className="space-y-3">
              {anomalies.map((a) => {
                const isSelected = a.id === selectedAnomalyId
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAnomalyId(a.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-navy-900 border-cyan-500 shadow-md'
                        : 'bg-navy-950/60 hover:bg-navy-900 border-navy-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{a.location}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          a.severity === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {a.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-navy-300 leading-snug mb-2">{a.type}</p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-navy-400 bg-navy-950 p-2 rounded border border-navy-800">
                      <div>
                        <span>Confidence:</span> <strong className="text-white">{a.confidence}%</strong>
                      </div>
                      <div>
                        <span>Displacement:</span> <strong className="text-red-400">{a.displacementCm} cm</strong>
                      </div>
                      <div>
                        <span>Affected Area:</span> <strong className="text-white">{a.areaHectares} ha</strong>
                      </div>
                      <div>
                        <span>Detected:</span> <strong className="text-cyan-400">{a.detectionDate.slice(0, 11)}</strong>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-navy-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDispatchDrone(a.id)
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                            droneDispatched === a.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{droneDispatched === a.id ? 'Drone Survey Dispatched' : 'Dispatch Drone'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsWarningModalOpen(true)
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-xs font-bold transition-colors"
                        >
                          Issue Warning
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <CreateWarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onCreateWarning={() => alert('Warning created from Satellite Anomaly!')}
      />
    </div>
  )
}
