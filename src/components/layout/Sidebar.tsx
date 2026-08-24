import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  MapPin,
  FileText,
  BarChart3,
  Satellite,
  Settings,
  HelpCircle,
  ChevronLeft,
  Shield,
  X,
  User,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/risk-map', icon: Map, label: 'Risk Map' },
  { to: '/early-warnings', icon: AlertTriangle, label: 'Early Warnings' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/satellite', icon: Satellite, label: 'Satellite Monitoring' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-navy-950 border-r border-navy-700/50
          flex flex-col sidebar-transition
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-navy-700/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white tracking-tight">SlopeShield</span>
                <span className="text-[10px] font-medium text-blue-400 tracking-widest uppercase">AI</span>
              </div>
            )}
          </div>
          
          {/* Mobile close button */}
          <button onClick={onClose} className="lg:hidden p-1 text-navy-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 text-navy-500 hover:text-white transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-navy-400 hover:text-white hover:bg-navy-800/60 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
                `
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-navy-700/50 p-3 space-y-1">
          <button className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-navy-400 hover:text-white hover:bg-navy-800/60 transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <HelpCircle className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Help & Support</span>}
          </button>
          
          <div className={`flex items-center gap-3 px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Administrator</p>
                <p className="text-xs text-navy-500 truncate">NDMA Regional Office</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
