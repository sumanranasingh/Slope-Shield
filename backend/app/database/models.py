"""
SQLAlchemy ORM models for all 13+ tables.
PostGIS-compatible (lat/lng stored as floats for SQLite compatibility,
spatial columns can be added via migration for PostgreSQL).
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Float, Integer, Boolean, Text, DateTime,
    ForeignKey, Index, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from app.database.database import Base
import uuid


def utcnow():
    return datetime.now(timezone.utc)

def gen_id():
    return str(uuid.uuid4())[:12]


# ── Organizations & Users ──────────────────────────────────────────────

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String(200), nullable=False)
    type = Column(String(100))  # SDMA, BRO, NHIDCL, District Admin
    region = Column(String(100))
    created_at = Column(DateTime, default=utcnow)


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_id)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(200), nullable=False)
    role = Column(String(50), default="analyst")  # admin, district_officer, field_officer, analyst
    organization_id = Column(String, ForeignKey("organizations.id"))
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=utcnow)


# ── Locations ──────────────────────────────────────────────────────────

class Location(Base):
    __tablename__ = "locations"
    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String(200), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float)
    slope = Column(Float)
    land_cover = Column(String(100))
    geological_class = Column(String(200))
    geological_factor = Column(Float, default=0.5)
    data_coverage = Column(Float, default=80.0)
    status = Column(String(50), default="Active")  # Active, Monitoring, Alert, Inactive
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    __table_args__ = (
        Index("ix_locations_state_risk", "state"),
    )


# ── Risk Predictions ──────────────────────────────────────────────────

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False, index=True)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    risk_probability = Column(Float)
    rainfall_24h = Column(Float)
    rainfall_72h = Column(Float)
    rainfall_7d = Column(Float)
    soil_moisture = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    ground_movement = Column(Float)
    recommended_action = Column(Text)
    explanation = Column(Text)  # JSON string of explanation lines
    model_version = Column(String(50))
    predicted_at = Column(DateTime, default=utcnow, index=True)


# ── Weather ────────────────────────────────────────────────────────────

class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False, index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall_1h = Column(Float)
    rainfall_24h = Column(Float)
    rainfall_72h = Column(Float)
    rainfall_7d = Column(Float)
    wind_speed = Column(Float)
    wind_direction = Column(String(20))
    pressure = Column(Float)
    visibility = Column(Float)
    cloud_cover = Column(Float)
    condition = Column(String(100))
    observed_at = Column(DateTime, default=utcnow, index=True)


class SoilObservation(Base):
    __tablename__ = "soil_observations"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False, index=True)
    soil_moisture = Column(Float)
    pore_pressure = Column(Float)
    soil_temperature = Column(Float)
    saturation_level = Column(String(20))  # Normal, Elevated, Critical
    observed_at = Column(DateTime, default=utcnow)


# ── Historical Landslides ──────────────────────────────────────────────

class HistoricalLandslide(Base):
    __tablename__ = "historical_landslides"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"), index=True)
    date = Column(String(50))
    type = Column(String(100))
    severity = Column(String(50))
    description = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)


# ── Roads ──────────────────────────────────────────────────────────────

class Road(Base):
    __tablename__ = "roads"
    id = Column(String, primary_key=True, default=gen_id)
    highway_code = Column(String(20), nullable=False)
    name = Column(String(200), nullable=False)
    state = Column(String(100), index=True)
    start_point = Column(String(200))
    end_point = Column(String(200))
    length_km = Column(Float)
    risk_score = Column(Float)
    risk_level = Column(String(20))
    status = Column(String(50), default="Open")  # Open, Restricted, Closed, Under Inspection
    authority = Column(String(50))
    last_inspected = Column(DateTime)
    created_at = Column(DateTime, default=utcnow)


# ── Warnings ───────────────────────────────────────────────────────────

class Warning(Base):
    __tablename__ = "warnings"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"), index=True)
    location_name = Column(String(200))
    state = Column(String(100))
    severity = Column(String(20), nullable=False)  # Low, Moderate, High, Critical
    risk_score = Column(Float)
    risk_probability = Column(Float)
    trigger = Column(String(200))
    message = Column(Text)
    recommended_action = Column(Text)
    affected_area = Column(String(200))
    affected_population = Column(Integer)
    status = Column(String(20), default="Active")  # Active, Acknowledged, Resolved, Expired
    issued_by = Column(String(100))
    acknowledged_by = Column(String(100))
    acknowledged_at = Column(DateTime)
    resolved_by = Column(String(100))
    resolved_at = Column(DateTime)
    response_team = Column(String(200))
    created_at = Column(DateTime, default=utcnow, index=True)
    expires_at = Column(DateTime)


# ── Citizen Reports ────────────────────────────────────────────────────

class CitizenReport(Base):
    __tablename__ = "citizen_reports"
    id = Column(String, primary_key=True, default=gen_id)
    category = Column(String(50), nullable=False)
    severity = Column(String(20))
    description = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    location_name = Column(String(200))
    state = Column(String(100))
    district = Column(String(100))
    reporter_name = Column(String(200))
    reporter_phone = Column(String(20))
    reporter_role = Column(String(50))
    status = Column(String(20), default="NEW")  # NEW, UNDER_REVIEW, VERIFIED, ACTIONED, RESOLVED
    verified_by = Column(String(100))
    verified_at = Column(DateTime)
    action_taken = Column(Text)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=utcnow, index=True)


# ── Satellite ──────────────────────────────────────────────────────────

class SatelliteObservation(Base):
    __tablename__ = "satellite_observations"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"), index=True)
    source = Column(String(50))  # Sentinel-1, Sentinel-2, RISAT-1A, Cartosat-3
    observation_type = Column(String(100))
    resolution = Column(String(20))
    displacement_cm = Column(Float)
    confidence = Column(Float)
    area_hectares = Column(Float)
    observed_at = Column(DateTime, default=utcnow)


# ── Notifications ──────────────────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=gen_id)
    warning_id = Column(String, ForeignKey("warnings.id"))
    channel = Column(String(20))  # sms, email, push
    recipient = Column(String(200))
    message = Column(Text)
    status = Column(String(20), default="PENDING")  # PENDING, SENT, FAILED
    sent_at = Column(DateTime)
    created_at = Column(DateTime, default=utcnow)


# ── Response Actions ───────────────────────────────────────────────────

class ResponseAction(Base):
    __tablename__ = "response_actions"
    id = Column(String, primary_key=True, default=gen_id)
    warning_id = Column(String, ForeignKey("warnings.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    action_type = Column(String(100))
    description = Column(Text)
    assigned_team = Column(String(200))
    status = Column(String(50), default="pending")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=utcnow)


# ── Audit Logs ─────────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=gen_id)
    user_id = Column(String(100), default="system")
    user_name = Column(String(200), default="System Engine")
    action = Column(String(100), nullable=False, index=True)  # LOGIN, WARNING_ISSUED, WARNING_ACKNOWLEDGED, CONFIG_UPDATED, etc.
    resource_type = Column(String(100), nullable=False)        # warning, incident, location, settings, user
    resource_id = Column(String(100))
    details = Column(Text)                                    # JSON string or description
    ip_address = Column(String(50))
    created_at = Column(DateTime, default=utcnow, index=True)


# ── Response Incidents & Timelines ─────────────────────────────────────

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(String, primary_key=True, default=gen_id)
    incident_code = Column(String(50), unique=True, nullable=False, index=True) # e.g. INC-2026-042
    location_id = Column(String, ForeignKey("locations.id"), nullable=True)
    location_name = Column(String(200), nullable=False)
    district = Column(String(100))
    state = Column(String(100), nullable=False, index=True)
    hazard_type = Column(String(100), nullable=False)         # Debris Flow, Rockslide, Mudslide, Track Subsidence
    severity = Column(String(50), default="Critical")         # Critical, High, Moderate
    priority = Column(String(50), default="P1 — Immediate")   # P1 — Immediate, P2 — High, P3 — Monitor, P4 — Normal
    status = Column(String(50), default="ACTIVE_RESPONSE")    # NEW, ACTIVE_RESPONSE, UNDER_ASSESSMENT, RESOLVED
    assigned_team = Column(String(200))                       # SDRF Team Alpha, BRO Task Force 14, etc.
    commander_name = Column(String(200))
    commander_phone = Column(String(50))
    affected_infrastructure = Column(String(255))             # NH-37 (Km 28-56), Tupul Yard
    recommended_action = Column(Text)
    created_at = Column(DateTime, default=utcnow, index=True)
    resolved_at = Column(DateTime)

    events = relationship("IncidentEvent", back_populates="incident", cascade="all, delete-orphan")


class IncidentEvent(Base):
    __tablename__ = "incident_events"
    id = Column(String, primary_key=True, default=gen_id)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False, index=True)
    time_str = Column(String(50), nullable=False)              # "07:30", "08:15"
    event_description = Column(Text, nullable=False)
    logged_by = Column(String(200), default="Command Center")
    created_at = Column(DateTime, default=utcnow)

    incident = relationship("Incident", back_populates="events")


# ── Storage & Media Metadata ───────────────────────────────────────────

class StorageMedia(Base):
    __tablename__ = "storage_media"
    id = Column(String, primary_key=True, default=gen_id)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    storage_path = Column(String(500), nullable=False)
    uploader_id = Column(String(100))
    resource_type = Column(String(100))                       # citizen_report, incident, audit
    resource_id = Column(String(100))
    created_at = Column(DateTime, default=utcnow)

