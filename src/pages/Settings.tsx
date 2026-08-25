import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  Sliders,
  Key,
  Webhook,
  CreditCard,
  Users,
  ShieldCheck,
  CheckCircle,
  Copy,
  ExternalLink,
  Code,
  Bell,
  Save,
  Radio,
  RefreshCw,
  Server,
} from 'lucide-react'
import { isApiAvailable, API_BASE } from '../services/api'
import DataSourceBadge from '../components/common/DataSourceBadge'

export default function Settings() {
  const [criticalThreshold, setCriticalThreshold] = useState(80)
  const [highThreshold, setHighThreshold] = useState(60)
  const [rainfallTrigger, setRainfallTrigger] = useState(140)
  const [soilMoistureThreshold, setSoilMoistureThreshold] = useState(80)
  const [smsBroadcasting, setSmsBroadcasting] = useState(true)
  const [capProtocol, setCapProtocol] = useState(true)
  const [saved, setSaved] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  // Backend Health Ping State
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [checkingApi, setCheckingApi] = useState(false)

  const apiKey = 'sk_live_slopeshield_ner_883912049182374'

  const checkConnection = async () => {
    setCheckingApi(true)
    try {
      const ok = await isApiAvailable()
      setApiConnected(ok)
    } catch {
      setApiConnected(false)
    } finally {
      setCheckingApi(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Platform Configuration &amp; Enterprise Settings
              </h1>
              <p className="text-xs text-navy-400">
                Manage risk thresholds, B2B Geospatial APIs, alert routing &amp; telemetry parameters
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <DataSourceBadge source="DEMO" provider="Platform Operations Service" />
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Settings Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Thresholds, Alert Routing, B2B API */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Automated Risk Threshold Tuning */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-navy-700/50">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated Risk &amp; Early Warning Thresholds
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5 font-semibold">
                  <span className="text-red-400">Critical Red Alert Risk Score Cutoff:</span>
                  <span className="text-white font-bold">{criticalThreshold} / 100</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <span className="text-[10px] text-navy-500 block mt-1">
                  Scores equal or above {criticalThreshold} trigger mandatory evacuation recommendations &amp; CAP broadcasts.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 font-semibold">
                  <span className="text-orange-400">High Risk (Orange Alert) Cutoff:</span>
                  <span className="text-white font-bold">{highThreshold} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="80"
                  value={highThreshold}
                  onChange={(e) => setHighThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-[10px] text-navy-500 block mt-1">
                  Scores equal or above {highThreshold} prompt road inspection patrols and drone deployments.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 font-semibold">
                  <span className="text-cyan-400">24-Hour Rainfall Trigger Threshold:</span>
                  <span className="text-white font-bold">{rainfallTrigger} mm</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="250"
                  value={rainfallTrigger}
                  onChange={(e) => setRainfallTrigger(Number(e.target.value))}
                  className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 font-semibold">
                  <span className="text-purple-400">Soil Moisture Saturation Limit:</span>
                  <span className="text-white font-bold">{soilMoistureThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={soilMoistureThreshold}
                  onChange={(e) => setSoilMoistureThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Developer & Geospatial B2B API */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-700/50">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  B2B Geospatial &amp; Risk Prediction API
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                Active Key
              </span>
            </div>

            <p className="text-xs text-navy-300">
              Embed live landslide risk intelligence, corridor hazard ratings, and CAP notifications directly into external emergency management GIS.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider block">
                Production API Secret Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  readOnly
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
                <button
                  onClick={copyApiKey}
                  className="px-3 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
                >
                  {copiedKey ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Curl Snippet */}
            <div className="bg-navy-950 p-3 rounded-lg border border-navy-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
              <code>
                curl -X POST "{API_BASE}/predict-risk" \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                &nbsp;&nbsp;-d '{'{"location_id":"loc-001","rainfall_24h":120.5,"slope_degree":38}'}'
              </code>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Backend Health & System Status */}
        <div className="space-y-6">
          {/* Backend Diagnostics */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-navy-700/50">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Backend Service Health
                </h3>
              </div>
              <button
                onClick={checkConnection}
                disabled={checkingApi}
                className="p-1 rounded text-navy-400 hover:text-white transition-colors"
                title="Ping Backend Service"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingApi ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-navy-400">Endpoint:</span>
                <span className="font-mono text-[11px] text-navy-200">{API_BASE}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-400">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    apiConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : apiConnected === false
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-navy-700 text-navy-300'
                  }`}
                >
                  {apiConnected ? 'FASTAPI CONNECTED' : apiConnected === false ? 'DEVELOPMENT SEED' : 'CHECKING...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-400">Risk Model:</span>
                <span className="font-semibold text-white">Random Forest (rf-ner-v1.0)</span>
              </div>
            </div>
          </div>

          {/* Alert Broadcast Channels */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-navy-700/50">
              <Bell className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Emergency Routing Channels
              </h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900/80 cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Common Alerting Protocol (CAP)</span>
                  <span className="text-[10px] text-navy-400">Direct integration to NDMA national feed</span>
                </div>
                <input
                  type="checkbox"
                  checked={capProtocol}
                  onChange={(e) => setCapProtocol(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900/80 cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">SMS &amp; Dispatch Gateway</span>
                  <span className="text-[10px] text-navy-400">Immediate dispatches to BRO engineers</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsBroadcasting}
                  onChange={(e) => setSmsBroadcasting(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Organization & Team Access */}
          <div className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-5 card-hover space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-navy-700/50">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Authorized Personnel
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-navy-900/60">
                <div>
                  <div className="font-bold text-white">Administrator</div>
                  <div className="text-[10px] text-navy-400">NDMA Regional HQ</div>
                </div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">SuperAdmin</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900/60">
                <div>
                  <div className="font-bold text-white">Chief Engineer</div>
                  <div className="text-[10px] text-navy-400">Border Roads Organisation (BRO)</div>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Field Dispatcher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
