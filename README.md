# Slope-Shield AI

> **AI-Powered Landslide Risk Intelligence, Geospatial Monitoring, Infrastructure Protection, and Early-Warning Platform for Climate-Vulnerable Regions.**

**Primary Geographical Focus**: North Eastern Region (NER) of India (*Assam, Meghalaya, Sikkim, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura*).

---

## 1. Product Overview

Slope-Shield AI answers four critical operational questions for disaster-management authorities, district administrations, infrastructure operators (BRO, NHIDCL, Railways), and emergency response teams:

1. **Where is the danger?** — Continuous high-resolution GIS risk maps, hotspot detection, and highway corridor vulnerability tracking.
2. **Why is the risk increasing?** — Multi-factor explainable AI assessing antecedent precipitation (24h/72h/7d), soil moisture saturation, slope gradient, InSAR ground deformation, and historical failure records.
3. **What infrastructure and communities are affected?** — Automated buffer analysis identifying exposed National Highways, railway corridors, bridge abutments, and vulnerable settlements.
4. **What action should be taken now?** — Statutory mitigation protocols, CAP-standard emergency broadcasts (SMS, Email, Push), and targeted field dispatch directives.

---

## 2. System Architecture

```text
User / Field Officer / Control Room
                 │
                 ▼
     React 19 + TypeScript Frontend (Vite)
  (10 Enterprise Modules + Leaflet GIS + Recharts)
                 │
                 ▼
       API Service Layer (src/services/)
                 │
                 ▼
        FastAPI Backend Gateway
        ├── JWT Auth & Role-Based Authorization
        ├── ML Risk Inference Pipeline (Random Forest rf-ner-v1.0)
        ├── Warning & CAP Broadcast Engine
        ├── Multi-Provider Weather Service
        ├── Satellite InSAR & Optical Change Service
        └── GIS & Infrastructure Proximity Engine
                 │
                 ▼
  PostgreSQL + PostGIS (Production) / SQLite (Dev)
   (13 Normalized Tables with Alembic Migrations)
```

---

## 3. Core Frontend Modules

1. **Executive Command Dashboard** (`/`) — High-level KPIs, operational status bar, priority dispatch directives, What-If rainfall scenario simulator, and risk trends.
2. **Live Geospatial Risk Map** (`/risk-map`) — Multi-layer Leaflet GIS with dark/satellite/topo basemaps, highway overlays, rainfall radar, predictive time-slider (Live, +24h, +48h, +72h), and inspector drawer.
3. **Location Intelligence** (`/locations/:id`) — Comprehensive geotechnical dossiers with 7-day soil saturation curves, 72h risk trajectory forecasts, geological profiles, and historical failure archives.
4. **Early Warning Operations Hub** (`/early-warnings`) — CAP protocol emergency broadcast console with severity filters, manual alert issuance, acknowledgement, and resolution workflows.
5. **Infrastructure & Road Monitoring** (`/roads`) — Highway corridor risk tables, operational blockage tracking (Open, Restricted, Closed), authority attribution (BRO, NHIDCL), and sorting.
6. **Satellite InSAR & Optical Change Lab** (`/satellite`) — Multi-constellation tracker (Sentinel-1 SAR, Sentinel-2 Optical, RISAT-1A, Cartosat-3) with interactive before/after split interferogram visualizer and UAV drone dispatch.
7. **Geospatial Risk Analytics** (`/analytics`) — State-wise mean vulnerability, multi-year monsoon rainfall correlation curves, Random Forest feature importance weights, and strategic infrastructure exposure matrices.
8. **Citizen & Field Ground-Truth Reports** (`/citizen-reports`) — Photo/video upload support, GPS coordinates, hazard categorization, and lifecycle workflow transitions (`NEW` ➔ `UNDER_REVIEW` ➔ `VERIFIED` ➔ `ACTIONED` ➔ `RESOLVED`).
9. **Emergency Incident Management** (`/incidents`) — Active disaster timeline tracking, multi-agency response team coordination, and post-event documentation.
10. **Platform Settings & Developer B2B API** (`/settings`) — Automated risk threshold tuning, production API secret keys, backend diagnostic pings, and emergency routing channels.
11. **Automated Audit Reports** (`/reports`) — PDF/HTML audit dossier generation for daily risk briefings, highway assessments, and district disaster summaries.

