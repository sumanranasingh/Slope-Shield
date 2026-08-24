import { Bell, Menu, Search, MapPin, Compass, AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { locations } from '../../data/locations'
import { highways } from '../../data/roads'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const navigate = useNavigate()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const notifications = [
    { id: 1, text: 'Critical alert: Dibang Valley risk score crossed 90', time: '14 min ago', type: 'critical' },
    { id: 2, text: 'New satellite imagery available for Noney Corridor', time: '32 min ago', type: 'info' },
    { id: 3, text: 'Warning resolved: Haflong Ridge risk decreased', time: '1h ago', type: 'success' },
    { id: 4, text: 'Daily risk report generated successfully', time: '2h ago', type: 'info' },
    { id: 5, text: 'Rainfall threshold exceeded at Cherrapunji', time: '3h ago', type: 'warning' },
  ]

  // Filter search results
  const matchingLocations = searchQuery.trim()
    ? locations
        .filter(
          (l) =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.state.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : []

  const matchingHighways = searchQuery.trim()
    ? highways
        .filter(
          (h) =>
            h.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 2)
    : []

  return (
    <header className="h-16 border-b border-navy-700/50 bg-navy-900/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-navy-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-white">
            {greeting}, <span className="text-blue-400">Administrator</span>
          </h1>
          <p className="text-xs text-navy-400">
            Landslide risk intelligence across Northeast India
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search with Interactive Dropdown */}
        <div className="relative hidden md:block w-72">
          <div className="flex items-center bg-navy-800 border border-navy-700/50 rounded-lg px-3 py-1.5 gap-2">
            <Search className="w-4 h-4 text-navy-500" />
            <input
              type="text"
              placeholder="Search location, highway, district..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(true)
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent text-xs text-navy-200 placeholder-navy-500 outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-navy-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {showSearchResults && searchQuery.trim() && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSearchResults(false)}
              />
              <div className="absolute left-0 top-11 w-80 bg-navy-900 border border-navy-700/80 rounded-xl shadow-2xl z-50 p-2 text-xs animate-scale-in">
                {matchingLocations.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold text-navy-500 px-2 block mb-1">
                      Locations
                    </span>
                    {matchingLocations.map((l) => (
                      <Link
                        key={l.id}
                        to={`/locations/${l.id}`}
                        onClick={() => {
                          setShowSearchResults(false)
                          setSearchQuery('')
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-navy-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <div>
                            <span className="font-semibold text-white block">{l.name}</span>
                            <span className="text-[10px] text-navy-400">{l.state}</span>
                          </div>
                        </div>
                        <span className="font-bold text-red-400">{l.riskScore}/100</span>
                      </Link>
                    ))}
                  </div>
                )}

                {matchingHighways.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-navy-500 px-2 block mb-1">
                      Highways & Corridors
                    </span>
                    {matchingHighways.map((h) => (
                      <Link
                        key={h.id}
                        to="/"
                        onClick={() => {
                          setShowSearchResults(false)
                          setSearchQuery('')
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-navy-800 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <span className="font-semibold text-white block">{h.code}</span>
                          <span className="text-[10px] text-navy-400">{h.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {matchingLocations.length === 0 && matchingHighways.length === 0 && (
                  <div className="p-3 text-center text-navy-500 text-xs">
                    No matching locations or highways found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Date/Time */}
        <div className="hidden lg:flex flex-col items-end text-right">
          <span className="text-xs text-navy-300 font-medium">{dateStr}</span>
          <span className="text-[11px] text-navy-500">{timeStr} IST</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-navy-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 w-80 bg-navy-800 border border-navy-700/50 rounded-xl shadow-2xl z-50 animate-scale-in overflow-hidden">
                <div className="px-4 py-3 border-b border-navy-700/50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Emergency Dispatches</h3>
                  <span className="text-[10px] text-red-400 font-bold bg-red-500/20 px-1.5 py-0.5 rounded">
                    5 Unread
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 border-b border-navy-700/30 hover:bg-navy-700/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type === 'critical'
                              ? 'bg-red-500'
                              : n.type === 'warning'
                              ? 'bg-orange-500'
                              : n.type === 'success'
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div>
                          <p className="text-xs text-navy-200 leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-navy-500 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-navy-700/50 bg-navy-850">
                  <Link
                    to="/early-warnings"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium block text-center"
                  >
                    View All Active Early Warnings
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
