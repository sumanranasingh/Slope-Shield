import { useState } from 'react'
import { reportTemplates, generateMockReport, MockReport, ReportTemplate } from '../data/reports'
import ReportPreviewModal from '../components/modals/ReportPreviewModal'
import {
  FileText,
  Map,
  Compass,
  AlertTriangle,
  Download,
  Calendar,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null)
  const [activeFrequency, setActiveFrequency] = useState<string>('all')

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return FileText
      case 'Map':
        return Map
      case 'Route':
        return Compass
      case 'AlertTriangle':
        return AlertTriangle
      default:
        return FileText
    }
  }

  const handleGenerate = (templateId: string) => {
    const report = generateMockReport(templateId)
    setSelectedReport(report)
  }

  const filteredTemplates = reportTemplates.filter((t) => {
    if (activeFrequency === 'all') return true
    return t.frequency.toLowerCase() === activeFrequency.toLowerCase()
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                AI Automated Risk Intelligence Reports
              </h1>
              <p className="text-xs text-navy-400">
                Generate official executive summaries, highway assessments, and disaster response documentation
              </p>
            </div>
          </div>
        </div>

        {/* Quick Instant Daily PDF */}
        <button
          onClick={() => handleGenerate('daily-risk')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25 self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Today's Regional Audit</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-navy-400 font-semibold mr-1">Report Cadence:</span>
        {['all', 'daily', 'weekly', 'on-demand'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFrequency(f)}
            className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[10px] transition-colors ${
              activeFrequency === f
                ? 'bg-blue-600 text-white'
                : 'bg-navy-800 text-navy-400 hover:text-white border border-navy-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Report Template Cards Grid (Prompt Specification) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = getTemplateIcon(template.icon)
          return (
            <div
              key={template.id}
              className="bg-navy-800/60 border border-navy-700/60 rounded-xl p-6 card-hover flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-navy-900 text-navy-300 px-2 py-1 rounded border border-navy-700">
                      {template.frequency}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                      {template.format}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{template.title}</h3>
                <p className="text-xs text-navy-300 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="pt-4 border-t border-navy-700/50 flex items-center justify-between">
                <div className="text-[11px] text-navy-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Last Generated: {new Date(template.lastGenerated).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <button
                  onClick={() => handleGenerate(template.id)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Commercial Enterprise Note Banner */}
      <div className="bg-navy-900/80 border border-navy-700/60 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Automated SaaS Scheduled Dispatches</h4>
            <p className="text-xs text-navy-400">
              Configure automated 06:00 IST morning briefings dispatched to SDMA Control Rooms & BRO Field Units via Email & WhatsApp API.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Automated schedule is enabled for NDMA Regional Hub.')}
          className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-200 text-xs font-semibold border border-navy-700 transition-colors whitespace-nowrap"
        >
          Configure Automated Delivery
        </button>
      </div>

      {/* Report Preview Modal */}
      <ReportPreviewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  )
}