---

## 4. API Endpoints

### Health & Auth
- `GET    /api/health` — Health check, version, and region info.
- `POST   /api/auth/login` — Authenticate and receive JWT bearer token.
- `GET    /api/auth/me` — Authenticated profile & organization.

### Dashboard & Analytics
- `GET    /api/dashboard/summary` — Command center KPIs and priority actions.
- `GET    /api/analytics/risk` — Risk distribution, state averages, ML weights.
- `GET    /api/analytics/rainfall` — Regional rainfall summary.
- `GET    /api/analytics/incidents` — Incident statistics.

### Locations & Risk Prediction
- `GET    /api/locations` — Monitored locations (query: `state`, `risk_level`, `status`, `search`).
- `GET    /api/locations/{id}` — Full geotechnical deep-dive dossier.
- `GET    /api/locations/{id}/risk-history` — Time-series predictions for location.
- `POST   /api/predict-risk` — Random Forest inference on 14 geotechnical/meteorological features.

### Early Warnings
- `GET    /api/warnings` — Active and historical warnings.
- `GET    /api/warnings/{id}` — Warning details.
- `POST   /api/warnings` — Issue new warning with CAP broadcast.
- `PATCH  /api/warnings/{id}` — Update warning parameters.
- `POST   /api/warnings/{id}/acknowledge` — Acknowledge alert.
- `POST   /api/warnings/{id}/resolve` — Resolve and close alert.

### Roads & Infrastructure
- `GET    /api/roads` — All monitored highway segments.
- `GET    /api/roads/{id}` — Single road corridor status.
- `PATCH  /api/roads/{id}/status` — Update corridor status.

### Citizen & Field Reports
- `POST   /api/reports` — Submit new ground-truth observation.
- `GET    /api/reports` — List reports (query: `status`, `category`).
- `GET    /api/reports/{id}` — View report details.
- `PATCH  /api/reports/{id}` — Transition report verification status.

### Weather & Satellite
- `GET    /api/weather/{location_id}` — Current weather telemetry.
- `GET    /api/weather/{location_id}/forecast` — 72-hour precipitation forecast.
- `GET    /api/satellite/{location_id}` — Satellite InSAR observations.
- `GET    /api/satellite/anomalies` — Regional deformation anomalies.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+
- (Optional) Docker & Docker Compose

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

# Run migrations (or DB auto-seeds on first launch)
alembic upgrade head

# Run tests
pytest

# Start FastAPI backend
uvicorn app.main:app --reload --port 8000
```
Backend Swagger OpenAPI documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# In the project root
npm install

# Build check
npm run build

# Start Vite development server
npm run dev
```
Frontend web interface will be available at: `http://localhost:5173`

### 3. Docker Compose (Full Stack)
```bash
docker-compose up --build
```

---

## 6. Data Authenticity Lineage

Slope-Shield AI enforces strict data authenticity standards:
- **`LIVE`**: Telemetry actively ingested from configured external provider APIs (e.g. OpenWeatherMap API).
- **`FORECAST`**: Precipitation predictions computed from meteorological forecast models (e.g. 72h IMD grids).
- **`HISTORICAL`**: Verified archival disaster event logs and ground failure records.
- **`DEMO/DEVELOPMENT`**: Synthetic calibration benchmarks covering 16 North Eastern sectors used during development and offline testing.

---

## 7. Security & Enterprise Readiness
- **Password Hashing**: Passlib PBKDF2-SHA256 for credential security.
- **Role-Based Access Control (RBAC)**: Supports `admin`, `district_officer`, `field_officer`, and `analyst` scopes.
- **CORS Protection**: Whitelisted origin headers configurable via `.env`.
- **Statutory Audit Logs**: All alert broadcasts, acknowledgements, and report state transitions persist timestamps and officer identity.