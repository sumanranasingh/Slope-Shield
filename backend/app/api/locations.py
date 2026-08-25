"""
Location Intelligence & Geocoding Analysis API router.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import json

from app.database.database import get_db
from app.database.models import Location, RiskPrediction, HistoricalLandslide, WeatherObservation, SoilObservation
from app.schemas.schemas import (
    LocationOut, LocationDetailOut, LocationAnalysisIn, LocationAnalysisOut, DataSourceMeta
)
from app.services.gis_service import gis_service
from app.services.weather_service import weather_service
from app.services.ml_service import ml_service
from app.services.risk_engine import compute_risk
from app.services.sensor_service import sensor_service
from app.utils.geo import geocode_location, NER_GAZETTEER

router = APIRouter()


@router.get("", response_model=List[LocationOut])
async def get_locations(
    state: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(Location)
    if state and state.lower() != "all":
        q = q.where(Location.state == state)
    if status and status.lower() != "all":
        q = q.where(Location.status == status)

    result = await db.execute(q.order_by(Location.name))
    locs = result.scalars().all()

    output = []
    for loc in locs:
        if search:
            s = search.lower()
            if not (s in loc.name.lower() or s in loc.district.lower() or s in loc.state.lower()):
                continue

        # Get latest prediction
        pred = (await db.execute(
            select(RiskPrediction)
            .where(RiskPrediction.location_id == loc.id)
            .order_by(RiskPrediction.predicted_at.desc())
            .limit(1)
        )).scalar_one_or_none()

        risk_score = pred.risk_score if pred else 50.0
        risk_level_val = pred.risk_level if pred else "Moderate"
        r_mm = pred.rainfall_24h if pred else 45.0

        if risk_level and risk_level.lower() != "all":
            if risk_level_val.lower() != risk_level.lower():
                continue

        r_desc = (
            "Light" if r_mm < 30
            else "Moderate" if r_mm < 70
            else "Heavy" if r_mm < 130
            else "Very Heavy"
        )

        output.append(LocationOut(
            id=loc.id,
            name=loc.name,
            district=loc.district,
            state=loc.state,
            coordinates=[loc.latitude, loc.longitude],
            elevation=loc.elevation or 1200.0,
            slope=loc.slope or 30.0,
            land_cover=loc.land_cover or "Forest",
            geological_class=loc.geological_class or "Sedimentary",
            risk_score=risk_score,
            risk_level=risk_level_val,
            rainfall=r_desc,
            rainfall_mm=r_mm,
            last_updated=loc.updated_at.isoformat() if loc.updated_at else datetime.now(timezone.utc).isoformat(),
            status=loc.status or "Active",
            data_coverage=loc.data_coverage or 88.0,
        ))

    return output


@router.post("/analyze", response_model=LocationAnalysisOut)
async def analyze_location_pipeline(body: LocationAnalysisIn, db: AsyncSession = Depends(get_db)):
    """
    Complete end-to-end location analysis pipeline:
    Query / Lat-Lon -> Geocode -> Weather -> Terrain -> History -> Infrastructure -> ML Prediction -> Explainability -> Action Directive
    """
    lat, lon = body.latitude, body.longitude
    loc_name = body.query or "Custom Coordinates Sector"
    district = "Regional Sector"
    state = "North Eastern Region"
    elevation = 1400.0
    slope = 34.0
    geology = "Metamorphic Schist Complex"

    if body.query:
        geocoded = geocode_location(body.query)
        if geocoded:
            loc_name = geocoded["name"]
            district = geocoded["district"]
            state = geocoded["state"]
            lat = geocoded["lat"]
            lon = geocoded["lon"]
            elevation = geocoded["elevation"]
            slope = geocoded["slope"]

    if lat is None or lon is None:
        lat, lon = 27.534, 92.122  # Fallback to Sela Pass sector

    # 1. Weather observation
    weather = await weather_service.get_current_weather(lat, lon, "query-location")
    r24 = weather.get("rainfall_24h", 65.0) * body.rainfall_multiplier
    r72 = weather.get("rainfall_72h", 140.0) * body.rainfall_multiplier
    r7d = r72 * 1.8
    soil_m = min(98.0, max(20.0, 50.0 + (r72 / 300.0) * 45.0))
    temp = weather.get("temperature", 22.0)
    humid = weather.get("humidity", 85.0)

    # 2. ML Prediction & Physical Explanation
    ml_result = ml_service.predict({
        "rainfall_24h": r24,
        "rainfall_72h": r72,
        "rainfall_7d": r7d,
        "soil_moisture": soil_m,
        "temperature": temp,
        "humidity": humid,
        "slope_degree": slope,
        "elevation": elevation,
        "historical_landslide_count": 2,
        "distance_to_road": 0.4,
        "distance_to_drainage": 0.2,
        "land_cover": "Dense Forest",
        "geological_factor": 0.78,
        "ground_movement": 6.5,
    })

    engine_result = compute_risk(
        rainfall_24h=r24,
        rainfall_72h=r72,
        rainfall_7d=r7d,
        soil_moisture=soil_m,
        temperature=temp,
        humidity=humid,
        slope_degree=slope,
        elevation=elevation,
        historical_landslide_count=2,
        distance_to_road=0.4,
        distance_to_drainage=0.2,
        land_cover="Dense Forest",
        geological_factor=0.78,
        ground_movement=6.5,
    )

    # 3. Nearby Infrastructure
    nearby_infra = gis_service.get_nearby_infrastructure(lat, lon, radius_km=35.0)

    return LocationAnalysisOut(
        location_name=loc_name,
        district=district,
        state=state,
        coordinates=[lat, lon],
        elevation_m=elevation,
        slope_deg=slope,
        geology=geology,
        weather=weather,
        risk_score=ml_result["risk_score"],
        risk_level=ml_result["risk_level"],
        risk_probability=ml_result["risk_probability"],
        risk_factors=ml_result["risk_factors"],
        explanations=engine_result["explanation"],
        action_directive=engine_result["recommended_action"],
        nearby_infrastructure=nearby_infra,
        historical_events_count=2,
        data_source=DataSourceMeta(
            source="LIVE" if weather_service.is_live else "DEMO",
            provider="SlopeShield Realtime Multi-factor Pipeline",
            model_version=ml_result["model_version"],
            last_updated=datetime.now(timezone.utc).isoformat(),
        ),
    )


@router.get("/geocode")
async def geocode_query(q: str = Query(...)):
    """Search reference gazetteer for matching towns and sectors in NER."""
    result = geocode_location(q)
    if not result:
        return {"found": False, "query": q, "matches": NER_GAZETTEER[:4]}
    return {"found": True, "location": result}


@router.get("/{id}", response_model=LocationDetailOut)
async def get_location_details(id: str, db: AsyncSession = Depends(get_db)):
    loc = (await db.execute(select(Location).where(Location.id == id))).scalar_one_or_none()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    pred = (await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.location_id == id)
        .order_by(RiskPrediction.predicted_at.desc())
        .limit(1)
    )).scalar_one_or_none()

    events = (await db.execute(
        select(HistoricalLandslide).where(HistoricalLandslide.location_id == id)
    )).scalars().all()

    risk_score = pred.risk_score if pred else 50.0
    risk_level = pred.risk_level if pred else "Moderate"
    r_mm = pred.rainfall_24h if pred else 45.0
    r_desc = "Heavy" if r_mm > 100 else "Moderate" if r_mm > 40 else "Light"

    factors = []
    if pred and pred.explanation:
        try:
            factors = json.loads(pred.explanation)
        except Exception:
            factors = []

    sensors = sensor_service.get_sensors_for_location(id)

    return LocationDetailOut(
        id=loc.id,
        name=loc.name,
        district=loc.district,
        state=loc.state,
        coordinates=[loc.latitude, loc.longitude],
        elevation=loc.elevation or 1200.0,
        slope=loc.slope or 30.0,
        land_cover=loc.land_cover or "Forest",
        geological_class=loc.geological_class or "Metamorphic Complex",
        risk_score=risk_score,
        risk_level=risk_level,
        rainfall=r_desc,
        rainfall_mm=r_mm,
        last_updated=loc.updated_at.isoformat() if loc.updated_at else datetime.now(timezone.utc).isoformat(),
        status=loc.status or "Active",
        data_coverage=loc.data_coverage or 90.0,
        historical_events=[
            {"date": e.date, "type": e.type, "severity": e.severity, "description": e.description}
            for e in events
        ],
        forecast={
            "hours24": min(100.0, round(risk_score * 1.08, 1)),
            "hours48": min(100.0, round(risk_score * 1.04, 1)),
            "hours72": max(0.0, round(risk_score * 0.92, 1)),
        },
        ai_recommendation=pred.recommended_action if pred else "Routine telemetry monitoring active.",
        risk_factors=factors,
        sensors=sensors,
        data_source=DataSourceMeta(
            source="DEMO",
            last_updated=datetime.now(timezone.utc).isoformat(),
            provider="SlopeShield AI Location Dossier",
        ),
    )


@router.get("/{id}/risk-history")
async def get_risk_history(id: str, db: AsyncSession = Depends(get_db)):
    preds = (await db.execute(
        select(RiskPrediction)
        .where(RiskPrediction.location_id == id)
        .order_by(RiskPrediction.predicted_at.desc())
        .limit(30)
    )).scalars().all()
    return {
        "location_id": id,
        "history": [
            {"timestamp": p.predicted_at.isoformat(), "score": p.risk_score, "rainfall": p.rainfall_24h}
            for p in preds
        ]
    }
