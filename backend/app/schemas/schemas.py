"""Pydantic schemas for API request/response serialization."""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ── Data Source ────────────────────────────────────────────────────────

class DataSourceMeta(BaseModel):
    source: str = "DEMO"  # LIVE, FORECAST, HISTORICAL, DEMO
    last_updated: str = ""
    provider: str = "Development Seed Data"
    model_version: Optional[str] = None


# ── Location ──────────────────────────────────────────────────────────

class LocationOut(BaseModel):
    id: str
    name: str
    district: str
    state: str
    coordinates: List[float]
    elevation: float
    slope: float
    land_cover: str
    geological_class: str
    risk_score: float
    risk_level: str
    rainfall: str
    rainfall_mm: float
    last_updated: str
    status: str
    data_coverage: float


class LocationDetailOut(LocationOut):
    historical_events: List[dict] = []
    forecast: dict = {}
    ai_recommendation: str = ""
    risk_factors: List[dict] = []
    sensors: List[dict] = []
    data_source: DataSourceMeta = DataSourceMeta()


class LocationAnalysisIn(BaseModel):
    query: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rainfall_multiplier: float = 1.0


class LocationAnalysisOut(BaseModel):
    location_name: str
    district: str
    state: str
    coordinates: List[float]
    elevation_m: float
    slope_deg: float
    geology: str
    weather: Dict[str, Any]
    risk_score: float
    risk_level: str
    risk_probability: float
    risk_factors: List[Dict[str, Any]]
    explanations: List[str]
    action_directive: str
    nearby_infrastructure: List[Dict[str, Any]]
    historical_events_count: int
    data_source: DataSourceMeta = DataSourceMeta()


# ── Warning ───────────────────────────────────────────────────────────

class WarningOut(BaseModel):
    id: str
    location_id: str
    location: str
    state: str
    severity: str
    risk_score: float
    risk_probability: float
    trigger: str
    message: str
    recommended_action: str
    timestamp: str
    status: str  # Active, Acknowledged, Escalated, Resolved, Expired
    affected_area: str
    affected_population: int = 0
    issued_by: str = "System"
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[str] = None
    escalated_by: Optional[str] = None
    escalated_at: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[str] = None
    response_team: Optional[str] = None
    data_source: DataSourceMeta = DataSourceMeta()


class CreateWarningIn(BaseModel):
    location_id: str
    severity: str
    message: str
    recommended_action: str
    affected_area: Optional[str] = None
    response_team: Optional[str] = None


class UpdateWarningIn(BaseModel):
    severity: Optional[str] = None
    status: Optional[str] = None
    recommended_action: Optional[str] = None
    response_team: Optional[str] = None


class EscalateWarningIn(BaseModel):
    target_severity: str = "Critical"
    escalation_reason: str = "Secondary slope deformation detected."
    dispatched_team: Optional[str] = "SDRF Tactical Unit"


class AcknowledgeOut(BaseModel):
    id: str
    status: str
    acknowledged_by: str
    acknowledged_at: str


# ── Risk Prediction ──────────────────────────────────────────────────

class PredictRiskIn(BaseModel):
    location_id: str = ""
    rainfall_24h: float = 50.0
    rainfall_72h: float = 120.0
    rainfall_7d: float = 250.0
    soil_moisture: float = 60.0
    temperature: float = 22.0
    humidity: float = 85.0
    slope_degree: float = 35.0
    elevation: float = 1200.0
    historical_landslide_count: int = 2
    distance_to_road: float = 0.5
    distance_to_drainage: float = 0.3
    land_cover: str = "Forest"
    geological_factor: float = 0.7
    ground_movement: float = 5.0


class RiskFactorOut(BaseModel):
    name: str
    contribution: float
    color: str


class PredictRiskOut(BaseModel):
    risk_score: float
    risk_level: str
    risk_probability: float
    risk_factors: List[RiskFactorOut]
    recommended_action: str
    explanation: List[str]
    model_version: str
    prediction_timestamp: str
    data_source: DataSourceMeta = DataSourceMeta()


# ── Dashboard ─────────────────────────────────────────────────────────

class DashboardSummaryOut(BaseModel):
    total_monitored_locations: int
    critical_risk_locations: int
    high_risk_locations: int
    active_warnings: int
    affected_roads: int
    recent_incidents: int
    regional_risk_level: str
    risk_trend: str
    average_risk_score: float
    actions_required: List[dict] = []
    system_status: dict = {}
    data_source: DataSourceMeta = DataSourceMeta()


# ── Road ──────────────────────────────────────────────────────────────

class RoadOut(BaseModel):
    id: str
    highway_code: str
    name: str
    state: str
    start_point: str
    end_point: str
    length_km: float
    risk_score: float
    risk_level: str
    priority: str = "P2 — High"  # P1 — Immediate, P2 — High, P3 — Monitor, P4 — Normal
    status: str
    authority: str
    last_inspected: str
    data_source: DataSourceMeta = DataSourceMeta()


# ── Citizen Report ────────────────────────────────────────────────────

class CreateReportIn(BaseModel):
    category: str
    severity: str
    description: str
    latitude: float
    longitude: float
    location_name: Optional[str] = None
    reporter_name: str
    reporter_phone: Optional[str] = None


class UpdateReportIn(BaseModel):
    status: Optional[str] = None
    action_taken: Optional[str] = None
    verified_by: Optional[str] = None


class ReportOut(BaseModel):
    id: str
    category: str
    severity: str
    description: str
    latitude: float
    longitude: float
    location_name: Optional[str]
    state: Optional[str]
    status: str
    reporter_name: str
    timestamp: str
    data_source: DataSourceMeta = DataSourceMeta()


# ── Weather ───────────────────────────────────────────────────────────

class WeatherOut(BaseModel):
    location_id: str
    timestamp: str
    temperature: float
    humidity: float
    rainfall_1h: float
    rainfall_24h: float
    rainfall_72h: float
    condition: str
    data_source: DataSourceMeta = DataSourceMeta()


# ── Analytics ─────────────────────────────────────────────────────────

class AnalyticsOut(BaseModel):
    risk_distribution: List[dict] = []
    state_risk_data: List[dict] = []
    monthly_trend_data: List[dict] = []
    feature_importance: List[dict] = []
    data_source: DataSourceMeta = DataSourceMeta()


# ── Incidents ─────────────────────────────────────────────────────────

class IncidentOut(BaseModel):
    id: str
    location: str
    state: str
    type: str
    severity: str
    reported_at: str
    status: str
    response_team: str
    timeline: List[dict] = []


# ── Auth ──────────────────────────────────────────────────────────────

class LoginIn(BaseModel):
    email: str
    password: str


class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organization: Optional[dict] = None
