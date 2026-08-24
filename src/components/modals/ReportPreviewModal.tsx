import { MockReport } from '../../data/reports'
import {
  X,
  Printer,
  Download,
  Share2,
  Shield,
  FileCheck,
  Building,
  CheckCircle,
  Copy,
} from 'lucide-react'
import { useState } from 'react'

interface ReportPreviewModalProps {
  report: MockReport | null
  onClose: () => void
}

export default function ReportPreviewModal({ report, onClose }: ReportPreviewModalProps) {
  const [copied, setCopied] = useState(false)

  if (!report) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `# ${report.title}\nPeriod: ${report.period}\n\n## Summary\n${report.summary}\n\n` +
      report.sections.map(s => `### ${s.title}\n${s.content}\n`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-navy-950 border border-navy-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 border-b border-navy-700/60 flex items-center justify-between bg-navy-900 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Official Risk Assessment Report</h3>
              <p className="text-[11px] text-navy-400">Standard NDMA / BRO Geospatial Intelligence Format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-200 text-xs font-semibold border border-navy-700 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-navy-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-sans space-y-6">
          {/* Official Document Header */}
          <div className="border-b-2 border-blue-500/80 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
                    SlopeShield AI
                  </h1>
                  <p className="text-xs text-blue-400 font-semibold tracking-widest uppercase">
                    Geospatial Landslide Risk Intelligence Platform
                  </p>
                </div>
              </div>

              <div className="text-right text-xs space-y-0.5 text-slate-400">
                <div className="font-mono text-[11px] text-white">DOC REF: SS-NER-2026-0824</div>
                <div>Generated: {new Date(report.generatedAt).toLocaleString('en-IN')}</div>
                <div className="text-emerald-400 font-semibold">Security: Official B2G Confidential</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <h2 className="text-xl font-bold text-white">{report.title}</h2>
              <div className="text-xs text-slate-400 mt-1">Period: <span className="text-slate-200 font-medium">{report.period}</span></div>
            </div>
          </div>

          {/* Executive Overview Box */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Executive Assessment
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Report Sections */}
          <div className="space-y-6">
            {report.sections.map((section, idx) => (
              <div key={idx} className="border-b border-slate-800 pb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded bg-blue-500" />
                  {section.title}
                </h3>

                {/* Optional Key Metric Data Grid */}
                {section.data && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {section.data.map((item, i) => (
                      <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 block">{item.label}</span>
                        <span className="text-base font-bold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Sign-off & Verification Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-200">SlopeShield Automated Early Warning Engine</p>
              <p className="text-[11px]">Validated against IMD Doppler Radar & Sentinel-1 InSAR data</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20 font-semibold text-[11px]">
              <CheckCircle className="w-4 h-4" />
              <span>Digitally Authenticated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
