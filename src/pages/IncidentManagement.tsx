import DataSourceBadge from '../components/common/DataSourceBadge'
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  Users,
  MapPin,
  AlertTriangle,
  Activity,
} from 'lucide-react'

interface Incident {
  id: string; location: string; state: string; type: string
  severity: string; reportedAt: string; status: string
  responseTeam: string; timeline: { time: string; event: string }[]
}

const demoIncidents: Incident[] = [
  {
    id: 'INC-2026-042', location: 'Noney Corridor', state: 'Manipur', type: 'Debris Flow',
    severity: 'Critical', reportedAt: '2026-08-24T07:30:00', status: 'Active Response',
    responseTeam: 'SDRF Team Alpha + NHIDCL Emergency',
    timeline: [
      { time: '07:30', event: 'Debris flow reported by field team at Tupul railway yard' },
      { time: '07:45', event: 'SlopeShield AI alert auto-generated — Critical risk confirmed' },
      { time: '08:10', event: 'SDRF Team Alpha dispatched from Imphal' },
      { time: '08:30', event: 'NH-37 closed between Km 28 and Km 56' },
      { time: '09:15', event: 'NHIDCL heavy machinery mobilized' },
      { time: '10:00', event: 'Satellite pass confirms 3.8 ha affected area' },
    ],
  },
  {
    id: 'INC-2026-041', location: 'Sela Pass Approach', state: 'Arunachal Pradesh', type: 'Rockslide',
    severity: 'High', reportedAt: '2026-08-24T14:22:00', status: 'Under Assessment',
    responseTeam: 'BRO Task Force 14',
    timeline: [
      { time: '14:22', event: 'BRO patrol reports rockslide at Km 54' },
      { time: '14:35', event: 'Single lane traffic management initiated' },
      { time: '15:00', event: 'Geotechnical assessment team en route' },
    ],
  },
  {
    id: 'INC-2026-039', location: 'Jatinga Ridge', state: 'Assam', type: 'Track Subsidence',
    severity: 'High', reportedAt: '2026-08-22T09:00:00', status: 'Resolved',
    responseTeam: 'NF Railway Emergency Cell',
    timeline: [
      { time: '09:00', event: 'Track subsidence detected near Jatinga station' },
      { time: '09:30', event: 'Speed restriction imposed — 20 km/h' },
      { time: '11:00', event: 'Emergency track repair crew deployed' },
      { time: '16:00', event: 'Track stabilization completed' },
      { time: '18:00', event: 'Speed restrictions lifted — normal operations resumed' },
    ],
  },
]

const statusColor = (s: string) => {
  switch (s) {
    case 'Active Response': return 'bg-red-500/15 text-red-400 border-red-500/30'
    case 'Under Assessment': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
    case 'Resolved': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    default: return 'bg-navy-500/15 text-navy-400 border-navy-500/30'
  }
}

export default function IncidentManagement() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Incident Management</h1>
              <p className="text-xs text-navy-400">Active response coordination, incident timelines &amp; post-event documentation</p>
            </div>
          </div>
        </div>
        <DataSourceBadge source="DEMO" provider="Development Seed Data" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-navy-800/60 border border-red-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1">Active Incidents</div>
          <div className="text-2xl font-extrabold text-white">{demoIncidents.filter(i => i.status !== 'Resolved').length}</div>
        </div>
        <div className="bg-navy-800/60 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">Resolved (7d)</div>
          <div className="text-2xl font-extrabold text-white">{demoIncidents.filter(i => i.status === 'Resolved').length}</div>
        </div>
        <div className="bg-navy-800/60 border border-blue-500/30 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">Response Teams</div>
          <div className="text-2xl font-extrabold text-white">3</div>
        </div>
      </div>

      {/* Incidents */}
      <div className="space-y-6">
        {demoIncidents.map((inc) => (
          <div key={inc.id} className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-6 card-hover space-y-4">
            {/* Incident Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-700/50">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColor(inc.status)}`}>
                  {inc.status}
                </span>
                <span className="text-base font-bold text-white">{inc.location}</span>
                <span className="text-xs text-navy-400">({inc.state})</span>
                <span className="text-[10px] font-mono text-navy-500">{inc.id}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${inc.severity === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-orange-500/15 text-orange-400 border-orange-500/30'}`}>
                  {inc.severity}
                </span>
                <span className="text-navy-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(inc.reportedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800">
                <span className="text-navy-500 block text-[10px] uppercase font-semibold mb-0.5">Incident Type</span>
                <span className="text-white font-semibold">{inc.type}</span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800">
                <span className="text-navy-500 block text-[10px] uppercase font-semibold mb-0.5">Response Team</span>
                <span className="text-cyan-400 font-semibold">{inc.responseTeam}</span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded-lg border border-navy-800">
                <span className="text-navy-500 block text-[10px] uppercase font-semibold mb-0.5">Timeline Events</span>
                <span className="text-white font-semibold">{inc.timeline.length} logged</span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                Response Timeline
              </h4>
              <div className="relative border-l-2 border-navy-700 ml-3 pl-5 space-y-3">
                {inc.timeline.map((t, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-blue-400 border-2 border-navy-900" />
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-mono font-bold text-blue-400 whitespace-nowrap">{t.time}</span>
                      <p className="text-xs text-navy-200">{t.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
