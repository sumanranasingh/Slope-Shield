import { useState } from 'react'
import { WarningData } from '../../data/warnings'
import { locations } from '../../data/locations'
import { X, AlertTriangle, ShieldAlert, Send, Clock, CheckCircle } from 'lucide-react'

interface CreateWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateWarning: (warning: WarningData) => void
}

export default function CreateWarningModal({
  isOpen,
  onClose,
  onCreateWarning,
}: CreateWarningModalProps) {
  const [locationId, setLocationId] = useState(locations[0].id)
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Moderate' | 'Low'>('High')
  const [trigger, setTrigger] = useState('Heavy rainfall + steep slope saturation')
  const [message, setMessage] = useState('Elevated landslide risk detected following sustained rainfall. Precautionary protocols initiated.')
  const [recommendedAction, setRecommendedAction] = useState('Deploy field inspection team. Restrict heavy vehicular traffic. Alert local administration.')
  const [affectedArea, setAffectedArea] = useState('25 sq km')
  const [affectedPopulation, setAffectedPopulation] = useState('8500')
  const [expiryHours, setExpiryHours] = useState('24')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const selectedLoc = locations.find(l => l.id === locationId) || locations[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const now = new Date()
    const expiry = new Date(now.getTime() + parseInt(expiryHours) * 60 * 60 * 1000)

    const newWarning: WarningData = {
      id: `warn-${Date.now().toString().slice(-4)}`,
      locationId: selectedLoc.id,
      location: selectedLoc.name,
      state: selectedLoc.state,
      severity,
      riskScore: severity === 'Critical' ? 92 : severity === 'High' ? 82 : severity === 'Moderate' ? 62 : 38,
      trigger,
      message,
      recommendedAction,
      timestamp: now.toISOString(),
      expiryTime: expiry.toISOString(),
      status: 'Active',
      affectedArea,
      affectedPopulation: parseInt(affectedPopulation) || 5000,
      issuedBy: 'NDMA Command Center (Manual Broadcast)',
    }

    onCreateWarning(newWarning)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-navy-700/60 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Landslide Early Warning</h3>
              <p className="text-xs text-navy-400">Issue official alert to SDMA, BRO and emergency response teams</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-navy-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Toast */}
        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-lg font-bold text-white">Warning Issued Successfully</h4>
            <p className="text-xs text-navy-300">
              Disaster Management CAP Broadcast & SMS Dispatches have been triggered for {selectedLoc.name}.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Location & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-navy-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Target Location / Sector
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.district}, {loc.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-navy-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="Critical" className="text-red-400">CRITICAL (Red Alert)</option>
                  <option value="High" className="text-orange-400">HIGH (Orange Alert)</option>
                  <option value="Moderate" className="text-yellow-400">MODERATE (Yellow Alert)</option>
                  <option value="Low" className="text-emerald-400">LOW (Advisory)</option>
                </select>
              </div>
            </div>

            {/* Trigger conditions */}
            <div>
              <label className="block text-navy-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Trigger Factors & Environmental Drivers
              </label>
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="e.g. Heavy rainfall (240mm) + steep slope failure"
                required
                className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Alert Message */}
            <div>
              <label className="block text-navy-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Public & Authority Alert Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
                className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Recommended Action */}
            <div>
              <label className="block text-navy-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Recommended Action Directives
              </label>
              <textarea
                value={recommendedAction}
                onChange={(e) => setRecommendedAction(e.target.value)}
                rows={2}
                required
                className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Metrics: Area, Population, Expiry */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-navy-400 font-medium mb-1 text-[10px]">
                  Affected Area
                </label>
                <input
                  type="text"
                  value={affectedArea}
                  onChange={(e) => setAffectedArea(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-navy-400 font-medium mb-1 text-[10px]">
                  Est. Population
                </label>
                <input
                  type="text"
                  value={affectedPopulation}
                  onChange={(e) => setAffectedPopulation(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-navy-400 font-medium mb-1 text-[10px]">
                  Validity (Hours)
                </label>
                <select
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 text-white rounded-lg p-2 text-xs"
                >
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="72">72 Hours</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-700/60 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 font-semibold transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Warning</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
