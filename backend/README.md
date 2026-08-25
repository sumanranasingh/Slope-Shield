# Slope-Shield AI — Backend

AI-powered landslide risk intelligence platform for NER India.

## Quick Start (Local Development)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
# Note: For SQLite dev mode, also install: pip install aiosqlite

# Copy environment file
cp .env.example .env

# Run server (auto-creates SQLite DB + seeds data)
uvicorn app.main:app --reload --port 8000
```

The server will:
1. Create a SQLite database (`slopeshield_dev.db`) automatically
2. Seed 16 NER locations, risk predictions, warnings, and roads
3. Start serving on `http://localhost:8000`
4. Swagger docs available at `http://localhost:8000/docs`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login (email: admin@slopeshield.ai, pass: admin123) |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/summary` | Dashboard aggregates |
| GET | `/api/locations` | All locations with risk |
| GET | `/api/locations/{id}` | Location detail |
| POST | `/api/predict-risk` | ML risk prediction |
| GET | `/api/locations/{id}/risk-history` | Risk history |
| GET | `/api/warnings` | All warnings |
| POST | `/api/warnings` | Create warning |
| POST | `/api/warnings/{id}/acknowledge` | Acknowledge |
| POST | `/api/warnings/{id}/resolve` | Resolve |
| GET | `/api/roads` | Road segments |
| POST | `/api/reports` | Submit citizen report |
| GET | `/api/reports` | List reports |
| GET | `/api/weather/{location_id}` | Weather data |
| GET | `/api/satellite/{location_id}` | Satellite observations |
| GET | `/api/analytics/risk` | Risk analytics |

## Docker (with PostgreSQL)

```bash
cd ..  # project root
docker-compose up -d
```

## Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI app + all endpoints + seed
│   ├── core/
│   │   ├── config.py         # Pydantic settings
│   │   ├── security.py       # JWT + bcrypt
│   │   └── logging.py        # Structured logging
│   ├── database/
│   │   ├── database.py       # SQLAlchemy async engine
│   │   └── models.py         # All 13 ORM models
│   ├── schemas/
│   │   └── schemas.py        # Pydantic request/response
│   └── services/
│       └── risk_engine.py    # Rule-based risk scoring
├── requirements.txt
├── .env.example
├── Dockerfile
└── alembic.ini
```

## Data Sources

> **IMPORTANT**: All data in this development build is clearly labeled as
> `DEMO` / Development Seed Data. No live weather, satellite, or sensor
> integrations are active unless explicitly configured via environment
> variables.

## External Integrations (Not Yet Connected)

| Integration | Status | Config Variable |
|---|---|---|
| OpenWeatherMap | Ready for integration | `WEATHER_API_KEY` |
| Sentinel-1/2 ESA Hub | Architecture prepared | — |
| ISRO RISAT/Cartosat | Architecture prepared | — |
| SMS Gateway | Notification abstraction ready | — |
| CAP Protocol (NDMA) | Architecture prepared | — |
