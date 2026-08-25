import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Satellite,
  Activity,
  Layers,
  AlertCircle,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react'

export default function SatellitePreviewCard() {
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'current'>('split')
  const [showOverlay, setShowOverlay] = useState(true)

  return (
    <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-navy-700/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Satellite Change Detection
              </h3>
              <p className="text-xs text-navy-400">
                Sentinel-1 SAR Interferometry & Optical Differential
              </p>
            </div>
          </div>

          {/* View selector pills */}
          <div className="flex items-center bg-navy-900 rounded-lg p-0.5 border border-navy-700 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                viewMode === 'split' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('before')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                viewMode === 'before' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setViewMode('current')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                viewMode === 'current' ? 'bg-navy-700 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              Current
            </button>
          </div>
        </div>

        {/* Mock Satellite Imagery Canvas */}
        <div className="relative rounded-xl overflow-hidden border border-navy-700/70 bg-navy-950 aspect-[16/9] mb-4 group">
          {/* Base imagery with CSS gradients & realistic satellite terrain pattern */}
          <div
            className={`w-full h-full relative transition-all duration-300 ${
              viewMode === 'split' ? 'grid grid-cols-2' : ''
            }`}
          >
            {/* Before Frame */}
            {(viewMode === 'split' || viewMode === 'before') && (
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/80 p-3 overflow-hidden border-r border-navy-700/50">
                {/* Visual terrain contours */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,#15803d_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#0f766e_0%,transparent_50%)]" />
                <div className="absolute top-2 left-2 bg-navy-950/80 backdrop-blur-sm border border-navy-700/60 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300">
                  Before (12 Aug 2026)
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-mono">
                  SAR Coherence: 0.91
                </div>
              </div>
            )}

            {/* Current Frame */}
            {(viewMode === 'split' || viewMode === 'current') && (
              <div className="relative w-full h-full bg-gradient-to-br from-amber-950/50 via-slate-900 to-rose-950/70 p-3 overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_40%_40%,#b45309_0%,transparent_50%),radial-gradient(circle_at_60%_60%,#991b1b_0%,transparent_60%)]" />
                
                {/* Detected Terrain Change Overlay */}
                {showOverlay && (
                  <div className="absolute top-1/3 left-1/4 w-28 h-20 bg-red-500/25 border-2 border-dashed border-red-400 rounded-lg animate-pulse flex items-center justify-center">
                    <span className="bg-red-950/90 text-red-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-red-500/40">
                      Δz: -14.2 cm
                    </span>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-red-950/80 backdrop-blur-sm border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold text-red-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Current (24 Aug 2026)
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-red-400 font-mono">
                  SAR Coherence: 0.42 (Decorrelated)
                </div>
              </div>
            )}
          </div>

          {/* Toggle Change Overlay overlay checkbox */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-navy-900/90 backdrop-blur-sm border border-navy-700/80 px-2.5 py-1 rounded-full text-[10px] font-semibold text-navy-200 hover:text-white flex items-center gap-1.5 shadow-lg"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            {showOverlay ? 'Hide Anomaly Overlay' : 'Show Anomaly Overlay'}
          </button>
        </div>

        {/* Change Telemetry Strip (Prompt specification) */}
        <div className="bg-navy-900/80 border border-navy-700/60 rounded-xl p-3.5 space-y-2.5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-white">Change Detected</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded border border-red-500/30">
                Dibang Valley Sector
              </span>
            </div>
            <div className="text-xs font-extrabold text-cyan-400">
              Confidence: <span className="text-white">87%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-800 text-xs">
            <div>
              <span className="text-[10px] text-navy-500 block">Change Type</span>
              <span className="font-semibold text-orange-400 text-xs">
                Possible slope movement
              </span>
            </div>
            <div>
              <span className="text-[10px] text-navy-500 block">Estimated Area</span>
              <span className="font-semibold text-white text-xs">
                2.3 Hectares (Displaced)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investigate Action Button */}
      <Link
        to="/satellite"
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-600/20"
      >
        <Satellite className="w-4 h-4" />
        <span>Investigate Location in Satellite Lab</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
