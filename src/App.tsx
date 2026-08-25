import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import RiskMapPage from './pages/RiskMapPage'
import EarlyWarnings from './pages/EarlyWarnings'
import Locations from './pages/Locations'
import LocationDetails from './pages/LocationDetails'
import Reports from './pages/Reports'
import Analytics from './pages/Analytics'
import SatelliteMonitoring from './pages/SatelliteMonitoring'
import Settings from './pages/Settings'
import Roads from './pages/Roads'
import CitizenReports from './pages/CitizenReports'
import IncidentManagement from './pages/IncidentManagement'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/risk-map" element={<RiskMapPage />} />
        <Route path="/early-warnings" element={<EarlyWarnings />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:id" element={<LocationDetails />} />
        <Route path="/roads" element={<Roads />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/citizen-reports" element={<CitizenReports />} />
        <Route path="/incidents" element={<IncidentManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/satellite" element={<SatelliteMonitoring />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
